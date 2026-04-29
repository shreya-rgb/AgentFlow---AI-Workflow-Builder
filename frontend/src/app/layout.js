import './globals.css';

export const metadata = {
  title: 'AgentFlow — AI Workflow Builder',
  description: 'Visual drag-and-drop AI agent workflow builder',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
