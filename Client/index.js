const form = document.getElementById("form");
const usernameInput = document.getElementById("username");
const joinBtn = document.getElementById("joinBtn");
const container = document.getElementById("container");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const messageList = document.getElementById("messageList");
const audio = new Audio("Client_effect.mp3");

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("receive-message", ({ username, message }) => {
  document.getElementById("typing").textContent = "";

  console.log(`[${username}]: ${message}`);

  if (username !== usernameInput.value) audio.play();

  messageList.appendChild(
    document.createElement("li")
  ).textContent = `[${username}]: ${message}`;
});

joinBtn.addEventListener("click", () => {
  if (usernameInput.value) {
    container.style.display = "block";
    form.style.display = "none";
  }
});

sendBtn.addEventListener("click", () => {
  socket.emit("chat", {
    username: usernameInput.value,
    message: messageInput.value,
  });
  messageInput.value = "";
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("type", usernameInput.value);
});

messageInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    socket.emit("chat", {
      username: usernameInput.value,
      message: messageInput.value,
    });
    messageInput.value = "";
  }
});

socket.on("typing-user", (username) => {
  document.getElementById("typing").textContent = `${username} is typing...`;

  console.log(`${username} is typing...`);
});

