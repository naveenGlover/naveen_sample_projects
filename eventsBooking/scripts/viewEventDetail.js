// getting the particular event
let eventId = localStorage.getItem("viewEvent");
let allEvents = JSON.parse(localStorage.getItem("events"));
let currentEvent = allEvents.find(e => e.eventId === eventId);

//getting users details
const tempUsers = localStorage.getItem("users");
var usersLst = JSON.parse(tempUsers);

//getting current user details
const currentUser = localStorage.getItem("currentUser");
var currentUserObj = JSON.parse(currentUser);

//setting user name in dashboard
var username = document.getElementById("username");
username.innerText = currentUserObj.userName;

//getting events of the current user
var tempEvent = localStorage.getItem("events");
if (tempEvent === null) {
    tempEvent = '[]';
}
var tempEventLst = JSON.parse(tempEvent);

// getting booked slots from localstorage
let bookedSlots = JSON.parse(localStorage.getItem("bookedSlots"));

// formatting Time to hrs
function timeConvert(min) {
    if (min >= 60) {
        min = min / 60;
        min = min + " hrs";
    }
    else {
        min = min + " min";
    }
    return min;
}

//setting respective values of the particular event
document.getElementById("eventName").innerText = currentEvent.eventName;
document.getElementById("eventDays").innerText = currentEvent.noOfDays;
document.getElementById("eventDuration").innerText = timeConvert(Number(currentEvent.duration));
if (currentEvent.eventDesc !== "") {
    document.getElementById("eventDesc").innerText = currentEvent.eventDesc;
} else {

    document.getElementById("eventDesc").innerText = "No Description Provided...";
}
let timeSlots = [];
let day = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thuresday", fri: "Friday", sat: "Saturday", sun: "Sunday" }
let days = Object.keys(currentEvent.workingDays);
let time = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
let AmPm = [' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM'];
for (let i = 0; i < days.length; i++) {
    let startTime = currentEvent.workingDays[days[i]].startTime;
    let endTime = currentEvent.workingDays[days[i]].endTime;
    let startHrs = Number(startTime.slice(0, 2));
    let startMin = startTime.slice(3, 5);
    let endHrs = Number(endTime.slice(0, 2));
    let endMin = endTime.slice(3, 5);
    let tempSlot = days[i] + " : " + time[startHrs] + ":" + startMin + AmPm[startHrs] + " - " + time[endHrs] + ":" + endMin + AmPm[endHrs];
    timeSlots.push(tempSlot);
}
document.getElementById("slotTiming").innerHTML = '<table><b><tr><th>Days</th><th>Start Time</th><th>End Time</th></tr></b>' + timeSlots.map((wizard) => {
    return `<tr><td>${day[wizard.slice(0, 3)]}</td><td>${wizard.slice(6, 15)}</td><td>${wizard.slice(16,)}</td></tr>`;
}).join(" ") + '</table>';

// showing appiontment cards
if (bookedSlots !== null) {
    let currentEventSlots = bookedSlots.filter((e) => e.eventId === eventId);
    if (currentEventSlots.length !== 0) {
        document.getElementById("bookedDetails").innerHTML = currentEventSlots.map(event => {
            return `<div class="appointmentCard">
            <div class="cardHead">
                <h4><i class="fa-regular fa-user"></i> ${event.userDetail.userName}</h4>
                <button class="delete-btn" id="${event.slotId}" onclick="deleteBookedSlot(this.id)"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <p><i class="fa-solid fa-phone"></i> ${event.userDetail.mobileNo}</p>
            <p><i class="fa-regular fa-envelope"></i> ${event.userDetail.email}</p>
            <div class="dateTime">
                <p><i class="fa-regular fa-calendar"></i> ${event.slot.date}</p>
                <p><i class="fa-regular fa-clock"></i> ${event.slot.time}</p>
            </div>
            </div>
            `;
        }).join(" ");
    }
}

//checking the user is logged in or not
function pageOnloadView() {
    let currentUser = localStorage.getItem("currentUser");
    let viewEventId = localStorage.getItem("viewEvent");
    if (currentUser === null) {
        window.location = '../pages/userLogin.html';
        return false;
    } else if (viewEventId === null) {
        window.location = '../pages/userPage.html';
        return true;
    }
    else {
        return true;
    }
}

const removeUpdate = () => {
    localStorage.removeItem("update");
    localStorage.removeItem("viewEvent");
    return true;
}

// edit event button
function editEvent() {
    localStorage.removeItem("viewEvent");
    localStorage.setItem("update", eventId);
    window.location = '../pages/createEvent.html';
}

//delete event
const deleteEvent = () => {
    if (confirm("Are you sure to want to Delete Event?") == true) {
        let currentUser = usersLst.find(e => e.userId === currentUserObj.userId);
        let tempEventsLst = currentUser.events;
        let eventsLst = tempEventsLst.filter(e => e !== eventId);
        delete currentUser.events;
        currentUser.events = eventsLst;
        localStorage.setItem("users", JSON.stringify(usersLst));
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        tempEventLst = tempEventLst.filter(e => e.eventId !== eventId);
        localStorage.setItem("events", JSON.stringify(tempEventLst));
        localStorage.removeItem("viewEvent");
        window.location = '../pages/userPage.html';
    }
};

function deleteBookedSlot(id) {
    if (confirm("Are you sure to want to Delete This ?") == true) {
        let currentUser = bookedSlots.filter(e => e.slotId !== id);
        localStorage.setItem("bookedSlots", JSON.stringify(currentUser));
        location.reload();
    }
}