document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('send_message');
    
    // Add the event listener for the keydown event
    inputField.addEventListener('keydown', handleKeyDown);
});



function handleKeyDown(event) {
    
    if (event.key === 'Enter') {
        const input = document.getElementById('send_message');
        const messageText = input.value.trim();
        
        if (messageText) {
            addMessageToChat('receiver', messageText);
            input.value = '';
            simulateApiCall(messageText);
        }
    }
}

function addMessageToChat(senderOrReceiver, messageText) {
    const chatContainer = document.getElementById('messages');

    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    messageBubble.textContent = messageText;

    const messageWrapper = document.createElement('div');
    messageWrapper.className = senderOrReceiver;
    messageWrapper.appendChild(messageBubble);

    chatContainer.appendChild(messageWrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Play the sound
    const messageSound = document.getElementById(senderOrReceiver+'Audio');
    messageSound.play();
}


function simulateApiCall(messageText) {
    console.log('Sending message to API:', messageText);
    // Replace this with an actual API call, e.g., using fetch or XMLHttpRequest
}

