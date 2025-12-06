import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { TaskProvider } from './src/contexts/TaskContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </ThemeProvider>
  </StrictMode>
);