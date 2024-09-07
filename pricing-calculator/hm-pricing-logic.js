document.addEventListener('DOMContentLoaded', () => {
    initializeState();
    setupEventListeners();
    calculateQuote();
});

// Initialize state from localStorage or set default values
function initializeState() {
    const storedState = JSON.parse(localStorage.getItem('quoteCalculatorState')) || {};
    const products = storedState.products || {};

    // Set initial counts or use stored values
    document.querySelectorAll('[data-product-id]').forEach(card => {
        const productId = card.dataset.productId;
        const productType = card.dataset.productType; // 'limited' or 'unlimited'
        const count = products[productId] || 0;

        updateProductUI(productId, count, productType);
    });
}

// Set up event listeners for increment, decrement, add, and remove buttons
function setupEventListeners() {
    document.querySelectorAll('.increment-btn').forEach(button => {
        button.addEventListener('click', () => handleIncrement(button));
    });

    document.querySelectorAll('.decrement-btn').forEach(button => {
        button.addEventListener('click', () => handleDecrement(button));
    });

    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', () => handleAdd(button));
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => handleRemove(button));
    });

    // Listener for VAT toggle
    document.getElementById('toggle-vat').addEventListener('click', toggleVAT);
}

// Handle increment for unlimited products
function handleIncrement(button) {
    const productId = button.dataset.productId;
    const countElement = document.getElementById(`count-${productId}`);
    const count = parseInt(countElement.textContent) + 1;

    updateProductUI(productId, count, 'unlimited');
    updateLocalStorage(productId, count);
    calculateQuote();
}

// Handle decrement for unlimited products
function handleDecrement(button) {
    const productId = button.dataset.productId;
    const countElement = document.getElementById(`count-${productId}`);
    let count = parseInt(countElement.textContent);

    if (count > 0) {
        count--;
    }

    updateProductUI(productId, count, 'unlimited');
    updateLocalStorage(productId, count);
    calculateQuote();
}

// Handle adding for limited products
function handleAdd(button) {
    const productId = button.dataset.productId;
    updateProductUI(productId, 1, 'limited');
    updateLocalStorage(productId, 1);
    calculateQuote();
}

// Handle removing for limited products
function handleRemove(button) {
    const productId = button.dataset.productId;
    updateProductUI(productId, 0, 'limited');
    updateLocalStorage(productId, 0);
    calculateQuote();
}

// Update UI elements for products
function updateProductUI(productId, count, productType) {
    const countElement = document.getElementById(`count-${productId}`);
    const decrementButton = document.getElementById(`decrement-${productId}`);
    const addButton = document.getElementById(`add-${productId}`);
    const removeButton = document.getElementById(`remove-${productId}`);

    countElement.textContent = count;

    if (productType === 'unlimited') {
        decrementButton.disabled = count === 0;
        decrementButton.style.color = count === 0 ? 'grey' : 'black';
    }

    if (productType === 'limited') {
        if (count > 0) {
            addButton.style.display = 'none';
            removeButton.style.display = 'inline';
        } else {
            addButton.style.display = 'inline';
            removeButton.style.display = 'none';
        }
    }
}

// Update state in localStorage
function updateLocalStorage(productId, count) {
    const storedState = JSON.parse(localStorage.getItem('quoteCalculatorState')) || { products: {} };
    storedState.products[productId] = count;
    localStorage.setItem('quoteCalculatorState', JSON.stringify(storedState));
}

// Calculate the total quote dynamically
async function calculateQuote() {
    const products = await fetchProductData();
    let totalQuote = initializeBaseQuote(products);
    const storedState = JSON.parse(localStorage.getItem('quoteCalculatorState')) || { products: {} };

    Object.entries(storedState.products).forEach(([productId, count]) => {
        if (count > 0) {
            const product = products.find(p => p.fields.productID === productId);
            if (product) {
                totalQuote += product.fields['Price Excl VAT'] * count;
            }
        }
    });

    document.getElementById('total-quote').textContent = `Total Quote: £${totalQuote.toFixed(2)}`;
}

// Toggle between VAT inclusive and exclusive prices
function toggleVAT() {
    // Implement VAT toggle logic (similar to the quote calculation, adding VAT where necessary)
    calculateQuote(); // Recalculate to update display with VAT
}

// Fetch product data (same as in the previous step)
async function fetchProductData() {
    const response = await fetch('https://assets.housemapper.co.uk/hmProducts.json');
    const products = await response.json();
    return products;
}

// Initialize base quote (same as in the previous step)
function initializeBaseQuote(products) {
    let baseQuote = 0;
    const includedProducts = products.filter(product => product.fields['Included in Base'] === true);

    includedProducts.forEach(product => {
        baseQuote += product.fields['Price Excl VAT']; // Add VAT exclusive price for base items
    });

    return baseQuote;
}
