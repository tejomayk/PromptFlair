console.log('PromptFlair content script loaded.');

// --- 1. Find the target text area on the page ---
const targetTextArea = document.getElementById('prompt-textarea') as HTMLTextAreaElement;

if (targetTextArea) {
    // --- 2. Create our UI root element ---
    // This is the container where our React app will live.
    const appContainer = document.createElement('div');
    appContainer.id = 'promptflair-root';
    
    // Position it relative to the form containing the textarea
    const parentForm = targetTextArea.closest('form');
    if (parentForm) {
        parentForm.style.position = 'relative'; // Needed for absolute positioning of our icon
        parentForm.appendChild(appContainer);
    }

    // --- 3. Create the icon/button to launch the side panel ---
    const launchIcon = document.createElement('button');
    launchIcon.id = 'promptflair-launch-icon';
    launchIcon.innerHTML = '✨'; // Simple emoji icon for now
    launchIcon.style.position = 'absolute';
    launchIcon.style.right = '12px';
    launchIcon.style.top = '10px';
    launchIcon.style.border = 'none';
    launchIcon.style.background = 'transparent';
    launchIcon.style.fontSize = '20px';
    launchIcon.style.cursor = 'pointer';
    
    // Add the icon to the parent form
    parentForm?.appendChild(launchIcon);
    
    // --- 4. Add click listener to mount the React app ---
    launchIcon.addEventListener('click', () => {
        // Toggle the side panel's visibility
        appContainer.style.display = appContainer.style.display === 'block' ? 'none' : 'block';
        
        // This is a simple way to mount the app only once
        if (!appContainer.hasChildNodes()) {
            mountReactApp(appContainer);
        }
    });

}

function mountReactApp(container: HTMLElement) {
    try {
        // We can't directly import React components here.
        // Instead, we create an iframe to isolate our UI from the host page's styles.
        const iframe = document.createElement('iframe');
        iframe.id = 'promptflair-iframe';
        iframe.style.width = '350px';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.right = '0';
        iframe.style.zIndex = '9999';
        iframe.style.boxShadow = '-5px 0px 15px rgba(0,0,0,0.1)';
        iframe.src = chrome.runtime.getURL('index.html'); // Load our UI's HTML file
        
        container.appendChild(iframe);

    } catch (e) {
        console.error("Error mounting PromptFlair app:", e);
    }
}