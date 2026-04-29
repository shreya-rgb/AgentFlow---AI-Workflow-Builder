'use client';
import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import useWorkflowStore from '@/store/workflowStore';

const NODE_CONFIG = {
  input: {
    icon: '🔤',
    color: 'var(--node-input)',
    label: 'Text Input',
    hasInput: false,
    hasOutput: true,
  },
  web_searcher: {
    icon: '🔍',
    color: 'var(--node-searcher)',
    label: 'Web Searcher',
    hasInput: true,
    hasOutput: true,
  },
  writer: {
    icon: '✍️',
    color: 'var(--node-writer)',
    label: 'Writer',
    hasInput: true,
    hasOutput: true,
  },
  summarizer: {
    icon: '📝',
    color: 'var(--node-summarizer)',
    label: 'Summarizer',
    hasInput: true,
    hasOutput: true,
  },
  code_generator: {
    icon: '💻',
    color: 'var(--node-code)',
    label: 'Code Generator',
    hasInput: true,
    hasOutput: true,
  },
  transformer: {
    icon: '🔄',
    color: 'var(--node-transformer)',
    label: 'Transformer',
    hasInput: true,
    hasOutput: true,
  },
  output: {
    icon: '📤',
    color: 'var(--node-output)',
    label: 'Output',
    hasInput: true,
    hasOutput: false,
  },
};

const STATUS_CONFIG = {
  running: { icon: '⏳', color: 'var(--yellow)', glow: 'var(--yellow-glow)', label: 'Running...' },
  done: { icon: '✅', color: 'var(--green)', glow: 'var(--green-glow)', label: 'Done' },
  error: { icon: '❌', color: 'var(--red)', glow: 'var(--red-glow)', label: 'Error' },
};

function AgentNode({ id, data, selected }) {
  const { setSelectedNode, nodeStatuses, nodes } = useWorkflowStore();
  const config = NODE_CONFIG[data.nodeType] || NODE_CONFIG.writer;
  const status = nodeStatuses[id];
  const statusConfig = status ? STATUS_CONFIG[status.status] : null;

  const isRunning = status?.status === 'running';
  const isDone = status?.status === 'done';
  const isError = status?.status === 'error';

  const handleClick = useCallback(() => {
    const node = nodes.find((n) => n.id === id);
    setSelectedNode(node || null);
  }, [id, nodes, setSelectedNode]);

  const glowColor = statusConfig?.glow || (selected ? 'var(--accent-glow)' : 'transparent');
  const borderColor = statusConfig?.color || (selected ? 'var(--accent)' : 'var(--border)');

  return (
    <div
      onClick={handleClick}
      style={{
        background: 'var(--bg-card)',
        border: `1.5px solid ${borderColor}`,
        borderRadius: 'var(--radius)',
        minWidth: 180,
        maxWidth: 220,
        boxShadow: `0 0 ${isRunning ? '20px' : '8px'} ${glowColor}, 0 4px 16px rgba(0,0,0,0.4)`,
        transition: 'all 0.2s ease',
        animation: isRunning ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Input Handle */}
      {config.hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: config.color,
            left: -6,
          }}
        />
      )}

      {/* Header */}
      <div
        style={{
          background: `${config.color}18`,
          borderBottom: `1px solid ${config.color}30`,
          borderRadius: 'var(--radius) var(--radius) 0 0',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16 }}>{config.icon}</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: config.color,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          {data.label || config.label}
        </span>
        {statusConfig && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 13,
              animation: isRunning ? 'spin 1s linear infinite' : 'none',
              display: 'inline-block',
            }}
          >
            {statusConfig.icon}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px' }}>
        {data.nodeType === 'input' && (
          <div
            style={{
              fontSize: 12,
              color: data.inputText ? 'var(--text-primary)' : 'var(--text-muted)',
              fontStyle: data.inputText ? 'normal' : 'italic',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 180,
            }}
          >
            {data.inputText || 'Click to set input text...'}
          </div>
        )}

        {data.nodeType !== 'input' && data.nodeType !== 'output' && (
          <div
            style={{
              fontSize: 12,
              color: data.prompt ? 'var(--text-secondary)' : 'var(--text-muted)',
              fontStyle: data.prompt ? 'normal' : 'italic',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 180,
            }}
          >
            {data.prompt || 'Click to configure...'}
          </div>
        )}

        {data.nodeType === 'output' && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {isDone ? '✓ Result ready' : 'Awaiting output...'}
          </div>
        )}

        {/* Status bar */}
        {statusConfig && (
          <div
            style={{
              marginTop: 8,
              padding: '4px 8px',
              background: `${statusConfig.color}15`,
              borderRadius: 4,
              fontSize: 11,
              color: statusConfig.color,
              fontWeight: 500,
            }}
          >
            {statusConfig.label}
          </div>
        )}
      </div>

      {/* Output Handle */}
      {config.hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: config.color,
            right: -6,
          }}
        />
      )}
    </div>
  );
}

export default memo(AgentNode);
