async function sendMessage() {
  const input = document.getElementById("msg");
  const messages = document.getElementById("messages");

  const text = input.value.trim();

  if (!text) return;

  // Show user message
  messages.innerHTML += `
    <div class="user">
      ${text}
    </div>
  `;

  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "student001",
        userMessage: text   // ✅ Backend ke according change kiya
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      messages.innerHTML += `
        <div class="bot">
          ❌ ${data.error}
        </div>
      `;
      return;
    }

    messages.innerHTML += `
      <div class="bot">
        ${data.reply}
      </div>
    `;

    messages.scrollTop = messages.scrollHeight;

  } catch (error) {
    console.error(error);

    messages.innerHTML += `
      <div class="bot">
        ❌ Server Error
      </div>
    `;
  }
}
// Load chat history
window.onload = loadHistory;

async function loadHistory() {
  try {
    const response = await fetch("/api/history/student001");

    if (!response.ok) return;

    const chats = await response.json();

    const messages = document.getElementById("messages");

    chats.forEach((chat) => {
      messages.innerHTML += `
        <div class="user">${chat.message}</div>
        <div class="bot">${chat.reply}</div>
      `;
    });

    messages.scrollTop = messages.scrollHeight;

  } catch (error) {
    console.log(error);
  }
}

// ✅ User Name
//photo
const user = JSON.parse(localStorage.getItem("user"));

if(user){

document.getElementById("username").innerText=user.name;

document.getElementById("profilePic").src=
user.photo || "/images/default-user.png";

}

// ✅ Logout
/*function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  alert("Logged Out Successfully");

  window.location.href = "/login.html";
}*/

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login.html";
}

// ✅ Dummy Buttons
function cgpa() {
  alert("CGPA Calculator Coming Soon");
}

function attendance() {
  alert("Attendance Module Coming Soon");
}

function notes() {
  alert("Notes Module Coming Soon");
}

//cgpa function of working
function cgpa() {
    document.getElementById("cgpaModal").style.display = "flex";
}

function closeCGPA() {
    document.getElementById("cgpaModal").style.display = "none";
}

function addSubject() {

    const row = document.createElement("div");

    row.className = "subject-row";

    row.innerHTML = `
        <input type="number" placeholder="Credits" class="credit">

        <select class="grade">
            <option value="10">O</option>
            <option value="9">A+</option>
            <option value="8">A</option>
            <option value="7">B+</option>
            <option value="6">B</option>
            <option value="5">C</option>
            <option value="0">F</option>
        </select>
    `;

    document.getElementById("subjects").appendChild(row);
}

function calculateCGPA() {

    const credits = document.querySelectorAll(".credit");
    const grades = document.querySelectorAll(".grade");

    let totalCredits = 0;
    let totalPoints = 0;

    for(let i = 0; i < credits.length; i++) {

        const c = Number(credits[i].value);

        const g = Number(grades[i].value);

        if(c > 0){
            totalCredits += c;
            totalPoints += c * g;
        }

    }

    if(totalCredits === 0){

        document.getElementById("cgpaResult").innerText =
        "Enter valid credits.";

        return;
    }

    const cgpa = (totalPoints / totalCredits).toFixed(2);

    document.getElementById("cgpaResult").innerHTML =
    "🎓 Your CGPA : <b>" + cgpa + "</b>";

}

function attendance(){

    document.getElementById("attendanceModal").style.display="flex";

}

function closeAttendance(){

    document.getElementById("attendanceModal").style.display="none";

}

//attendance function
function calculateAttendance(){

    const total=Number(document.getElementById("totalClasses").value);

    const attended=Number(document.getElementById("attendedClasses").value);

    if(total<=0){

        document.getElementById("attendanceResult").innerHTML=
        "❌ Enter valid total classes.";

        return;

    }

    if(attended>total){

        document.getElementById("attendanceResult").innerHTML=
        "❌ Attended classes cannot exceed total classes.";

        return;

    }

    const percent=((attended/total)*100).toFixed(2);

    let message="";

    if(percent>=75){

        message="✅ Great! Attendance is above 75%.";

    }else{

        let need=0;

        while(((attended+need)/(total+need))*100<75){

            need++;

        }

        message=`⚠ Attend ${need} more consecutive classes to reach 75%.`;

    }

    document.getElementById("attendanceResult").innerHTML=`
        <br>
        <b>Attendance :</b> ${percent}% <br><br>
        ${message}
    `;

}

//notes function
function notes(){

document.getElementById("notesModal").style.display="flex";

loadNotes();

}

function closeNotes(){

document.getElementById("notesModal").style.display="none";

}

// Upload Note
async function uploadNote() {

    const file = document.getElementById("pdf").files[0];

    if (!file) {
        alert("Please select a PDF file.");
        return;
    }

    const form = new FormData();

    form.append("subject", document.getElementById("subject").value);
    form.append("title", document.getElementById("title").value);
    form.append("pdf", file);

    try {

        const response = await fetch("/api/notes/upload", {
            method: "POST",
            body: form
        });

        const data = await response.json();

        alert(data.message || "Uploaded Successfully");

        loadNotes();

    } catch (err) {

        console.log(err);
        alert("Upload Failed");

    }

}

// Load Notes
async function loadNotes() {

    try {

        const response = await fetch("/api/notes");

        const notes = await response.json();

        let html = "";

        notes.forEach(note => {

            html += `
            <div class="note-card">

                <h4>${note.subject}</h4>

                <p>${note.title}</p>

                <a href="${note.file}" target="_blank">
                    📄 Open PDF
                </a>

                <br><br>

                <button onclick="deleteNote('${note._id}')">
                    🗑 Delete
                </button>

                <hr>

            </div>
            `;

        });

        document.getElementById("notesList").innerHTML = html;

    } catch (err) {

        console.log(err);

    }

}

// Delete Note
async function deleteNote(id) {

    if (!confirm("Delete this note?")) return;

    await fetch("/api/notes/" + id, {
        method: "DELETE"
    });

    loadNotes();

}


// Search History

function searchHistory(){

document.getElementById("historyModal").style.display="flex";

loadSearchHistory();

}

function closeHistory(){

document.getElementById("historyModal").style.display="none";

}

let allHistory=[];

async function loadSearchHistory(){

const response=await fetch("/api/history/student001");

const chats=await response.json();

allHistory=chats;

displayHistory(chats);

}

function displayHistory(chats){

let html="";

chats.reverse().forEach(chat=>{

html+=`

<div class="history-card">

<b>👤 ${chat.message}</b>

<br><br>

🤖 ${chat.reply}

<br><br>

<button onclick="deleteHistory('${chat._id}')">

🗑 Delete

</button>

</div>

`;

});

document.getElementById("historyList").innerHTML=html;

}

function filterHistory(){

const keyword=document
.getElementById("searchBox")
.value
.toLowerCase();

const filtered=allHistory.filter(chat=>

chat.message.toLowerCase().includes(keyword)

);

displayHistory(filtered);

}

async function deleteHistory(id){

await fetch("/api/history/"+id,{

method:"DELETE"

});

loadSearchHistory();

}

async function clearHistory(){

if(!confirm("Delete all history?"))
return;

await fetch("/api/history/clear/student001",{

method:"DELETE"

});

loadSearchHistory();

}

function toggleSidebar(){

const sidebar=document.getElementById("sidebar");

sidebar.classList.toggle("active");

}

if(window.innerWidth<=768){
document.getElementById("sidebar").classList.remove("active");
}

/*/ Load chat history
window.onload = loadHistory;

async function loadHistory() {
  try {
    const response = await fetch("/api/history/student001");

    if (!response.ok) return;

    const chats = await response.json();

    const messages = document.getElementById("messages");

    chats.forEach((chat) => {
      messages.innerHTML += `
        <div class="user">
          ${chat.message}
        </div>

        <div class="bot">
          ${chat.reply}
        </div>
      `;
    });

    messages.scrollTop = messages.scrollHeight;

  } catch (error) {
    console.log(error);
  }
  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
}
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    document.getElementById("username").innerText = user.name;
}
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged Out Successfully");

    window.location.href = "/login.html";
}
}//


/* open ai wala

async function sendMessage() {

const input = document.getElementById("msg");
const messages = document.getElementById("messages");

const text = input.value.trim();

if (!text) return;

messages.innerHTML += `
<div class="user">
${text}
</div>
`;

input.value = "";

const response = await fetch("/api/chat", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
userId: "student001",
message: text
})
});

const data = await response.json();

messages.innerHTML += `
<div class="bot">
${data.reply}
</div>
`;

messages.scrollTop =
messages.scrollHeight;
}

window.onload = loadHistory;


async function loadHistory(){

try{

const response = await fetch(
"/api/history/student001"
);


const chats = await response.json();


const messages =
document.getElementById("messages");


chats.forEach(chat=>{


messages.innerHTML += `

<div class="user">
${chat.message}
</div>


<div class="bot">
${chat.reply}
</div>

`;

});


messages.scrollTop =
messages.scrollHeight;


}
catch(error){

console.log(error);

}

}*/



/*function sendMessage(){

const input =
document.getElementById("msg");

const messages =
document.getElementById("messages");

messages.innerHTML +=
`<p><b>You:</b> ${input.value}</p>`;

input.value="";

}

async function loadHistory(userId){

const response =
await fetch(`/api/history/${userId}`);

const chats =
await response.json();

chats.forEach(chat => {

messages.innerHTML += `
<div class="user">
${chat.message}
</div>

<div class="bot">
${chat.reply}
</div>
`;

});

}*/
