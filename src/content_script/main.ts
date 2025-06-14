console.log('PromptFlair content script loaded.');

// This function contains all the logic to set up our app
function initializeApp(targetNode: HTMLTextAreaElement) {
    console.log('PromptFlair: Target textarea found. Initializing app.');

    // --- Create our UI root element ---
    const appContainer = document.createElement('div');
    appContainer.id = 'promptflair-root';
    
    const parentForm = targetNode.closest('form');
    if (!parentForm) {
        console.error('PromptFlair: Could not find parent form of the textarea.');
        return;
    }
    
    parentForm.style.position = 'relative';
    parentForm.appendChild(appContainer);

    // --- Create the icon/button to launch the side panel ---
    const launchIcon = document.createElement('button');
    launchIcon.id = 'promptflair-launch-icon';
    launchIcon.innerHTML = '✨';
    launchIcon.style.position = 'absolute';
    launchIcon.style.right = '12px';
    launchIcon.style.top = '10px';
    launchIcon.style.border = 'none';
    launchIcon.style.background = 'transparent';
    launchIcon.style.fontSize = '20px';
    launchIcon.style.cursor = 'pointer';
    launchIcon.style.zIndex = '100'; // Ensure it's on top
    
    parentForm.appendChild(launchIcon);
    
    // --- Add click listener to mount the React app ---
    launchIcon.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the form from submitting
        
        // Find the iframe if it already exists
        const existingIframe = document.getElementById('promptflair-iframe');

        if (existingIframe) {
            // Toggle visibility if it exists
            existingIframe.style.display = existingIframe.style.display === 'none' ? 'block' : 'none';
        } else {
            // Create and mount the app if it doesn't exist
            mountReactApp(appContainer);
        }
    });
}

function mountReactApp(container: HTMLElement) {
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
    iframe.src = chrome.runtime.getURL('index.html');
    
    container.appendChild(iframe);
}

// --- Use a MutationObserver to wait for the element to appear ---
const observer = new MutationObserver((mutations, obs) => {
    const targetTextArea = document.getElementById('prompt-textarea') as HTMLTextAreaElement;
    if (targetTextArea) {
        // Element found, initialize the app
        initializeApp(targetTextArea);
        // We found it, so we can stop observing to save resources
        obs.disconnect(); 
    }
});

// Start observing the entire document for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});