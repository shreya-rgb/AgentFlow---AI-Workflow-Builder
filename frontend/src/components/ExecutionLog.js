'use client';
import { useEffect, useRef, useState } from 'react';
import useWorkflowStore from '@/store/workflowStore';

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>');
}

function LogEntry({ log, index }) {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    start: 'var(--accent)',
    node_start: 'var(--yellow)',
    node_done: 'var(--green)',
    node_error: 'var(--red)',
    complete: 'var(--green)',
    error: 'var(--red)',
  };

  const statusIcons = {
    start: '🚀',
    node_start: '⏳',
    node_done: '✅',
    node_error: '❌',
    complete: '🎉',
    error: '💥',
  };

  const color = statusColors[log.type] || 'var(--text-secondary)';
  const icon = statusIcons[log.type] || '•';
  const hasOutput = log.output && log.output.length > 0;

  return (
    <div
      style={{
        animation: 'slideIn 0.2s ease forwards',
        borderLeft: `2px solid ${color}`,
        paddingLeft: 10,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          cursor: hasOutput ? 'pointer' : 'default',
        }}
        onClick={() => hasOutput && setExpanded(!expanded)}
      >
        <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>
            {log.node_label || log.message || log.type}
          </div>
          {log.type === 'node_start' && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Running...</div>
          )}
          {log.type === 'node_done' && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {hasOutput ? `${log.output.length} chars — click to expand` : 'Complete'}
            </div>
          )}
          {log.type === 'node_error' && (
            <div style={{ fontSize: 11, color: 'var(--red)' }}>{log.error}</div>
          )}
        </div>
        {hasOutput && (
          <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }}>
            {expanded ? '▲' : '▼'}
          </span>
        )}
      </div>

      {/* Expanded output */}
      {expanded && hasOutput && (
        <div
          style={{
            marginTop: 8,
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            fontSize: 12,
            color: 'var(--text-secondary)',
            maxHeight: 300,
            overflowY: 'auto',
            lineHeight: 1.6,
          }}
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(log.output) }}
        />
      )}
    </div>
  );
}

export default function ExecutionLog() {
  const { executionLogs, isRunning, clearLogs } = useWorkflowStore();
  const bottomRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [executionLogs]);

  const hasLogs = executionLogs.length > 0;

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: isCollapsed ? 40 : 220,
        transition: 'height 0.2s ease',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0 16px',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: isCollapsed ? 'none' : '1px solid var(--border)',
          flexShrink: 0,
          cursor: 'pointer',
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span style={{ fontSize: 12 }}>📋</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Execution Log
        </span>
        {isRunning && (
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--green)',
              boxShadow: '0 0 6px var(--green)',
              animation: 'pulse-glow 1s ease-in-out infinite',
            }}
          />
        )}
        {hasLogs && (
          <span
            style={{
              background: 'var(--accent)',
              color: 'white',
              fontSize: 10,
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: 10,
            }}
          >
            {executionLogs.length}
          </span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {hasLogs && !isRunning && (
            <button
              onClick={(e) => { e.stopPropagation(); clearLogs(); }}
              style={{
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 4,
                border: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Clear
            </button>
          )}
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {isCollapsed ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Log entries */}
      {!isCollapsed && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px',
          }}
        >
          {!hasLogs ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--text-muted)',
                fontSize: 12,
                fontStyle: 'italic',
              }}
            >
              Run a workflow to see execution logs here
            </div>
          ) : (
            <>
              {executionLogs.map((log, i) => (
                <LogEntry key={i} log={log} index={i} />
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
