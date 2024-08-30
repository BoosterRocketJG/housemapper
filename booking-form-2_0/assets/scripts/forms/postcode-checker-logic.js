document.addEventListener('DOMContentLoaded', function () {
    const postcodeButton = document.getElementById('postcodeButton');
    const postcodeStubField = document.getElementById('postcodeStub');
    const postcodeMessage = document.getElementById('postcodeMessage');

    // Event listener for the button
    postcodeButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission

        const postcodeStub = postcodeStubField.value.trim();

        // Fetch both JSON files concurrently
        Promise.all([fetchApprovedPostcodes(), fetchResponseMessages()])
            .then(([approvedPostcodes, responseMessages]) => {
                if (isPostcodeApproved(postcodeStub, approvedPostcodes)) {
                    displayMessage(responseMessages.success, "green");
                } else {
                    displayMessage(responseMessages.failure, "red");
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                displayMessage("An error occurred. Please try again later.", "red");
            });
    });

    // Fetch JSON data for approved postcodes
    function fetchApprovedPostcodes() {
        return fetch('https://cdn.jsdelivr.net/gh/boosterrocketJG/housemapper/approved-postcodes.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    }

    // Fetch JSON data for response messages
    function fetchResponseMessages() {
        return fetch('https://cdn.jsdelivr.net/gh/boosterrocketJG/housemapper/response-messages.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    }

    // Function to check if the postcode is approved
    function isPostcodeApproved(postcode, approvedPostcodes) {
        // Example check, modify as needed
        return approvedPostcodes.includes(postcode.toUpperCase());
    }

    // Function to display messages
    function displayMessage(message, color) {
        postcodeMessage.textContent = message;
        postcodeMessage.style.color = color;
    }
});
