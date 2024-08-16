let shouldScroll = false; 

document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('send_message');
    
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
    if (senderOrReceiver == 'sender') {
        
        const typing = document.getElementById('tmp');
        typing.remove();
    }

    chatContainer.appendChild(messageWrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Play the sound
    const messageSound = document.getElementById(senderOrReceiver+'Audio');
    messageSound.play();
}

function addTypingMessageToChat(senderOrReceiver) {
    const chatContainer = document.getElementById('messages');

    const effect = document.createElement('div');
    effect.className = 'dot-elastic';

    const effect_container = document.createElement('div');
    effect_container.className = 'typing'
    effect_container.appendChild(effect)

    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    messageBubble.appendChild(effect_container)

    const messageWrapper = document.createElement('div');
    messageWrapper.className = senderOrReceiver;
    messageWrapper.id = 'tmp'
    messageWrapper.appendChild(messageBubble);

    chatContainer.appendChild(messageWrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;

}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function simulateApiCall(messageText) {
    const resp = await  askQuestion(messageText);
    const delayTime = resp.length * 10;
    addTypingMessageToChat('sender')
    
    await delay(delayTime);
    
    addMessageToChat('sender',resp)
    shouldScroll = false;
}


// Function to generate a random username
function generateRandomUsername() {
    const adjectives = ["Quick", "Bright", "Clever", "Brave", "Bold"];
    const animals = ["Fox", "Lion", "Eagle", "Wolf", "Bear"];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    
    return `${randomAdjective}${randomAnimal}${Math.floor(Math.random() * 1000)}`;
}

// Assign a random username when the script starts
const username = generateRandomUsername();
console.log("Assigned Username:", username);

async function askQuestion(message) {
    const data = {
        user_id: username,  // Use the randomly generated username
        message: message
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/submit_answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Response from API:", result.response);
        return result.response;
    } catch (error) {
        console.error("Error occurred:", error.message);
    }
}

async function reqQuestion() {
    const data = {
        user_id: username,  // Use the randomly generated username
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/get_riddle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Response from API:", result.response);
        return result.response;
    } catch (error) {
        console.error("Error occurred:", error.message);
    }
}

async function buttonClick(value) {
    const display = document.getElementById('display');
    const newMenu = document.getElementById('chat_area');
    const btn_audio = document.getElementById('click_audio');
    btn_audio.play();
    
    if (value === 'AC') {
        display.value = ''; // Clear the display
    } else if (value === 'DE') {
        display.value = display.value.slice(0, -1); // Delete the last character
    } else if (value === '=') {
        newMenu.scrollIntoView({ behavior: 'smooth' });
        const resp = await reqQuestion(); 
        const delayTime = resp.length * 10;
        
        try {
            display.value = eval(display.value); // Evaluate the expression in the display
        } catch (error) {
            display.value = 'Error'; // Handle any errors in the evaluation
            return;
        }
        
        // Scroll to the new menu after evaluation
        
        addTypingMessageToChat('sender');
        
        await delay(delayTime);
        
        addMessageToChat('sender', resp);
    } else {
        display.value += value; // Append the button value to the display
    }
}

if (typeof shouldScroll !== 'undefined' && shouldScroll) {
    newMenu.scrollIntoView({ behavior: 'smooth' });
    console.log('Scrolling to the new menu');
}




