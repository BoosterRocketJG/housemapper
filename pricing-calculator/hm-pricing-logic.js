document.addEventListener('DOMContentLoaded', () => {
    updatePricesFromJSON();
    setupPriceEventListeners();
});

// Listen for the VAT state change event from vat-logic.js
document.addEventListener('vatStateChanged', (event) => {
    updatePricesFromJSON(); // Recalculate prices based on the new VAT state
});

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

// Function to set up any other event listeners related to pricing
function setupPriceEventListeners() {
    // Additional listeners for price-related actions can be added here
}
