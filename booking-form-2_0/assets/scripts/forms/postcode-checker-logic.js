document.addEventListener('DOMContentLoaded', function() {
    const postcodeInput = document.querySelector('.postcodeStub');
    const postcodeMessage = document.querySelector('.postcodeMessage');
    const postcodeButton = document.querySelector('.postcodeButton');
    let timeout;

    // Function to check the input against the JSON file
    function checkPostcode(postcode) {
        fetch('https://assets.housemapper.co.uk/booking-form-2_0/assets/data/approved-postcodes.json')
            .then(response => response.json())
            .then(data => {
                if (data.includes(postcode)) {
                    postcodeMessage.textContent = 'Yep!';
                    postcodeButton.style.display = 'block'; // Display button on success
                } else {
                    postcodeMessage.textContent = '';
                    postcodeButton.style.display = 'none'; // Hide button if not successful
                }
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
                postcodeMessage.textContent = ''; // Clear message if there's an error
                postcodeButton.style.display = 'none'; // Hide button on error
            });
    }

    // Event listener for input field
    postcodeInput.addEventListener('input', function(event) {
        let input = event.target.value.toUpperCase(); // Convert input to uppercase
        postcodeInput.value = input; // Set the transformed input back to the field

        // Clear any existing timeout to avoid multiple triggers
        clearTimeout(timeout);

        // Check if input has more than 2 characters
        if (input.length > 2) {
            // Set a delay of 300ms before checking the input against the JSON
            timeout = setTimeout(function() {
                checkPostcode(input);
            }, 300);
        } else {
            postcodeMessage.textContent = ''; // Clear message if input is less than 3 characters
            postcodeButton.style.display = 'none'; // Hide button if input is less than 3 characters
        }
    });
});
