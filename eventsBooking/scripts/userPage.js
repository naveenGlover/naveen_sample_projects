//getting current user details
const currentUser = localStorage.getItem("currentUser");
var currentUserObj = JSON.parse(currentUser);

//getting users details
const tempUsers = localStorage.getItem("users");
var usersLst = JSON.parse(tempUsers);

//setting user name in dashboard
var username = document.getElementById("username");
username.innerText = currentUserObj.userName;

//getting events of the current user
var tempEvent = localStorage.getItem("events");
if (tempEvent === null) {
    tempEvent = '[]';
}
var tempEventLst = JSON.parse(tempEvent);
const currentUserEvents = tempEventLst.filter((element) => element.userId === currentUserObj.userId);

//checking staus of the event
function eventStatus(date, noOfDays) {
    let tempdate = new Date(date);
    tempdate.setHours(0);
    tempdate.setMinutes(0);
    tempdate.setDate(tempdate.getDate() + Number(noOfDays) - 1);
    let endDate = tempdate;
    date = new Date(date);
    date.setHours(0);
    date.setMinutes(0);
    let today = new Date();
    if (today.getTime() > endDate.getTime()) {
        return "Expired";
    } else {
        return "Active";
    }
}

// getting Slot counts
function slotCounts(id) {
    let bookedEvents = JSON.parse(localStorage.getItem("bookedSlots") || '[]');
    let currentEvents = bookedEvents.filter(e => e.eventId === id);
    return currentEvents.length;
}

//view details of the event
function viewEventDetails(id) {
    localStorage.setItem("viewEvent", id);
    window.location = '../pages/viewEventDetail.html';
}

//getting user's event details
let tempEvents = currentUserObj.events;
if (tempEvents.length === 0) {
    let appointmentslst = document.getElementById("appointment");
    appointmentslst.innerHTML = `<div class="noEvents"><span><center>
    <img src="/assert/noEvent.png" width=330px height=250px>
    <h3>There was no Events Created.</h3><br>
    <a id="createBtn-body" href="/pages/createEvent.html" onclick="return removeUpdate()">Create Event</a>
    </center>
    </span>
    </div>`;
}
else {
    var app = document.getElementById('appointment');
    app.innerHTML = '<table><b><tr><th>Event Name</th><th>Booked Slots</th><th></th><th></th></tr></b>' + currentUserEvents.map((wizard) => {
        return `<tr><td><a class="btn btn-link" id="${wizard.eventId}" onclick="viewEventDetails(this.id)">${wizard.eventName}</a></td><td>${slotCounts(wizard.eventId)}</td><td><a class="btn" id="${wizard.eventId}" onclick="editEvent(this.id)"><i class="fa-solid fa-pen-to-square"></i></a></td><td><a class="deleteButton" id="${wizard.eventId}" onclick="deleteEvent(this.id)"><i class="fa-solid fa-trash"></i></a></td></tr>`;
    }).join(" ") + '</table>';
}

//edit
function editEvent(currentEventId) {
    localStorage.setItem("update", currentEventId);
    window.location = '../pages/createEvent.html';
}

//delete event
const deleteEvent = (currentEventId) => {
    if (confirm("Are you sure to want to Delete Event?") == true) {
        let currentUser = usersLst.find(e => e.userId === currentUserObj.userId);
        let tempEventsLst = currentUser.events;
        let eventsLst = tempEventsLst.filter(e => e !== currentEventId);
        delete currentUser.events;
        currentUser.events = eventsLst;
        localStorage.setItem("users", JSON.stringify(usersLst));
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        tempEventLst = tempEventLst.filter(e => e.eventId !== currentEventId);
        localStorage.setItem("events", JSON.stringify(tempEventLst));
        location.reload();
    }
};

let deleteEventId = localStorage.getItem("delete");
let updateEventId = localStorage.getItem("update");
if (deleteEventId !== null && updateEventId === null) {
    deleteEvent(deleteEventId);
    localStorage.removeItem("delete");
}

//removing update Key
function removeUpdate() {
    localStorage.removeItem("update");
    localStorage.removeItem("delete");
    return true;
}
