document.addEventListener('DOMContentLoaded', () => {
    initializeBaseProductCounts();
    initializeProductCounts();
    setupProductEventListeners();
    setupResetButtonEventListener();
    calculateTotalQuote(); // Calculate initial total quote
});

// Function to initialize base product counts to 1 in localStorage
function initializeBaseProductCounts() {
    const baseProducts = ['baseScan', 'pdfPlans', 'virtualTour'];

    baseProducts.forEach(productId => {
        // Always set count to 1 for base products
        localStorage.setItem(`count-${productId}`, 1);
    });
}

// Function to initialize product counts from localStorage
function initializeProductCounts() {
    const products = document.querySelectorAll('[id^="count-"], [id^="add-"]');

    products.forEach(product => {
        const productId = product.id.split('-')[1];

        // Skip base products as they should not be interactable
        if (['baseScan', 'pdfPlans', 'virtualTour'].includes(productId)) {
            return;
        }

        const count = parseInt(localStorage.getItem(`count-${productId}`)) || 0;

        if (product.id.startsWith('count-')) {
            // Initialize count for unlimited products
            updateUnlimitedProductUI(productId, count);
        } else if (product.id.startsWith('add-')) {
            // Initialize UI for limited products
            updateLimitedProductUI(productId, count);
        }
    });
}

// Function to set up event listeners for product interaction buttons
function setupProductEventListeners() {
    // Event listeners for unlimited products' increment and decrement buttons
    document.querySelectorAll('[id^="increment-"]').forEach(button => {
        button.addEventListener('click', () => {
            handleIncrement(button);
            calculateTotalQuote(); // Recalculate total quote after change
        });
    });

    document.querySelectorAll('[id^="decrement-"]').forEach(button => {
        button.addEventListener('click', () => {
            handleDecrement(button);
            calculateTotalQuote(); // Recalculate total quote after change
        });
    });

    // Event listeners for limited products' add buttons
    document.querySelectorAll('[id^="add-"]').forEach(button => {
        button.addEventListener('click', () => {
            handleLimitedProductToggle(button);
            calculateTotalQuote(); // Recalculate total quote after change
        });
    });
}

// Function to set up event listener for the reset button
function setupResetButtonEventListener() {
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            handleResetButtonClick();
            calculateTotalQuote(); // Recalculate total quote after reset
        });
    }
}

// Handle increment button click for unlimited products
function handleIncrement(button) {
    const productId = button.id.split('-')[1];
    let count = parseInt(localStorage.getItem(`count-${productId}`)) || 0;

    count++;
    localStorage.setItem(`count-${productId}`, count);
    updateUnlimitedProductUI(productId, count);
}

// Handle decrement button click for unlimited products
function handleDecrement(button) {
    const productId = button.id.split('-')[1];
    let count = parseInt(localStorage.getItem(`count-${productId}`)) || 0;

    if (count > 0) {
        count--;
        localStorage.setItem(`count-${productId}`, count);
        updateUnlimitedProductUI(productId, count);
    }
}

// Handle toggle button click for limited products
function handleLimitedProductToggle(button) {
    const productId = button.id.split('-')[1];
    let count = parseInt(localStorage.getItem(`count-${productId}`)) || 0;

    // Toggle count between 0 and 1
    count = count === 0 ? 1 : 0;
    localStorage.setItem(`count-${productId}`, count);
    updateLimitedProductUI(productId, count);
}

// Handle reset button click
function handleResetButtonClick() {
    // Get all keys from localStorage
    Object.keys(localStorage).forEach(key => {
        // Clear counts for all products except baseScan, pdfPlans, and virtualTour
        if (key.startsWith('count-') && !['count-baseScan', 'count-pdfPlans', 'count-virtualTour'].includes(key)) {
            localStorage.removeItem(key);
        }
    });

    // Re-initialize the product counts to reflect the cleared state
    initializeProductCounts();
}

// Update UI for unlimited products
function updateUnlimitedProductUI(productId, count) {
    const countElement = document.getElementById(`count-${productId}`);
    const decrementButton = document.getElementById(`decrement-${productId}`);

    // Update the displayed count
    if (countElement) countElement.textContent = count;

    // Enable or disable the decrement button based on count
    if (decrementButton) {
        if (count > 0) {
            decrementButton.disabled = false;
            decrementButton.style.color = '';
            decrementButton.style.borderColor = '';
        } else {
            decrementButton.disabled = true;
            decrementButton.style.color = '#dedede';
            decrementButton.style.borderColor = '#dedede';
        }
    }
}

// Update UI for limited products
function updateLimitedProductUI(productId, count) {
    const addButton = document.getElementById(`add-${productId}`);

    // Update the button text based on count
    if (addButton) {
        addButton.textContent = count === 0 ? '+ Add' : '– Remove';
    }
}

// Function to calculate and display the total quote
async function calculateTotalQuote() {
    try {
        const response = await fetch('https://assets.housemapper.co.uk/hmProducts.json');
        const products = await response.json();
        let totalQuote = 0;

        // Get the current VAT state
        const vatState = localStorage.getItem('vatState');

        // Loop through each product and calculate total based on count and VAT state
        products.forEach(product => {
            const productId = product.fields.productID;
            const basePrice = getPriceBasedOnVAT(product);
            const quantityDiscount = product.fields['quantityDiscount'] || 1; // Default to 1 if not specified

            const count = parseInt(localStorage.getItem(`count-${productId}`)) || 0;

            if (count > 1) {
                // Apply base price for the first unit and quantity discount for additional units
                totalQuote += basePrice + (count - 1) * basePrice * quantityDiscount;
            } else if (count === 1) {
                // Just add the base price
                totalQuote += basePrice;
            }
        });

        // Update the total quote display
        document.getElementById('total-quote').textContent = totalQuote.toFixed(2); // Format to 2 decimal places

    } catch (error) {
        console.error('Error fetching or calculating total quote:', error);
    }
}

// Function to get the price based on the VAT state
function getPriceBasedOnVAT(product) {
    const vatState = localStorage.getItem('vatState');
    return vatState === 'inc-VAT' ? product.fields['Price Incl VAT'] : product.fields['Price Excl VAT'];
}
