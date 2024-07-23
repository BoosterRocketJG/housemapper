document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    fetch('messages.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(messages => {
            console.log("Messages loaded:", messages);

            // Update the form text using messages from the JSON file
            document.getElementById('inputLabel').textContent = messages.inputLabel.text;
            document.getElementById('submitButton').textContent = messages.submitButton.text;
            document.getElementById('message').textContent = messages.entryNotExists.text;

            document.getElementById('myForm').addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent the default form submission
                const inputField = document.getElementById('inputField');
                const inputValue = inputField.value.toUpperCase();

                console.log("Form submitted with value:", inputValue);

                // Fetch the JSON file and check the input value
                fetch('data.json') // Adjust the path to your JSON file
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("Data loaded:", data);

                        const resultDiv = document.getElementById('result');
                        const messageH3 = document.getElementById('message');
                        if (data.includes(inputValue)) {
                            resultDiv.textContent = messages.entryExists.text;
                            resultDiv.style.display = 'block';
                            messageH3.style.display = 'none';
                        } else {
                            // Hide everything and show the message
                            document.getElementById('myForm').style.display = 'none';
                            resultDiv.style.display = 'none';
                            messageH3.style.display = 'block';
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching data.json:', error);
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching messages.json:', error);
        });
});

function validateInput() {
    const inputField = document.getElementById('inputField');
    // Remove spaces and convert to uppercase as user types
    inputField.value = inputField.value.replace(/\s+/g, '').toUpperCase();
}
