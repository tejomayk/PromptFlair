import React from 'react';
import { createRoot } from 'react-dom/client';
import { SidePanel } from './components/SidePanel';

// Find the root div in our index.html where the app will be mounted
const container = document.getElementById('root');

// Ensure the container element exists before trying to render into it
if (container) {
  // Create a root for the React application
  const root = createRoot(container);
  
  // Render our main SidePanel component inside the root
  root.render(
    <React.StrictMode>
      <SidePanel />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. The 'root' div is missing from index.html.");
}