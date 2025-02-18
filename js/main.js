const messageIntput = document.querySelector(".message-input");

const sendMessageButton = document.querySelector("#Send-message");
const chatBody = document.querySelector(".chat-body");
const fileInput = document.querySelector("#fle-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");

// api Setup
const API_KEY = "AIzaSyBCu8moTDRMpREF90BaVnAt81dHuqed7aw";

const API_Url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;



const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
}


// creating message element with dybamic classes and returning it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div")
    div.classList.add("message", ...classes);
    div.innerHTML = content
    return div
}


// generate bot response using api
const generateBotResponse = async (incomingMessagediv) => {
const messageElement = incomingMessagediv.querySelector(".message-text");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: userData.message },
            ...(userData.file.data ? [{ inline_data: userData.file }] : []),
          ],
        },
      ],
    }),
  };

  try {
    // flash bot response error
    const response = await fetch(API_Url, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
  
// extraxt and display bot response text
      const apiResponsetest = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      
      messageElement.innerText = apiResponsetest;
  } catch (error) {
      
    //   handle error in API response
      console.log(error);
      messageElement.innerText = error.message;
     messageElement.style.color = "#fff0000";

  } finally {
      userData.file = {
          
      }
      incomingMessagediv.classList.remove("thinking");
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

// handeling outgoing user message
const handleOutGoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageIntput.value.trim();
    messageIntput.value = "";
    // create and dsiplay user message

    const messageContent = `     <div class="message-text"> </div> ${userData.file.data ? `<img src = "data:${userData.file.mime_type};base64, ${userData.file.data}" class = "attachment" />` : ""}`;
    const outGoingMessagediv = createMessageElement(messageContent, "user-message");
    outGoingMessagediv.querySelector(".message-text").textContent = userData.message;
    chatBody.appendChild(outGoingMessagediv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
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
          "bot-message",
          "thinking"
        );
       
        chatBody.appendChild(incomingMessagediv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
        generateBotResponse(incomingMessagediv);
    },600)
}

// handeling if pree enter button
messageIntput.addEventListener("keydown", (e) => {
    const UserMessage = e.target.value.trim();
    if (e.key === "Enter" && UserMessage) {
        handleOutGoingMessage(e);
        
    }
});

// handle file input change and preview the selected file

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
   
    
    const reader = new FileReader();
    reader.onload = (e) => {
       fileUploadWrapper.querySelector("img").src = e.target.result;

        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];
// store file data in userData
        userData.file = {
          data: base64String,
          mime_type: file.type,
        };
    
        fileInput.value = "";
        
    }
    reader.readAsDataURL(file)
})


sendMessageButton.addEventListener('click', (e) => {
    handleOutGoingMessage(e)
});

document
  .querySelector("#file-upload")
  .addEventListener("click", () => fileInput.click());
