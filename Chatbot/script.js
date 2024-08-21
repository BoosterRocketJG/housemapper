document.getElementById('send-button').addEventListener('click', function() {
    let userInput = document.getElementById('user-input').value;
    if (userInput) {
        appendMessage('User', userInput);
        document.getElementById('user-input').value = '';
        sendToOpenAI(userInput);
    }
});

function appendMessage(sender, message) {
    let messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    messageContainer.innerHTML = `<strong>${sender}:</strong> ${message}`;
    document.getElementById('chatbot-messages').appendChild(messageContainer);
}

function sendToOpenAI(message) {
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_API_KEY`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }]
        })
    })
    .then(response => response.json())
    .then(data => {
        const aiMessage = data.choices[0].message.content;
        appendMessage('HouseMapper Chatbot', aiMessage);
    })
    .catch(error => console.error('Error:', error));
}
