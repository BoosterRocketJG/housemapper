document.addEventListener('DOMContentLoaded', function() {
    var inputField = document.getElementById('inputField');
    var submitButton = document.getElementById('submitButton');
    var messageDiv = document.getElementById('message');

    // Fetch entries from JSON file
    fetch('approved-postcodes.json')
        .then(response => response.json())
        .then(data => {
            var acceptedEntries = data.acceptedEntries;

            inputField.addEventListener('input', function() {
                // Remove whitespace and limit input to 4 characters
                var value = inputField.value.replace(/\s+/g, '').toUpperCase();

                // If space or >4 characters are entered, run the check immediately
                if (value.length > 4 || /\s/.test(inputField.value)) {
                    value = value.slice(0, 4); // Limit to 4 characters
                    inputField.value = value;
                }

                // Run check if >2 characters are entered
                if (value.length > 2) {
                    var exactAcceptedMatch = acceptedEntries.includes(value);

                    // Clear existing message and reset opacity for fade-in effect
                    messageDiv.classList.remove('show');

                    setTimeout(function() { // Introduce a small delay
                        if (exactAcceptedMatch) {
                            messageDiv.textContent = "Congratulations! We can scan your property. Please proceed to book.";
                            messageDiv.className = "message accept show";
                            submitButton.disabled = false;
                            submitButton.classList.add('show');
                        } else {
                            messageDiv.textContent = "I'm sorry, we don't cover that area yet.";
                            messageDiv.className = "message reject show";
                            submitButton.disabled = true;
                            submitButton.classList.remove('show');
                        }
                    }, 50); // 50ms delay to ensure browser processes class removal
                } else {
                    // Clear the message if the input is <= 3 characters
                    messageDiv.textContent = "";
                    messageDiv.className = "message";
                    submitButton.disabled = true;
                    submitButton.classList.remove('show');
                }
            });
        })
        .catch(error => {
            console.error('Error fetching the entries:', error);
        });
});
