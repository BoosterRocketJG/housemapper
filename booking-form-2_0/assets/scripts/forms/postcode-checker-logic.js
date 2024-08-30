document.addEventListener('DOMContentLoaded', function() {
    var inputField = document.getElementById('postcodeStub');
    var submitButton = document.getElementById('postcodeButton');
    var messageDiv = document.getElementById('postcodeMessage');
    var inputLabel = document.querySelector('label[for="postcodeStub"]');

    // Fetch validation messages
    fetch('https://boosterrocketjg.github.io/housemapper/booking-form-2_0/assets/data/validation-messages.json')
        .then(response => response.json())
        .then(messages => {
            // Set the label text from the JSON file
            inputLabel.textContent = messages.inputLabel.text;

            // Fetch entries from the approved postcodes JSON file
            fetch('https://boosterrocketjg.github.io/housemapper/booking-form-2_0/assets/data/approved-postcodes.json')
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
                                    messageDiv.textContent = messages.exactMatch.text;
                                    messageDiv.className = "message accept show";
                                    submitButton.disabled = false;
                                    submitButton.classList.add('show');
                                } else {
                                    messageDiv.textContent = messages.noCoverage.text;
                                    messageDiv.className = "message reject show";
                                    submitButton.disabled = true;
                                    submitButton.classList.remove('show');
                                }
                            }, 50); // 50ms delay to ensure browser processes class removal
                        } else {
                            // Clear the message if the input is <= 2 characters
                            messageDiv.textContent = messages.emptyMessage.text;
                            messageDiv.className = "message";
                            submitButton.disabled = true;
                            submitButton.classList.remove('show');
                        }
                    });

                    // Add event listener for form submission to proceed to the next step
                    submitButton.addEventListener('click', function(event) {
                        event.preventDefault(); // Prevent the default form submission
                        var value = inputField.value.replace(/\s+/g, '').toUpperCase();
                        if (acceptedEntries.includes(value)) {
                            window.location.href = 'step-2-space-type.html'; // Redirect to Step 2
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching the approved postcodes:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching validation messages:', error);
        });
});
