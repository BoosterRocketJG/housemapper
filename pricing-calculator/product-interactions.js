document.addEventListener('DOMContentLoaded', () => {
    initializeBaseProductCounts();
    initializeProductCounts();
    setupProductEventListeners();
    setupResetButtonEventListener();
    calculateTotals(); // Calculate initial totals
    displaySteppedPricing(); // Display stepped pricing where applicable
    updateDisplayedTotal(); // Display the correct total
});

// Function to initialize base product counts to 1 in sessionStorage
function initializeBaseProductCounts() {
    const baseProducts = ['baseScan', 'pdfPlans', 'virtualTour'];

    baseProducts.forEach(productId => {
        // Always set count to 1 for base products
        sessionStorage.setItem(`count-${productId}`, 1);
    });
}

// Function to initialize product counts from sessionStorage
function initializeProductCounts() {
    const products = document.querySelectorAll('[id^="count-"], [id^="add-"]');

    products.forEach(product => {
        const productId = product.id.split('-')[1];

        // Skip base products as they should not be interactable
        if (['baseScan', 'pdfPlans', 'virtualTour'].includes(productId)) {
            return;
        }

        const count = parseInt(sessionStorage.getItem(`count-${productId}`)) || 0;

        if (product.id.startsWith('count-')) {
            // Initialize count for unlimited products
            updateUnlimitedProductUI(productId, count);
        } else if (product.id.startsWith('add-')) {
            // Initialize UI for limited products
            updateLimitedProductUI(productId, count);
        }
    });
}

function setupProductEventListeners() {
    document.querySelectorAll('[id^="increment-"]').forEach(button => {
        button.addEventListener('click', () => {
            handleIncrement(button);
            calculateTotals(); // Recalculate and update totals after change
            updateResetButtonState(); // Check and update reset button state
        });
    });

    document.querySelectorAll('[id^="decrement-"]').forEach(button => {
        button.addEventListener('click', () => {
            handleDecrement(button);
            calculateTotals(); // Recalculate and update totals after change
            updateResetButtonState(); // Check and update reset button state
        });
    });

    document.querySelectorAll('[id^="add-"]').forEach(button => {
        button.addEventListener('click', () => {
            handleLimitedProductToggle(button);
            calculateTotals(); // Recalculate and update totals after change
            updateResetButtonState(); // Check and update reset button state
        });
    });
}

function setupResetButtonEventListener() {
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            handleResetButtonClick();
            calculateTotals(); // Recalculate totals after reset
            updateResetButtonState(); // Check and update reset button state
        });
    }
}

// Handle increment button click for unlimited products
function handleIncrement(button) {
    const productId = button.id.split('-')[1];
    let count = parseInt(sessionStorage.getItem(`count-${productId}`)) || 0;

    count++;
    sessionStorage.setItem(`count-${productId}`, count);
    updateUnlimitedProductUI(productId, count);
}

// Handle decrement button click for unlimited products
function handleDecrement(button) {
    const productId = button.id.split('-')[1];
    let count = parseInt(sessionStorage.getItem(`count-${productId}`)) || 0;

    if (count > 0) {
        count--;
        sessionStorage.setItem(`count-${productId}`, count);
        updateUnlimitedProductUI(productId, count);
    }
}

// Handle toggle button click for limited products
function handleLimitedProductToggle(button) {
    const productId = button.id.split('-')[1];
    let count = parseInt(sessionStorage.getItem(`count-${productId}`)) || 0;

    // Toggle count between 0 and 1
    count = count === 0 ? 1 : 0;
    sessionStorage.setItem(`count-${productId}`, count);
    updateLimitedProductUI(productId, count);
}

// Handle reset button click
function handleResetButtonClick() {
    // Get all keys from sessionStorage
    Object.keys(sessionStorage).forEach(key => {
        // Clear counts for all products except baseScan, pdfPlans, and virtualTour
        if (key.startsWith('count-') && !['count-baseScan', 'count-pdfPlans', 'count-virtualTour'].includes(key)) {
            sessionStorage.removeItem(key);
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

// Function to calculate totals with and without VAT and store them in sessionStorage
async function calculateTotals() {
    try {
        const response = await fetch('https://assets.housemapper.co.uk/hmProducts.json');
        const products = await response.json();
        let totalExVAT = 0;
        let totalIncVAT = 0;

        // Loop through each product and calculate totals based on count and allowance
        products.forEach(product => {
            const productId = product.fields.productID;
            const priceExVAT = product.fields['Price Excl VAT'];
            const priceIncVAT = product.fields['Price Incl VAT'];
            const quantityDiscount = product.fields['quantityDiscount'] || 1; // Default to 1 if not specified
            const allowance = product.fields['Allowance'] || 0; // Default allowance to 0 if not specified

            const count = parseInt(sessionStorage.getItem(`count-${productId}`)) || 0;

            if (count > allowance) {
                const additionalCount = count - allowance;

                if (additionalCount > 1) {
                    // Apply base price for the first unit over the allowance and quantity discount for additional units
                    totalExVAT += priceExVAT + (additionalCount - 1) * priceExVAT * quantityDiscount;
                    totalIncVAT += priceIncVAT + (additionalCount - 1) * priceIncVAT * quantityDiscount;
                } else if (additionalCount === 1) {
                    // Just add the base price for one unit over the allowance
                    totalExVAT += priceExVAT;
                    totalIncVAT += priceIncVAT;
                }
            }
        });

        // Store both totals in sessionStorage
        sessionStorage.setItem('totalExVAT', totalExVAT.toFixed(2));
        sessionStorage.setItem('totalIncVAT', totalIncVAT.toFixed(2));

        // Update the displayed totals
        updateDisplayedTotal();
    } catch (error) {
        console.error('Error fetching or calculating totals:', error);
    }
}


// Function to update the displayed total
function updateDisplayedTotal() {
    const vatState = sessionStorage.getItem('vatState');
    const totalExVAT = sessionStorage.getItem('totalExVAT') || '0.00';
    const totalIncVAT = sessionStorage.getItem('totalIncVAT') || '0.00';

    // Update the total in #total-quote
    const totalElement = document.getElementById('total-quote');
    if (totalElement) {
        totalElement.textContent = vatState === 'inc-VAT' ? totalIncVAT : totalExVAT;
    }
}
// Function to display stepped pricing for products with quantity discounts
async function displaySteppedPricing() {
    try {
        const response = await fetch('https://assets.housemapper.co.uk/hmProducts.json');
        const products = await response.json();

        products.forEach(product => {
            const productId = product.fields.productID;
            const priceExVAT = product.fields['Price Excl VAT'];
            const quantityDiscount = product.fields['quantityDiscount'];

            // Calculate the subsequent price
            const subsequentPrice = (priceExVAT * quantityDiscount).toFixed(2);

            // If there is a quantity discount, display the subsequent price
            if (quantityDiscount && quantityDiscount < 1) {
                const subsequentPriceElement = document.getElementById(`${productId}-price-subsequent`);
                if (subsequentPriceElement) {
                    subsequentPriceElement.textContent = subsequentPrice; // Display subsequent price
                }
            }
        });
    } catch (error) {
        console.error('Error fetching or displaying stepped pricing:', error);
    }
}
function updateResetButtonState() {
    const totalExVAT = sessionStorage.getItem('totalExVAT') || '0.00';
    const totalIncVAT = sessionStorage.getItem('totalIncVAT') || '0.00';
    const resetButton = document.getElementById('reset-button');

    if (resetButton) {
        if (totalExVAT === '275.00' && totalIncVAT === '330.00') {
            // Add the .button-disabled class to grey out the button and disable interactions
            resetButton.classList.add('button-disabled');
        } else {
            // Remove the .button-disabled class to restore the button's appearance and functionality
            resetButton.classList.remove('button-disabled');
        }
    }
}



