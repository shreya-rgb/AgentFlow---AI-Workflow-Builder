'use client';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import ConfigPanel from '@/components/ConfigPanel';
import ExecutionLog from '@/components/ExecutionLog';
import Canvas from '@/components/Canvas';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}
    >
      <TopBar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <Canvas />
          <ExecutionLog />
        </div>
        <ConfigPanel />
      </div>
    </div>
  );
}
