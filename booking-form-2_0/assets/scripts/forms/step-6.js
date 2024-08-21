document.addEventListener('DOMContentLoaded', function() {
    const meterageInput = document.getElementById('meterageInput');
    const metricToggle = document.getElementById('metricToggle');
    const imperialToggle = document.getElementById('imperialToggle');
    const questionTitle = document.getElementById('questionTitle');
    const unitSuffix = document.getElementById('unitSuffix');
    const form = document.getElementById('meterageForm');

    let isMetric = true; // Default to metric
    let warningTimeout;

    // Create and style the warning message element
    const warningMessage = document.createElement('div');
    warningMessage.style.color = 'red';
    warningMessage.style.marginTop = '10px';
    warningMessage.textContent = "This is a very small space, please double-check before proceeding";
    warningMessage.style.display = 'none';
    form.appendChild(warningMessage);

    // Toggle between Metric and Imperial
    metricToggle.addEventListener('click', function() {
        isMetric = true;
        metricToggle.classList.add('active');
        imperialToggle.classList.remove('active');
        questionTitle.textContent = 'What is the square meterage?';
        unitSuffix.textContent = 'm²';
        meterageInput.placeholder = 'Enter the square meterage';
    });

    imperialToggle.addEventListener('click', function() {
        isMetric = false;
        imperialToggle.classList.add('active');
        metricToggle.classList.remove('active');
        questionTitle.textContent = 'What is the square footage?';
        unitSuffix.textContent = 'ft²';
        meterageInput.placeholder = 'Enter the square footage';
    });

    // Show warning if the value is less than 8 and user pauses for >800ms
    meterageInput.addEventListener('input', function() {
        clearTimeout(warningTimeout); // Clear any previous timeout

        const meterage = parseFloat(meterageInput.value);

        if (meterage > 0 && meterage < 8) {
            warningTimeout = setTimeout(function() {
                warningMessage.style.display = 'block'; // Show warning message
            }, 800);
        } else {
            warningMessage.style.display = 'none'; // Hide warning if conditions aren't met
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        let meterage = parseFloat(meterageInput.value);
        
        if (!isMetric) {
            // Convert square feet to square meters if imperial is selected
            meterage = meterage * 0.092903; // 1 square foot = 0.092903 square meters
        }

        if (meterage && meterage > 0) {
            // Proceed directly to Step 9 with the converted meterage
            console.log('Submitted meterage in square meters:', meterage); // For debugging
            window.location.href = 'step-9.html'; // Redirect to Step 9
        } else {
            alert('Please enter a valid square meterage/footage greater than 0.');
        }
    });
});
