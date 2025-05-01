const form = document.getElementById("form");
const usernameInput = document.getElementById("username");
const joinBtn = document.getElementById("joinBtn");
const container = document.getElementById("container");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const messageList = document.getElementById("messageList");
const fileInput = document.getElementById("fileInput");
const audio = new Audio("Client_effect.mp3");

// Token ilə socket bağlantı
const socket = io("http://localhost:4000", {
  auth: {
    token: localStorage.getItem("token"), // login zamanı saxlanılıb
  }
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("receive-message", ({ senderId, receiverId, content, imageUrl }) => {
  const li = document.createElement("li");
  li.textContent = `[User ${senderId}]: ${content}`;

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Image";
    img.style.maxWidth = "200px";
    img.style.borderRadius = "8px";
    li.appendChild(img);
  }

  if (senderId.toString() !== localStorage.getItem("userId")) {
    audio.play();
  }

  messageList.appendChild(li);
});

joinBtn.addEventListener("click", () => {
  if (usernameInput.value) {
    container.style.display = "block";
    form.style.display = "none";
  }
});

sendBtn.addEventListener("click", async () => {
  const message = messageInput.value;
  const file = fileInput.files[0];
  const receiverId = "1"; // admin id 

  if (!message && !file) return;

  const payload = {
    message,
    receiverId,
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      payload.image = reader.result;
      socket.emit("chat", payload);
    };
    reader.readAsDataURL(file);
  } else {
    socket.emit("chat", payload);
  }

  messageInput.value = "";
  fileInput.value = "";
});
