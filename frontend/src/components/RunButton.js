'use client';
import { useCallback } from 'react';
import useWorkflowStore from '@/store/workflowStore';
import { executeWorkflow } from '@/utils/api';

export default function RunButton() {
  const {
    nodes,
    edges,
    isRunning,
    setIsRunning,
    addLog,
    clearLogs,
    setNodeStatus,
    resetNodeStatuses,
  } = useWorkflowStore();

  const handleRun = useCallback(async () => {
    if (isRunning) return;

    if (nodes.length === 0) {
      alert('Add some nodes to the canvas first!');
      return;
    }

    // Validate: must have at least one input node with text
    const inputNodes = nodes.filter((n) => n.data.nodeType === 'input');
    if (inputNodes.length === 0) {
      alert('Your workflow needs a Text Input node as a starting point.');
      return;
    }
    const emptyInputs = inputNodes.filter((n) => !n.data.inputText?.trim());
    if (emptyInputs.length > 0) {
      alert('Please fill in the Input Text for your Text Input node before running.');
      return;
    }

    // Validate: nodes (except lone output) should be connected
    if (nodes.length > 1 && edges.length === 0) {
      alert('Your nodes are not connected. Draw connections between nodes before running.');
      return;
    }

    clearLogs();
    resetNodeStatuses();
    setIsRunning(true);

    const onEvent = (data) => {
      addLog(data);

      switch (data.type) {
        case 'node_start':
          setNodeStatus(data.node_id, 'running');
          break;
        case 'node_done':
          setNodeStatus(data.node_id, 'done', data.output);
          break;
        case 'node_error':
          setNodeStatus(data.node_id, 'error', null, data.error);
          break;
        case 'complete':
          setIsRunning(false);
          break;
        case 'error':
          setIsRunning(false);
          break;
      }
    };

    const onError = (message) => {
      addLog({ type: 'error', message: `Connection error: ${message}` });
      setIsRunning(false);
    };

    await executeWorkflow(nodes, edges, onEvent, onError);
    setIsRunning(false);
  }, [nodes, edges, isRunning, setIsRunning, addLog, clearLogs, setNodeStatus, resetNodeStatuses]);

  return (
    <button
      onClick={handleRun}
      disabled={isRunning}
      style={{
        background: isRunning
          ? 'rgba(108, 99, 255, 0.4)'
          : 'var(--accent)',
        color: 'white',
        padding: '8px 20px',
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: isRunning ? 'not-allowed' : 'pointer',
        boxShadow: isRunning ? 'none' : '0 0 16px var(--accent-glow)',
        transition: 'all 0.2s ease',
        border: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isRunning) {
          e.currentTarget.style.background = 'var(--accent-hover)';
          e.currentTarget.style.boxShadow = '0 0 24px var(--accent-glow)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isRunning) {
          e.currentTarget.style.background = 'var(--accent)';
          e.currentTarget.style.boxShadow = '0 0 16px var(--accent-glow)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {isRunning ? (
        <>
          <span
            style={{
              display: 'inline-block',
              width: 14,
              height: 14,
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          Running...
        </>
      ) : (
        <>
          <span style={{ fontSize: 14 }}>▶</span>
          Run
        </>
      )}
    </button>
  );
}
