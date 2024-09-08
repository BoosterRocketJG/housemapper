document.addEventListener('DOMContentLoaded', () => {
    initializeVATState();
    setupVATEventListener();
    updatePricesFromJSON();
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
    updatePricesFromJSON();
}

// Function to update the VAT button text
function updateVATButtonText(vatState) {
    const vatToggleButton = document.getElementById('vat-toggle-btn');
    if (vatToggleButton) {
        vatToggleButton.textContent = (vatState === 'inc-VAT') ? 'Inclusive' : 'Exclusive';
    }
}

// Function to update prices based on the current VAT state
async function updatePricesFromJSON() {
    try {
        const response = await fetch('https://assets.housemapper.co.uk/hmProducts.json');
        const products = await response.json();

        // Get the current VAT state
        const vatState = localStorage.getItem('vatState');

        // Loop through each product and update prices based on VAT state
        products.forEach(product => {
            const productId = product.fields.productID;
            const priceExclVAT = product.fields['Price Excl VAT'];
            const priceInclVAT = product.fields['Price Incl VAT'];

            // Determine the price to display based on VAT state
            const priceToDisplay = (vatState === 'inc-VAT') ? priceInclVAT : priceExclVAT;

            // Find the HTML element with the corresponding ID and update its text content
            const priceElement = document.getElementById(`${productId}-price`);
            if (priceElement) {
                priceElement.textContent = priceToDisplay.toFixed(2); // Format price to 2 decimal places
            } else {
                console.warn(`No element found with ID: ${productId}-price`);
            }
        });

    } catch (error) {
        console.error('Error fetching or processing JSON data:', error);
    }
}
