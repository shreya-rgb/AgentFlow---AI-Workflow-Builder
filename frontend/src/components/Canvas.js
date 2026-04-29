'use client';
import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import useWorkflowStore from '@/store/workflowStore';
import AgentNode from './nodes/AgentNode';

const nodeTypes = {
  agentNode: AgentNode,
};

let nodeIdCounter = 1;
function generateNodeId() {
  return `node_${Date.now()}_${nodeIdCounter++}`;
}

const DEFAULT_NODE_DATA = {
  input: { label: 'Text Input', nodeType: 'input', inputText: '' },
  web_searcher: { label: 'Web Searcher', nodeType: 'web_searcher', prompt: '' },
  writer: { label: 'Writer', nodeType: 'writer', prompt: '', model: 'gpt-4o-mini', temperature: 0.7 },
  summarizer: { label: 'Summarizer', nodeType: 'summarizer', prompt: '', model: 'gpt-4o-mini', temperature: 0.3 },
  code_generator: { label: 'Code Generator', nodeType: 'code_generator', prompt: '', language: 'Python', model: 'gpt-4o-mini', temperature: 0.2 },
  transformer: { label: 'Transformer', nodeType: 'transformer', prompt: '', model: 'gpt-4o-mini', temperature: 0.5 },
  output: { label: 'Output', nodeType: 'output' },
};

function CanvasInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, setSelectedNode } = useWorkflowStore();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [zoom, setZoom] = useState(1);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const agentType = event.dataTransfer.getData('application/reactflow');
    if (!agentType || !reactFlowInstance) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    const newNode = {
      id: generateNodeId(),
      type: 'agentNode',
      position,
      data: { ...(DEFAULT_NODE_DATA[agentType] || { label: agentType, nodeType: agentType }) },
    };
    addNode(newNode);
  }, [reactFlowInstance, addNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const handleZoomIn = () => reactFlowInstance?.zoomIn();
  const handleZoomOut = () => reactFlowInstance?.zoomOut();
  const handleFitView = () => reactFlowInstance?.fitView({ padding: 0.2 });

  return (
    <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0a0a0f' }}>
      {/* Dot grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{ style: { strokeWidth: 2, stroke: '#333345' } }}
        connectionLineStyle={{ stroke: '#6c63ff', strokeWidth: 2 }}
        snapToGrid
        snapGrid={[16, 16]}
        deleteKeyCode="Delete"
        style={{ background: 'transparent' }}
        proOptions={{ hideAttribution: true }}
      />

      {/* Custom zoom controls — no sub-package needed */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 4,
        background: '#16161f', border: '1px solid #2a2a3a',
        borderRadius: 10, overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}>
        {[
          { label: '+', action: handleZoomIn, title: 'Zoom in' },
          { label: '−', action: handleZoomOut, title: 'Zoom out' },
          { label: '⊡', action: handleFitView, title: 'Fit view' },
        ].map(({ label, action, title }) => (
          <button
            key={label}
            onClick={action}
            title={title}
            style={{
              background: 'transparent', border: 'none',
              borderBottom: '1px solid #2a2a3a',
              color: '#9090b0', fontSize: 16,
              width: 32, height: 32,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1e1e2a'; e.currentTarget.style.color = '#f0f0ff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9090b0'; }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', gap: 12, zIndex: 1,
        }}>
          <div style={{ fontSize: 48, opacity: 0.3 }}>🤖</div>
          <div style={{ fontSize: 16, color: '#5a5a7a', fontWeight: 500 }}>
            Drag agents from the sidebar to get started
          </div>
          <div style={{ fontSize: 13, color: '#5a5a7a', opacity: 0.7 }}>
            Or load a template from the top bar
          </div>
        </div>
      )}
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
