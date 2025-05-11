const form = document.getElementById("form");
const usernameInput = document.getElementById("username");
const joinBtn = document.getElementById("joinBtn");
const container = document.getElementById("container");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const messageList = document.getElementById("messageList");
const audio = new Audio("Client_effect.mp3");

let userId = null; // token decode olunmuş userId
let receiverId = 1; // məsələn, adminin id-si (test məqsədi ilə)

const token = "JWT_TOKEN_HERE"; // Bura login olarkən gələn tokeni yaz

const socket = io("http://localhost:4000", {
  auth: { token },
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("receive-message", ({ username, message }) => {
  document.getElementById("typing").textContent = "";
  messageList.appendChild(
    document.createElement("li")
  ).textContent = `[${username}]: ${message}`;
  if (username !== usernameInput.value) audio.play();
});

joinBtn.addEventListener("click", () => {
  if (usernameInput.value) {
    form.style.display = "none";
    container.style.display = "block";
  }
});

sendBtn.addEventListener("click", () => {
  socket.emit("chat", {
    message: messageInput.value,
    receiverId,
  });
  messageInput.value = "";
});

messageInput.addEventListener("keypress", () => {
  socket.emit("type", receiverId);
});

messageInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    socket.emit("chat", {
      message: messageInput.value,
      receiverId,
    });
    messageInput.value = "";
  }
});

socket.on("typing-user", (username) => {
  document.getElementById("typing").textContent = `${username} is typing...`;
});
