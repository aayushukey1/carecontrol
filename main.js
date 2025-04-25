// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 🔐 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDyd1Z-BaUR8hxFd_oQLXT2yaYkdo1Uep0",
  authDomain: "carereminder-f8a5b.firebaseapp.com",
  projectId: "carereminder-f8a5b",
  storageBucket: "carereminder-f8a5b.firebasestorage.app",
  messagingSenderId: "1029886753594",
  appId: "1:1029886753594:web:61badb55177c574689ee03"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const remindersRef = collection(db, "reminders");

const form = document.getElementById("reminderForm");
const list = document.getElementById("reminderList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = document.getElementById("message").value;
  const time = document.getElementById("time").value;
  const repeat = document.getElementById("repeat").checked;

  const now = new Date();
  const [hours, minutes] = time.split(":");
  const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +hours, +minutes);

  await addDoc(remindersRef, {
    message,
    time: scheduledTime,
    repeat
  });

  form.reset();
});

// Live update the UI
onSnapshot(remindersRef, (snapshot) => {
  list.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const time = new Date(data.time.seconds * 1000);
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
      <div>
        <strong>${data.message}</strong>
        <br><small>${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${data.repeat ? "Daily" : "One-time"}</small>
      </div>
      <button class="btn btn-danger btn-sm">Delete</button>
    `;
    li.querySelector("button").addEventListener("click", () => {
      deleteDoc(doc(remindersRef, docSnap.id));
    });
    list.appendChild(li);
  });
});
