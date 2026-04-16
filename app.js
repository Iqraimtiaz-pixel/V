let currentUser = "";

function login() {
  let username = document.getElementById("username").value;
  
  if (username === "") {
    alert("Enter Vibe ID");
    return;
  }

  currentUser = username;

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("chatPage").classList.remove("hidden");

  document.getElementById("user").innerText = username;
}

function sendMessage() {
  let msg = document.getElementById("message").value;

  if (msg === "") return;

  let chatBox = document.getElementById("chatBox");

  let div = document.createElement("div");
  div.className = "msg";
  div.innerText = currentUser + ": " + msg;

  chatBox.appendChild(div);

  document.getElementById("message").value = "";
}