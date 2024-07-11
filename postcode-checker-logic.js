document.addEventListener('DOMContentLoaded', function() {
    var inputField = document.getElementById('inputField');
    var submitButton = document.getElementById('submitButton');
    var messageDiv = document.getElementById('message');

    // Fetch entries from JSON file
    fetch('approved-postcodes.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var acceptedEntries = data.acceptedEntries;

            inputField.addEventListener('input', function() {
                var value = inputField.value.toUpperCase();
                inputField.value = value; // Ensure text remains uppercase

                var exactAcceptedMatch = acceptedEntries.includes(value);
                var matchesAcceptedPrefix = acceptedEntries.some(function(entry) {
                    return entry.startsWith(value);
                });

                if (exactAcceptedMatch) {
                    messageDiv.textContent = "Congratulations! We can scan your property. Please proceed to book.";
                    messageDiv.className = "message accept";
                    submitButton.disabled = false;
                    submitButton.classList.add('show');
                } else if (value.length >= 4 && !matchesAcceptedPrefix) {
                    messageDiv.textContent = "I'm sorry, we don't cover that area yet.";
                    messageDiv.className = "message reject";
                    submitButton.disabled = true;
                    submitButton.classList.remove('show');
                } else if (value.length >= 5 && !exactAcceptedMatch) {
                    messageDiv.textContent = "I'm sorry, we don't cover that area yet.";
                    messageDiv.className = "message reject";
                    submitButton.disabled = true;
                    submitButton.classList.remove('show');
                } else {
                    messageDiv.textContent = "";
                    messageDiv.className = "message";
                    submitButton.disabled = true;
                    submitButton.classList.remove('show');
                }
            });
        })
        .catch(function(error) {
            console.error('Error fetching the entries:', error);
        });
});
