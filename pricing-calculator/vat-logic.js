document.addEventListener('DOMContentLoaded', () => {
    initializeVATState();
    setupVATEventListener();
});

// Function to check and initialize VAT state
function initializeVATState() {
    // Check localStorage for VAT state, default to "ex-VAT" if not set
    const vatState = localStorage.getItem('vatState') || 'ex-VAT';
    localStorage.setItem('vatState', vatState);

    // Update the toggle button text based on the current VAT state
    updateVATButtonText(vatState);
}

// Function to set up event listener for VAT toggle button
function setupVATEventListener() {
    const vatToggleButton = document.getElementById('vat-toggle-btn');
    if (vatToggleButton) {
        // VAT toggle button event listener
        vatToggleButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            toggleVATState();
        });
    } else {
        console.warn('VAT toggle button not found');
    }
}

// Function to handle VAT state toggle
function toggleVATState() {
    const currentVATState = localStorage.getItem('vatState');

    // Toggle VAT state between "ex-VAT" and "inc-VAT"
    const newVATState = (currentVATState === 'ex-VAT') ? 'inc-VAT' : 'ex-VAT';
    localStorage.setItem('vatState', newVATState);

    // Update button text and notify pricing logic to update prices
    updateVATButtonText(newVATState);

    // Notify other scripts that the VAT state has changed
    document.dispatchEvent(new CustomEvent('vatStateChanged', { detail: newVATState }));
}

// Function to update the VAT button text
function updateVATButtonText(vatState) {
    const vatToggleButton = document.getElementById('vat-toggle-btn');
    if (vatToggleButton) {
        vatToggleButton.textContent = (vatState === 'inc-VAT') ? 'Inclusive' : 'Exclusive';
    }
}
