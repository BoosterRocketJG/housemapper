document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('serviceForm');
    const options = document.querySelectorAll('.multi-select-option');

    options.forEach(option => {
        option.addEventListener('click', function() {
            // Toggle the selected state
            if (option.classList.contains('selected')) {
                option.classList.remove('selected');
                // Force a reflow/repaint for immediate transition
                void option.offsetWidth;
            } else {
                option.classList.add('selected');
                // Force a reflow/repaint for immediate transition
                void option.offsetWidth;
            }
        });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const selectedOptions = [];
        options.forEach(option => {
            if (option.classList.contains('selected')) {
                selectedOptions.push(option.getAttribute('data-value'));
            }
        });

        if (selectedOptions.length > 0) {
            console.log('Selected options:', selectedOptions); // For debugging or processing
            // Proceed to the next step (Step 10)
            window.location.href = 'step-10.html';
        } else {
            alert('Please select at least one option.');
        }
    });
});
