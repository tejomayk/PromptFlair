import React, { useState, useEffect } from 'react';
import { usePyodide } from '../hooks/usePyodide';
import '../styles/main.css';

export const SidePanel = () => {
  // Use our custom hook to get the Python analysis function and loading state
  const { isPyodideLoading, analyzePrompt } = usePyodide();

  // State to hold the text from the text area
  const [promptText, setPromptText] = useState<string>('');
  // State to hold the suggestions we get back from Python
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // State to show a loading spinner when we are analyzing
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Function to handle the "Analyze" button click
  const handleAnalyzeClick = async () => {
    if (!promptText.trim()) return; // Don't analyze empty text
    
    setIsAnalyzing(true);
    const results = await analyzePrompt(promptText);
    setSuggestions(results);
    setIsAnalyzing(false);
  };

  return (
    <div className="sidepanel-container">
      <header>
        <h2>✨ PromptFlair</h2>
        <p>Your AI Prompt Co-Pilot</p>
      </header>
      
      <main>
        <textarea
          className="prompt-textarea"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Paste or write your prompt here..."
          disabled={isPyodideLoading} // Disable textarea while Pyodide loads
        />

        <button 
          className="analyze-button" 
          onClick={handleAnalyzeClick}
          disabled={isPyodideLoading || isAnalyzing}
        >
          {isPyodideLoading 
            ? 'Loading AI Engine...' 
            : isAnalyzing 
              ? 'Analyzing...' 
              : 'Analyze Prompt'}
        </button>

        <div className="suggestions-area">
          <h3>Suggestions</h3>
          {isPyodideLoading && <p>Please wait, the local analysis engine is starting up...</p>}
          {!isPyodideLoading && suggestions.length === 0 && !isAnalyzing && (
            <p className="placeholder-text">Your suggestions will appear here.</p>
          )}
          {isAnalyzing && <p>Thinking...</p>}
          
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-card" dangerouslySetInnerHTML={{ __html: suggestion }} />
          ))}
        </div>
      </main>

      <footer>
        <button className="copy-button">Copy & Use</button>
      </footer>
    </div>
  );
};