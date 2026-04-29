'use client';
import { useCallback } from 'react';
import useWorkflowStore from '@/store/workflowStore';

const LABEL_MAP = {
  input: 'Text Input',
  web_searcher: 'Web Searcher',
  writer: 'Writer',
  summarizer: 'Summarizer',
  code_generator: 'Code Generator',
  transformer: 'Transformer',
  output: 'Output',
};

const COLOR_MAP = {
  input: 'var(--node-input)',
  web_searcher: 'var(--node-searcher)',
  writer: 'var(--node-writer)',
  summarizer: 'var(--node-summarizer)',
  code_generator: 'var(--node-code)',
  transformer: 'var(--node-transformer)',
  output: 'var(--node-output)',
};

const ICON_MAP = {
  input: '🔤',
  web_searcher: '🔍',
  writer: '✍️',
  summarizer: '📝',
  code_generator: '💻',
  transformer: '🔄',
  output: '📤',
};

const PROMPT_PLACEHOLDERS = {
  web_searcher: 'e.g. "latest AI research papers 2026"',
  writer: 'e.g. "Write a blog post about the search results"',
  summarizer: 'e.g. "Summarize in 3 bullet points"',
  code_generator: 'e.g. "Write a Python script that processes the data"',
  transformer: 'e.g. "Translate to Spanish" or "Convert to JSON format"',
};

export default function ConfigPanel() {
  const { selectedNode, updateNodeData, deleteNode, setSelectedNode, nodeStatuses } = useWorkflowStore();

  const handleChange = useCallback(
    (field, value) => {
      if (!selectedNode) return;
      updateNodeData(selectedNode.id, { [field]: value });
    },
    [selectedNode, updateNodeData]
  );

  const handleDelete = useCallback(() => {
    if (!selectedNode) return;
    deleteNode(selectedNode.id);
  }, [selectedNode, deleteNode]);

  if (!selectedNode) {
    return (
      <aside
        style={{
          width: 260,
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>🖱️</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
          Click a node to configure it
        </div>
      </aside>
    );
  }

  const { data, id } = selectedNode;
  const nodeType = data.nodeType;
  const color = COLOR_MAP[nodeType] || 'var(--accent)';
  const icon = ICON_MAP[nodeType] || '🤖';
  const status = nodeStatuses[id];

  return (
    <aside
      style={{
        width: 260,
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: `${color}20`,
            border: `1px solid ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {LABEL_MAP[nodeType] || nodeType}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Node Configuration</div>
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          style={{
            marginLeft: 'auto',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: 16,
            padding: '2px 6px',
            borderRadius: 4,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ×
        </button>
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Label */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
            Label
          </label>
          <input
            value={data.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="Node label..."
          />
        </div>

        {/* Input Text (for input nodes) */}
        {nodeType === 'input' && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
              Input Text
            </label>
            <textarea
              value={data.inputText || ''}
              onChange={(e) => handleChange('inputText', e.target.value)}
              placeholder="Enter the starting text for your workflow..."
              style={{ minHeight: 100 }}
            />
          </div>
        )}

        {/* Prompt (for AI nodes) */}
        {nodeType !== 'input' && nodeType !== 'output' && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
              {nodeType === 'web_searcher' ? 'Search Query (optional)' : 'Custom Prompt (optional)'}
            </label>
            <textarea
              value={data.prompt || ''}
              onChange={(e) => handleChange('prompt', e.target.value)}
              placeholder={PROMPT_PLACEHOLDERS[nodeType] || 'Custom instructions...'}
              style={{ minHeight: 80 }}
            />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Leave empty to use default behavior
            </div>
          </div>
        )}

        {/* Language (for code generator) */}
        {nodeType === 'code_generator' && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
              Language
            </label>
            <select
              value={data.language || 'Python'}
              onChange={(e) => handleChange('language', e.target.value)}
            >
              {['Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Java', 'C++', 'SQL', 'Bash'].map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        )}

        {/* Model (for AI nodes) */}
        {nodeType !== 'input' && nodeType !== 'output' && nodeType !== 'web_searcher' && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
              Model
            </label>
            <select
              value={data.model || 'gpt-4o-mini'}
              onChange={(e) => handleChange('model', e.target.value)}
            >
              <option value="gpt-4o-mini">GPT-4o Mini (fast)</option>
              <option value="gpt-4o">GPT-4o (powerful)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
          </div>
        )}

        {/* Temperature */}
        {nodeType !== 'input' && nodeType !== 'output' && nodeType !== 'web_searcher' && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
              Temperature: {(data.temperature ?? 0.7).toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={data.temperature ?? 0.7}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              style={{
                width: '100%',
                accentColor: color,
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>
        )}

        {/* Execution Output */}
        {status?.output && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
              ✅ Last Output
            </label>
            <div
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                fontSize: 12,
                color: 'var(--text-secondary)',
                maxHeight: 150,
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {status.output.slice(0, 500)}{status.output.length > 500 ? '...' : ''}
            </div>
          </div>
        )}

        {status?.error && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
              ❌ Error
            </label>
            <div
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                fontSize: 12,
                color: 'var(--red)',
              }}
            >
              {status.error}
            </div>
          </div>
        )}
      </div>

      {/* Delete Button */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleDelete}
          style={{
            width: '100%',
            background: 'rgba(239,68,68,0.1)',
            color: 'var(--red)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px',
            fontSize: 13,
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
          }}
        >
          🗑️ Delete Node
        </button>
      </div>
    </aside>
  );
}
