document.addEventListener('DOMContentLoaded', () => {
    updatePricesFromJSON();
});

// Function to fetch the product data and update prices
async function updatePricesFromJSON() {
    try {
        // Fetch the JSON data from the provided URL
        const response = await fetch('https://assets.housemapper.co.uk/hmProducts.json');
        const products = await response.json();

        // Loop through each product in the JSON data
        products.forEach(product => {
            const productId = product.fields.productID;
            const priceExclVAT = product.fields['Price Excl VAT'];

            // Find the HTML element with the corresponding ID and update its text content
            const priceElement = document.getElementById(`${productId}-price`);
            if (priceElement) {
                priceElement.textContent = priceExclVAT.toFixed(2); // Format price to 2 decimal places
            } else {
                console.warn(`No element found with ID: ${productId}-price`);
            }
        });

    } catch (error) {
        console.error('Error fetching or processing JSON data:', error);
    }
}