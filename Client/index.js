// const form = document.getElementById("form");
// const usernameInput = document.getElementById("username");
// const joinBtn = document.getElementById("joinBtn");
// const container = document.getElementById("container");
// const messageInput = document.getElementById("message");
// const sendBtn = document.getElementById("sendBtn");
// const messageList = document.getElementById("messageList");
// const audio = new Audio("Client_effect.mp3");

// const socket = io("http://localhost:3000");

// socket.on("connect", () => {
//   console.log("Connected to server");
// });

// socket.on("receive-message", ({ username, message }) => {
//   document.getElementById("typing").textContent = "";

//   console.log(`[${username}]: ${message}`);

//   if (username !== usernameInput.value) audio.play();

//   messageList.appendChild(
//     document.createElement("li")
//   ).textContent = `[${username}]: ${message}`;
// });

// joinBtn.addEventListener("click", () => {
//   if (usernameInput.value) {
//     container.style.display = "block";
//     form.style.display = "none";
//   }
// });

// sendBtn.addEventListener("click", async () => {
//   const message = messageInput.value;
//   const file = fileInput.files[0]; 
//   const username = usernameInput.value;

//   if (!message && !file) return; // boş mesaj göndərməsin

//   if (file) {
//     const reader = new FileReader();
//     reader.onload = function () { 
//       socket.emit("chat", {
//         username,
//         message,
//         image: reader.result,
//       });
//     };
//     reader.readAsDataURL(file);
//   } else {
//     socket.emit("chat", {
//       username,
//       message,
//     });
//   }

//   messageInput.value = "";
//   fileInput.value = "";
// });


// socket.on("typing-user", (username) => {
//   document.getElementById("typing").textContent = `${username} is typing...`;

//   console.log(`${username} is typing...`);
// });

// socket.on("receive-message", ({ username, message, imageUrl }) => {
//   document.getElementById("typing").textContent = "";

//   const li = document.createElement("li");
//   li.textContent = `[${username}]: ${message}`;

//   if (imageUrl) {
//     const img = document.createElement("img");
//     img.src = imageUrl;
//     img.alt = "Image";
//     img.style.maxWidth = "200px";
//     li.appendChild(img);
//   }

//   messageList.appendChild(li);
// });




const form = document.getElementById("form");
const usernameInput = document.getElementById("username");
const joinBtn = document.getElementById("joinBtn");
const container = document.getElementById("container");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const messageList = document.getElementById("messageList");
const fileInput = document.getElementById("fileInput"); 
const audio = new Audio("Client_effect.mp3");


const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to server");
});


socket.on("receive-message", ({ username, message, imageUrl }) => {
  document.getElementById("typing").textContent = ""; 

  const li = document.createElement("li");
  li.textContent = `[${username}]: ${message}`;

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl; 
    img.alt = "Image";
    img.style.maxWidth = "200px";
    img.style.borderRadius = "8px"; 
    li.appendChild(img);
  }

  if (username !== usernameInput.value) audio.play(); 

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
  const username = usernameInput.value;

  if (!message && !file) return; 

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      socket.emit("chat", {
        username,
        message,
        image: reader.result, 
      });
    };
    reader.readAsDataURL(file); 
  } else {
    socket.emit("chat", {
      username,
      message,
    });
  }


  messageInput.value = "";
  fileInput.value = "";
});


socket.on("typing-user", (username) => {
  document.getElementById("typing").textContent = `${username} is typing...`;
  console.log(`${username} is typing...`);
});