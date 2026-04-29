'use client';
import { useState, useCallback, useEffect } from 'react';
import useWorkflowStore from '@/store/workflowStore';
import { saveWorkflow, updateWorkflow, listWorkflows, loadWorkflow, deleteWorkflow, checkHealth } from '@/utils/api';
import RunButton from './RunButton';

const TEMPLATES = {
  research: {
    title: 'Research Assistant',
    nodes: [
      { id: 'n1', type: 'agentNode', position: { x: 80, y: 180 }, data: { label: 'Topic', nodeType: 'input', inputText: 'AI trends in 2026' } },
      { id: 'n2', type: 'agentNode', position: { x: 340, y: 180 }, data: { label: 'Web Search', nodeType: 'web_searcher', prompt: '' } },
      { id: 'n3', type: 'agentNode', position: { x: 600, y: 180 }, data: { label: 'Summarize', nodeType: 'summarizer', prompt: 'Summarize the key findings in bullet points', model: 'gpt-4o-mini', temperature: 0.3 } },
      { id: 'n4', type: 'agentNode', position: { x: 860, y: 180 }, data: { label: 'Result', nodeType: 'output' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
      { id: 'e3', source: 'n3', target: 'n4' },
    ],
  },
  content: {
    title: 'Content Creator',
    nodes: [
      { id: 'n1', type: 'agentNode', position: { x: 80, y: 180 }, data: { label: 'Topic', nodeType: 'input', inputText: 'The future of renewable energy' } },
      { id: 'n2', type: 'agentNode', position: { x: 340, y: 100 }, data: { label: 'Research', nodeType: 'web_searcher', prompt: '' } },
      { id: 'n3', type: 'agentNode', position: { x: 600, y: 180 }, data: { label: 'Write Article', nodeType: 'writer', prompt: 'Write an engaging 500-word blog post based on the research', model: 'gpt-4o-mini', temperature: 0.7 } },
      { id: 'n4', type: 'agentNode', position: { x: 860, y: 100 }, data: { label: 'Translate', nodeType: 'transformer', prompt: 'Translate to Spanish while keeping the same tone', model: 'gpt-4o-mini', temperature: 0.3 } },
      { id: 'n5', type: 'agentNode', position: { x: 1100, y: 180 }, data: { label: 'Output', nodeType: 'output' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
      { id: 'e3', source: 'n3', target: 'n4' },
      { id: 'e4', source: 'n4', target: 'n5' },
    ],
  },
  code: {
    title: 'Code Review Chain',
    nodes: [
      { id: 'n1', type: 'agentNode', position: { x: 80, y: 180 }, data: { label: 'Requirements', nodeType: 'input', inputText: 'Build a REST API endpoint that handles user authentication with JWT tokens' } },
      { id: 'n2', type: 'agentNode', position: { x: 340, y: 180 }, data: { label: 'Generate Code', nodeType: 'code_generator', prompt: 'Write clean, production-ready code', language: 'Python', model: 'gpt-4o-mini', temperature: 0.2 } },
      { id: 'n3', type: 'agentNode', position: { x: 600, y: 180 }, data: { label: 'Code Review', nodeType: 'writer', prompt: 'Review this code for security issues, bugs, and improvements. Format as a structured review with sections: Security, Performance, Code Quality, Suggestions', model: 'gpt-4o-mini', temperature: 0.3 } },
      { id: 'n4', type: 'agentNode', position: { x: 860, y: 180 }, data: { label: 'Summary', nodeType: 'summarizer', prompt: 'Create a concise executive summary of the code review', model: 'gpt-4o-mini', temperature: 0.3 } },
      { id: 'n5', type: 'agentNode', position: { x: 1100, y: 180 }, data: { label: 'Output', nodeType: 'output' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
      { id: 'e3', source: 'n3', target: 'n4' },
      { id: 'e4', source: 'n4', target: 'n5' },
    ],
  },
};

export default function TopBar() {
  const {
    workflowTitle,
    setWorkflowTitle,
    nodes,
    edges,
    savedWorkflowId,
    setSavedWorkflowId,
    loadWorkflow: loadWorkflowStore,
    clearCanvas,
  } = useWorkflowStore();

  const [saving, setSaving] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [savedWorkflows, setSavedWorkflows] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);

  useEffect(() => {
    checkHealth().then(setHealthStatus);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      if (savedWorkflowId) {
        await updateWorkflow(savedWorkflowId, workflowTitle, nodes, edges);
      } else {
        const result = await saveWorkflow(workflowTitle, nodes, edges);
        setSavedWorkflowId(result.id);
      }
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  }, [savedWorkflowId, workflowTitle, nodes, edges, setSavedWorkflowId]);

  const handleLoadList = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await listWorkflows();
      setSavedWorkflows(data.workflows || []);
      setShowLoadModal(true);
    } catch (err) {
      alert('Failed to load workflows: ' + err.message);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const handleLoadWorkflow = useCallback(async (id) => {
    try {
      const data = await loadWorkflow(id);
      loadWorkflowStore(data.title, data.nodes, data.edges);
      setSavedWorkflowId(id);
      setShowLoadModal(false);
    } catch (err) {
      alert('Failed to load workflow: ' + err.message);
    }
  }, [loadWorkflowStore, setSavedWorkflowId]);

  const handleDeleteWorkflow = useCallback(async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this workflow?')) return;
    try {
      await deleteWorkflow(id);
      setSavedWorkflows((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  }, []);

  const handleTemplate = useCallback((key) => {
    const t = TEMPLATES[key];
    if (!t) return;
    if (nodes.length > 0 && !confirm('Load template? This will replace the current canvas.')) return;
    loadWorkflowStore(t.title, t.nodes, t.edges);
    setSavedWorkflowId(null);
  }, [nodes.length, loadWorkflowStore, setSavedWorkflowId]);

  return (
    <>
      <header
        style={{
          height: 52,
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12,
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            AgentFlow
          </span>
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        {/* Title */}
        {editingTitle ? (
          <input
            autoFocus
            value={workflowTitle}
            onChange={(e) => setWorkflowTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--accent)',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-primary)',
              width: 200,
            }}
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: 13,
              fontWeight: 500,
              padding: '4px 8px',
              borderRadius: 6,
              border: '1px solid transparent',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
          >
            {workflowTitle} ✏️
          </button>
        )}

        {/* Templates */}
        <div style={{ display: 'flex', gap: 6 }}>
          {Object.entries({ research: '🔬 Research', content: '✍️ Content', code: '💻 Code Review' }).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleTemplate(key)}
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 12,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Health indicator */}
          {healthStatus && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 10px',
                borderRadius: 20,
                background: healthStatus.status === 'ok' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${healthStatus.status === 'ok' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                fontSize: 11,
                color: healthStatus.status === 'ok' ? 'var(--green)' : 'var(--red)',
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: healthStatus.status === 'ok' ? 'var(--green)' : 'var(--red)',
                }}
              />
              {healthStatus.status === 'ok'
                ? healthStatus.mode === 'mock' ? 'Mock Mode' : 'Live AI'
                : 'Backend Offline'}
            </div>
          )}

          {/* Clear */}
          <button
            onClick={() => {
              if (nodes.length > 0 && confirm('Clear the canvas?')) clearCanvas();
            }}
            className="btn-ghost"
            style={{ fontSize: 12 }}
          >
            🗑️ Clear
          </button>

          {/* Load */}
          <button
            onClick={handleLoadList}
            disabled={loadingList}
            className="btn-ghost"
            style={{ fontSize: 12 }}
          >
            📂 Load
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || nodes.length === 0}
            className="btn-primary"
            style={{ fontSize: 12 }}
          >
            {saving ? '💾 Saving...' : '💾 Save'}
          </button>

          {/* Run */}
          <RunButton />
        </div>
      </header>

      {/* Load Modal */}
      {showLoadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowLoadModal(false)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
              width: 420,
              maxHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                📂 Load Workflow
              </h3>
              <button
                onClick={() => setShowLoadModal(false)}
                style={{ marginLeft: 'auto', background: 'transparent', color: 'var(--text-muted)', fontSize: 18 }}
              >
                ×
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {savedWorkflows.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0', fontSize: 13 }}>
                  No saved workflows yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {savedWorkflows.map((w) => (
                    <div
                      key={w.id}
                      onClick={() => handleLoadWorkflow(w.id)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '12px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent)';
                        e.currentTarget.style.background = 'var(--bg-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                      }}
                    >
                      <span style={{ fontSize: 18 }}>📋</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{w.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {new Date(w.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteWorkflow(w.id, e)}
                        style={{
                          background: 'transparent',
                          color: 'var(--text-muted)',
                          fontSize: 14,
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--red)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
