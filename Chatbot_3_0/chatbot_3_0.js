document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const chatArea = document.getElementById('chat-area');

    // Adjust textarea height dynamically
    input.addEventListener('input', function() {
        this.style.height = 'auto'; // Reset the height
        this.style.height = Math.min(this.scrollHeight, 600) + 'px'; // Expand up to 600px
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = input.value.trim();
        if (message) {
            addMessage(message, 'right'); // Add user message
            addMessage("This is a bot response", 'left'); // Placeholder for bot response
            input.value = ''; // Clear input
            input.style.height = 'auto'; // Reset height
        }
    });

    // Add message to chat area
    function addMessage(text, alignment) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', alignment);
        messageElement.textContent = text;
        chatArea.appendChild(messageElement);
        chatArea.scrollTop = chatArea.scrollHeight; // Scroll to bottom
    }

    // Handle Enter key for submission
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent default new line
            form.dispatchEvent(new Event('submit')); // Trigger form submission
        }
    });
});
