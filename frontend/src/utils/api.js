const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ─── Execute Workflow (SSE) ────────────────────────────────────────────────────

export async function executeWorkflow(nodes, edges, onEvent, onError) {
  try {
    const response = await fetch(`${API_BASE}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes, edges }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onEvent(data);
          } catch (e) {
            // Skip malformed events
          }
        }
      }
    }
  } catch (err) {
    onError(err.message || 'Connection failed');
  }
}

// ─── Workflows CRUD ────────────────────────────────────────────────────────────

export async function listWorkflows() {
  const res = await fetch(`${API_BASE}/workflows`);
  if (!res.ok) throw new Error('Failed to load workflows');
  return res.json();
}

export async function saveWorkflow(title, nodes, edges) {
  const res = await fetch(`${API_BASE}/workflows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, nodes, edges }),
  });
  if (!res.ok) throw new Error('Failed to save workflow');
  return res.json();
}

export async function updateWorkflow(id, title, nodes, edges) {
  const res = await fetch(`${API_BASE}/workflows/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, nodes, edges }),
  });
  if (!res.ok) throw new Error('Failed to update workflow');
  return res.json();
}

export async function loadWorkflow(id) {
  const res = await fetch(`${API_BASE}/workflows/${id}`);
  if (!res.ok) throw new Error('Failed to load workflow');
  return res.json();
}

export async function deleteWorkflow(id) {
  const res = await fetch(`${API_BASE}/workflows/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete workflow');
  return res.json();
}

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  } catch {
    return { status: 'error', mode: 'unknown' };
  }
}
