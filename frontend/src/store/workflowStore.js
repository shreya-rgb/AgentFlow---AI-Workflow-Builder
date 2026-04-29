import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';

const useWorkflowStore = create((set, get) => ({
  // ─── Canvas State ──────────────────────────────────────────────────────────
  nodes: [],
  edges: [],
  selectedNode: null,

  // ─── Execution State ───────────────────────────────────────────────────────
  isRunning: false,
  executionLogs: [],
  nodeStatuses: {}, // { nodeId: { status, output, error } }

  // ─── Workflow Meta ─────────────────────────────────────────────────────────
  workflowTitle: 'Untitled Workflow',
  savedWorkflowId: null,

  // ─── Node Operations ───────────────────────────────────────────────────────
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    set({ edges: addEdge({ ...connection, animated: false }, get().edges) });
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  updateNodeData: (nodeId, newData) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n
      ),
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode,
    });
  },

  setSelectedNode: (node) => {
    set({ selectedNode: node });
  },

  // ─── Execution Operations ──────────────────────────────────────────────────
  setIsRunning: (val) => set({ isRunning: val }),

  addLog: (log) => {
    set({ executionLogs: [...get().executionLogs, { ...log, timestamp: Date.now() }] });
  },

  clearLogs: () => {
    set({ executionLogs: [], nodeStatuses: {} });
  },

  setNodeStatus: (nodeId, status, output = null, error = null) => {
    set({
      nodeStatuses: {
        ...get().nodeStatuses,
        [nodeId]: { status, output, error },
      },
    });
  },

  resetNodeStatuses: () => {
    set({ nodeStatuses: {} });
  },

  // ─── Workflow Meta ─────────────────────────────────────────────────────────
  setWorkflowTitle: (title) => set({ workflowTitle: title }),
  setSavedWorkflowId: (id) => set({ savedWorkflowId: id }),

  loadWorkflow: (title, nodes, edges) => {
    set({
      workflowTitle: title,
      nodes,
      edges,
      selectedNode: null,
      executionLogs: [],
      nodeStatuses: {},
    });
  },

  clearCanvas: () => {
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      executionLogs: [],
      nodeStatuses: {},
      workflowTitle: 'Untitled Workflow',
      savedWorkflowId: null,
    });
  },
}));

export default useWorkflowStore;
