document.addEventListener('DOMContentLoaded', function() {
    const vatToggleButton = document.getElementById('vat-toggle');
    const priceFields = document.querySelectorAll('.price');
    let originalValues = [];
    let vatApplied = false;

    // Try to get the VAT state from localStorage
    try {
        vatApplied = localStorage.getItem('vatApplied') === 'true';
    } catch (error) {
        console.error('Error accessing localStorage:', error);
        vatApplied = false; // Default state if localStorage fails
    }

    // Store original values and ensure they are valid numbers
    priceFields.forEach((field, index) => {
        const value = parseFloat(field.textContent);
        originalValues[index] = isNaN(value) ? 0 : value; // Default to 0 if value is not a number
    });

    // Function to toggle VAT
    function toggleVAT() {
        // Reference to applyAnimation removed
        if (!vatApplied) {
            // Apply VAT
            priceFields.forEach((field, index) => {
                field.textContent = (originalValues[index] * 1.2).toFixed(2);
            });
            vatToggleButton.textContent = 'INCLUSIVE';
            vatApplied = true;
        } else {
            // Remove VAT
            priceFields.forEach((field, index) => {
                field.textContent = originalValues[index].toFixed(2);
            });
            vatToggleButton.textContent = 'EXCLUSIVE';
            vatApplied = false;
        }

        // Store the current VAT state in localStorage
        try {
            localStorage.setItem('vatApplied', vatApplied);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    // Set initial state based on localStorage
    if (vatApplied) {
        priceFields.forEach((field, index) => {
            field.textContent = (originalValues[index] * 1.2).toFixed(2);
        });
        vatToggleButton.textContent = 'INCLUSIVE';
    } else {
        vatToggleButton.textContent = 'EXCLUSIVE';
    }

    // Event listener for vat-toggle button
    vatToggleButton.addEventListener('click', toggleVAT);
});
