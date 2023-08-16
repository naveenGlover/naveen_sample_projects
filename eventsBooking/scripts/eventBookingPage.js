//getting local storage of all events
let tempEvent = localStorage.getItem("events");
if (tempEvent === null) {
    tempEvent = '[]';
}
const eventLst = JSON.parse(tempEvent);

//getting users names
let tempUserlst = localStorage.getItem("users");
let userLst = JSON.parse(tempUserlst);

//function to get proper username of the particular event
function findUserName(userId) {
    let currentUser = userLst.find(e => e.userId == userId);
    return currentUser.userName;
}

var app = document.getElementById('boxes');
if (eventLst.length === 0) {
    app.innerHTML = `<div class="noEvents"><span><center>
    <img src="/assert/empty.png" width=300px height=300px>
    <h3>There was no events available</h3>
    </center>
    </span>
    </div>`;
} else {
    app.innerHTML = eventLst.map((wizard) => {
        return `<div class="event">
                <p class="event-name">${wizard.eventName}</p>
                <p> <i class="fa-regular fa-clock"></i>  duration :  ${durationConvert(wizard.duration, wizard.format)} ${wizard.format}</p>
                <div class="event-box">
                    <p>${wizard.eventDesc}</p>
                    </div>
                    <p class="author"><i class="fa-regular fa-user"></i>  ${findUserName(wizard.userId)}</p>
                <button class="book-btn" id="${wizard.eventId}" onclick="bookingPage(this.id)">Register</button>
            </div>`;
    }).join(" ");
}

//seting time to reload page
function pageReload() {
    window.location = '/pages/registration.html';
}
function bookingPage(eventId) {
    localStorage.setItem("register", eventId);
    const myTimeout = setTimeout(pageReload, 300);
}

function durationConvert(duration, format) {
    if (format === 'hrs') {
        duration = duration / 60;
        return duration
    } else {
        return duration;
    }
}