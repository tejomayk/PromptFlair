import { useState, useEffect } from 'react';

// This is a global variable for the loaded Pyodide instance
declare global {
  interface Window {
    loadPyodide: () => Promise<any>;
    pyodide: any;
  }
}

// Define the shape of our hook's return value
interface UsePyodideReturn {
  isPyodideLoading: boolean;
  analyzePrompt: (prompt: string) => Promise<string[]>;
}

export const usePyodide = (): UsePyodideReturn => {
  const [isPyodideLoading, setIsPyodideLoading] = useState<boolean>(true);

  // useEffect runs once when the component using this hook mounts
  useEffect(() => {
    const loadPyodideAndPackages = async () => {
      try {
        // First, load the main Pyodide script from the Chrome extension's files
        // This script is not part of our bundle, so we create a script tag for it.
        // NOTE: For a real extension, we'd get this URL dynamically.
        const pyodideUrl = chrome.runtime.getURL('pyodide/pyodide.js');
        await import(/* @vite-ignore */ pyodideUrl);
        
        // The script adds a `loadPyodide` function to the window object
        const pyodide = await window.loadPyodide();
        // Make pyodide globally accessible for easy access
        window.pyodide = pyodide;

        // Now, fetch our Python script as plain text
        const pythonScriptUrl = chrome.runtime.getURL('py_core/rules_engine.py');
        const pythonScript = await fetch(pythonScriptUrl).then(res => res.text());
        
        // Run the Python script to define our functions in Pyodide's scope
        pyodide.runPython(pythonScript);
        
        console.log("Pyodide and Python script loaded successfully.");
        setIsPyodideLoading(false); // We are ready!

      } catch (error) {
        console.error("Failed to load Pyodide or Python script:", error);
        setIsPyodideLoading(false); // Stop loading even if there's an error
      }
    };

    loadPyodideAndPackages();
  }, []); // The empty array [] means this effect runs only once

  // This is the function our UI will call
  const analyzePrompt = async (prompt: string): Promise<string[]> => {
    if (!window.pyodide || isPyodideLoading) {
      console.error("Pyodide is not ready.");
      return [];
    }
    
    try {
      // Get a reference to our Python function from the Pyodide instance
      const analyzeFn = window.pyodide.globals.get('analyze_prompt');
      
      // Call the Python function with the prompt text
      const resultJson = analyzeFn(prompt);
      
      // The result is a JSON string, so we parse it into a JavaScript array
      const suggestions: string[] = JSON.parse(resultJson);
      
      return suggestions;
    } catch (error) {
      console.error("Error executing Python function:", error);
      return [];
    }
  };

  return { isPyodideLoading, analyzePrompt };
};