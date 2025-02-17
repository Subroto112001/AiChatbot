const messageIntput = document.querySelector(".message-input");

const sendMessageButton = document.querySelector("#Send-message");
const chatBody = document.querySelector(".chat-body");
const userData = {
    message: null
}


// creating message element with dybamic classes and returning it
const createMessageElement = (content, classes) => {
    const div = document.createElement("div")
    div.classList.add("message", classes);
    div.innerHTML = content
    return div
}

// handeling outgoing user message
const handleOutGoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageIntput.value.trim();
    messageIntput.value = "";
    // create and dsiplay user message

    const messageContent = `     <div class="message-text"> </div>`;
    const outGoingMessagediv = createMessageElement(messageContent, "user-message");
    outGoingMessagediv.querySelector(".message-text").textContent = userData.message;
    chatBody.appendChild(outGoingMessagediv);
    
    // Simulated bot response with thinking indicator after a delay
    
    setTimeout(() => {
        const messageContent = `<span class="bot-avatar">
                        <i class="fa-sharp fa-solid fa-message-bot"></i>
                    </span>
                    <div class="message-text">
                        <div class="thinking-indicator">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                    </div>`;
        const incomingMessagediv = createMessageElement(
          messageContent,
          "bot-message"
        );
       
        chatBody.appendChild(incomingMessagediv);
    },600)
}

// handeling if pree enter button
messageIntput.addEventListener("keydown", (e) => {
    const UserMessage = e.target.value.trim();
    if (e.key === "Enter" && UserMessage) {
        handleOutGoingMessage(e);
        
    }
});
sendMessageButton.addEventListener('click', (e) => {
    handleOutGoingMessage(e)
});