'use client';
import { useCallback } from 'react';

const AGENT_TYPES = [
  {
    type: 'input',
    icon: '🔤',
    label: 'Text Input',
    description: 'Starting point — provide text',
    color: 'var(--node-input)',
  },
  {
    type: 'web_searcher',
    icon: '🔍',
    label: 'Web Searcher',
    description: 'Search the web for info',
    color: 'var(--node-searcher)',
  },
  {
    type: 'writer',
    icon: '✍️',
    label: 'Writer',
    description: 'Write content with AI',
    color: 'var(--node-writer)',
  },
  {
    type: 'summarizer',
    icon: '📝',
    label: 'Summarizer',
    description: 'Condense long text',
    color: 'var(--node-summarizer)',
  },
  {
    type: 'code_generator',
    icon: '💻',
    label: 'Code Generator',
    description: 'Generate code in any language',
    color: 'var(--node-code)',
  },
  {
    type: 'transformer',
    icon: '🔄',
    label: 'Transformer',
    description: 'Translate, reformat, rewrite',
    color: 'var(--node-transformer)',
  },
  {
    type: 'output',
    icon: '📤',
    label: 'Output',
    description: 'Display final result',
    color: 'var(--node-output)',
  },
];

export default function Sidebar() {
  const onDragStart = useCallback((event, agentType) => {
    event.dataTransfer.setData('application/reactflow', agentType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <aside
      style={{
        width: 220,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 14px 12px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Agent Nodes
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          Drag onto canvas
        </div>
      </div>

      {/* Agent List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {AGENT_TYPES.map((agent) => (
          <div
            key={agent.type}
            draggable
            onDragStart={(e) => onDragStart(e, agent.type)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '10px 12px',
              cursor: 'grab',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              userSelect: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = agent.color;
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--bg-card)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: `${agent.color}20`,
                border: `1px solid ${agent.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {agent.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                {agent.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {agent.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div
        style={{
          padding: '10px 14px',
          borderTop: '1px solid var(--border)',
          fontSize: 11,
          color: 'var(--text-muted)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        Connect nodes by dragging<br />from handle to handle
      </div>
    </aside>
  );
}
