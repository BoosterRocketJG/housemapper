document.addEventListener('DOMContentLoaded', () => {
    // Fetch the approved postcodes and validation messages on initialization
    let approvedPostcodes = [];
    let validationMessages = {};

    fetch('https://assets.housemapper.co.uk/booking-form-2_0/assets/data/approved-postcodes.json')
        .then(response => response.json())
        .then(data => {
            approvedPostcodes = data;
        });

    fetch('https://assets.housemapper.co.uk/booking-form-2_0/assets/data/validation-messages.json')
        .then(response => response.json())
        .then(data => {
            validationMessages = data.reduce((acc, item) => {
                acc[item.fields.MessageName] = item.fields.Message;
                return acc;
            }, {});
        });

    const postcodeInput = document.getElementById('postcode-area');
    const postcodeClear = document.getElementById('postcodeClear');
    const stubCheckButton = document.getElementById('stubCheck');
    const postcodeProgress = document.getElementById('postcode-progress');
    const responseElement = document.getElementById('postcode-check-response');

    // Helper functions
    const showStubCheckButton = () => {
        stubCheckButton.classList.remove('hidden');
        stubCheckButton.classList.remove('disabled');
    };

    const hideStubCheckButton = () => {
        stubCheckButton.classList.add('hidden');
        stubCheckButton.classList.add('disabled');
    };

    const responseTextUpdate = (hidden, message, cssClass) => {
        if (hidden) {
            responseElement.classList.add('hidden');
        } else {
            responseElement.classList.remove('hidden');
        }
        responseElement.textContent = message;
        responseElement.className = `postcode-check-response ${cssClass}`;
    };

    const postcodeTooLong = () => {
        responseTextUpdate(false, validationMessages['postcodeTooLong'], 'error');
    };

    const areaServed = () => {
        responseTextUpdate(false, validationMessages['exactMatch'], 'success');
        postcodeProgress.classList.remove('disabled');
        hideStubCheckButton();
    };

    const areaNotServed = () => {
        responseTextUpdate(false, validationMessages['noCoverage'], 'error');
        postcodeProgress.classList.add('disabled');
        hideStubCheckButton();
    };

    // On pageload, check localStorage for saved postcode
    const savedPostcode = localStorage.getItem('postcode');
    if (savedPostcode && savedPostcode.length > 4 && /\s/.test(savedPostcode)) {
        postcodeInput.value = savedPostcode;
        showStubCheckButton();
    }

    // Input field restrictions and checks
    postcodeInput.addEventListener('input', (event) => {
        let input = event.target.value.toUpperCase();
        
        // Restrict input to alphanumeric characters and spaces
        input = input.replace(/[^A-Z0-9\s]/g, '');

        // If a whitespace already exists, remove any additional whitespace
        const firstWhitespaceIndex = input.indexOf(' ');
        if (firstWhitespaceIndex !== -1) {
            // Remove all additional whitespaces
            input = input.substring(0, firstWhitespaceIndex + 1) + input.substring(firstWhitespaceIndex + 1).replace(/\s/g, '');
        }

        // Ensure no leading whitespace and limit to 8 characters total
        input = input.replace(/^\s/, '').slice(0, 8);

        // Update the input field with the cleaned value
        event.target.value = input;

        // Check conditions for showing/hiding stubCheck button
        if (input.length > 8) {
            postcodeTooLong();
        } else if (input.length > 5 && input.includes(' ')) {
            showStubCheckButton();
        } else {
            hideStubCheckButton();
        }
    });

    // Clear button functionality
    postcodeClear.addEventListener('click', () => {
        postcodeInput.value = '';
        localStorage.removeItem('postcode');
        hideStubCheckButton();
        postcodeProgress.classList.add('disabled');
        responseTextUpdate(true, '', '');
    });

    // Stub check button functionality
    stubCheckButton.addEventListener('click', () => {
        const input = postcodeInput.value.trim();
        if (!/\s/.test(input) && input.length >= 5) {
            const formattedInput = input.slice(0, -3) + ' ' + input.slice(-3);
            postcodeInput.value = formattedInput;
            localStorage.setItem('postcode', formattedInput);
            localStorage.setItem('postcodeStub', formattedInput.split(' ')[0]);
        }

        const postcodeStub = localStorage.getItem('postcodeStub');
        if (approvedPostcodes.includes(postcodeStub)) {
            areaServed();
        } else {
            areaNotServed();
        }
    });

    // Submit progress button functionality
    postcodeProgress.addEventListener('click', (event) => {
        if (postcodeProgress.classList.contains('disabled')) {
            event.preventDefault();
        }
    });
});
