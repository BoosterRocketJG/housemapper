document.addEventListener('DOMContentLoaded', function () {
    const postcodeButton = document.getElementById('postcodeButton');
    const postcodeStubField = document.getElementById('postcodeStub');
    const postcodeMessage = document.getElementById('postcodeMessage');

    // Event listener for the button
    postcodeButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission

        const postcodeStub = postcodeStubField.value.trim();
        
        // Fetch and check postcodes
        fetchApprovedPostcodes()
            .then(approvedPostcodes => {
                if (isPostcodeApproved(postcodeStub, approvedPostcodes)) {
                    postcodeMessage.textContent = "Postcode is within the service area.";
                    postcodeMessage.style.color = "green";
                } else {
                    postcodeMessage.textContent = "Sorry, we do not service this area.";
                    postcodeMessage.style.color = "red";
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                postcodeMessage.textContent = "An error occurred. Please try again later.";
                postcodeMessage.style.color = "red";
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

    // Function to check if the postcode is approved
    function isPostcodeApproved(postcode, approvedPostcodes) {
        // Example check, modify as needed
        return approvedPostcodes.includes(postcode.toUpperCase());
    }
});
