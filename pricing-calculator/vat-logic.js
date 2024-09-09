document.addEventListener('DOMContentLoaded', () => {
    initializeVATState();
    setupVATEventListener();
    updatePricesFromJSON();
    updateTotalQuote(); // Update the total quote display based on the VAT state
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

    // Update prices and total quote based on the new VAT state
    updatePricesFromJSON();
    updateTotalQuote();
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
            // Respect the "displayedOnSite" field
            if (product.fields.displayedOnSite) {
                const productId = product.fields.productID;
                const priceExclVAT = product.fields['Price Excl VAT'];
                const priceInclVAT = product.fields['Price Incl VAT'];
                const quantityDiscount = product.fields['quantityDiscount'];

                // Determine the price to display based on VAT state
                const priceToDisplay = (vatState === 'inc-VAT') ? priceInclVAT : priceExclVAT;
                const subsequentPriceToDisplay = (priceToDisplay * quantityDiscount).toFixed(2);

                // Update main price
                const priceElement = document.getElementById(`${productId}-price`);
                if (priceElement) {
                    priceElement.textContent = priceToDisplay.toFixed(2); // Format price to 2 decimal places
                } else {
                    console.warn(`No element found with ID: ${productId}-price`);
                }

                // Update subsequent price if applicable
                if (quantityDiscount && quantityDiscount < 1) {
                    const subsequentPriceElement = document.getElementById(`${productId}-price-subsequent`);
                    if (subsequentPriceElement) {
                        subsequentPriceElement.textContent = subsequentPriceToDisplay; // Display subsequent price
                    } else {
                        console.warn(`No element found with ID: ${productId}-price-subsequent`);
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error fetching or processing JSON data:', error);
    }
}

// Function to update the total quote display based on the VAT state
function updateTotalQuote() {
    const vatState = localStorage.getItem('vatState');
    const totalExVAT = localStorage.getItem('totalExVAT') || '0.00';
    const totalIncVAT = localStorage.getItem('totalIncVAT') || '0.00';

    const totalElement = document.getElementById('total-quote');
    if (totalElement) {
        totalElement.textContent = (vatState === 'inc-VAT') ? totalIncVAT : totalExVAT;
    }
}
