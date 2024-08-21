document.getElementById('enhancedForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('emailInput').value;
    const postcodeInput = document.getElementById('postcodeInput').value;
    const phoneInput = document.getElementById('phoneInput').value;
    const fullNameInput = document.getElementById('fullNameInput').value;

    fetch('https://02sfka.buildship.run/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: emailInput,
            postcode: postcodeInput,
            phone: phoneInput,
            fullName: fullNameInput
        })
    })
    .then(response => {
        if (response.ok) {
            alert('Data submitted successfully!');
        } else {
            alert('Error submitting data.');
        }
    })
    .catch(error => {
        alert('Network error: ' + error.message);
    });
});
