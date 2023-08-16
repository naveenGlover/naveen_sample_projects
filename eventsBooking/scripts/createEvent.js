//getting current user details
const currentUser = localStorage.getItem("currentUser");
var currentUserDetail = JSON.parse(currentUser);

// removing old keys
function removeKeys() {
    localStorage.removeItem("update");
    localStorage.removeItem("viewEvent")
}

let form = document.getElementById('form');
let eventName = document.getElementById('eventName');
let noOfDays = document.getElementById('days');
let duration = document.getElementById('duration');
let format = document.getElementById('format');
let checkboxes = document.querySelectorAll('input[name="week-day"]:checked');
let eventDesc = document.getElementById('eventDesc');

//checking it's an update form or create form
let tempcurrentEventId = localStorage.getItem("update");
let tempEvent = localStorage.getItem("events");
if (tempcurrentEventId !== null) {

    let createBtn = document.getElementById("createEventBtn");
    createBtn.innerText = "Update Event";
    let allEvents = JSON.parse(tempEvent);
    let currentEvent = allEvents.find(e => e.eventId == tempcurrentEventId);
    eventName.setAttribute("value", currentEvent.eventName);
    noOfDays.setAttribute("value", currentEvent.noOfDays);
    format.value = currentEvent.format;
    if (currentEvent.format == "hrs") {
        currentEvent.duration = currentEvent.duration / 60;
    }
    duration.setAttribute("value", currentEvent.duration);
    let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    let weekDaysObj = currentEvent.workingDays;
    let weekDays = Object.keys(currentEvent.workingDays);
    for (let i = 0; i < weekDays.length; i++) {
        let day = weekDays[i];
        let tempDay = document.getElementById(weekDays[i]);
        tempDay.checked = true;
        timeShowing(weekDays[i]);
        let startId = weekDays[i] + 'Start';
        let endId = weekDays[i] + 'End';
        let weekDayStart = document.getElementById(startId);
        let weekDayEnd = document.getElementById(endId);
        weekDayStart.value = weekDaysObj[day].startTime;
        weekDayEnd.value = weekDaysObj[day].endTime;
    }
    eventDesc.value = currentEvent.eventDesc;
    for (let i = 0; i < 7; i++) {
        if (!(weekDays.includes(days[i]))) {
            document.getElementById(days[i]).checked = false;
            document.getElementById(days[i]).style.color = "#757575";
            timeShowing(days[i]);
        }
    }
}

form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateInputs()) {
        //storing data in variables
        let eventNameVal = eventName.value.trim();
        let eventIdVal = randomIdGenerate();
        if (tempcurrentEventId !== null) {
            eventIdVal = tempcurrentEventId;
        }

        //gettig user id to match the event with the user
        let userId = currentUserDetail.userId;
        let daysVal = noOfDays.value;
        let durationVal = duration.value;
        let formatVal = format.value;
        let eventDescval = eventDesc.value.trim();
        if (formatVal === 'hrs') {
            durationVal = durationVal * 60;
        }

        //working days values
        let weekDays = [];
        let weekDaysTimes = [];
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked == true) {
                weekDays.push(checkbox.value);
                let startId = checkbox.value + 'Start';
                let endId = checkbox.value + 'End';
                let temp = {};
                temp['startTime'] = document.getElementById(startId).value;
                temp['endTime'] = document.getElementById(endId).value;
                weekDaysTimes.push(temp);
            }
        });
        let workingDaysval = {};
        for (let i = 0; i < weekDays.length; i++) {
            workingDaysval[weekDays[i]] = weekDaysTimes[i];
        }

        //creating event object
        let events = {
            eventName: eventNameVal,
            eventId: eventIdVal,
            userId: userId,
            noOfDays: daysVal,
            duration: durationVal,
            format: formatVal,
            workingDays: workingDaysval,
            eventDesc: eventDescval,
        };

        // storing created event details into user's memory
        if (tempcurrentEventId === null) {
            let users = JSON.parse(localStorage.getItem("users"));
            let currentUser = users.find(e => e.userId === currentUserDetail.userId);
            let eventList = currentUser.events;
            eventList.push(eventIdVal);
            delete currentUser.events;
            currentUser.events = eventList;
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }

        //getting local storage values of events
        if (tempEvent === null) {
            tempEvent = '[]';
        }
        let tempEventLst = JSON.parse(tempEvent);

        if (tempcurrentEventId !== null) {
            tempEventLst = tempEventLst.filter(item => item.eventId !== tempcurrentEventId);
        }
        tempEventLst.push(events);
        localStorage.setItem("events", JSON.stringify(tempEventLst));

        //registration complete message
        if (tempcurrentEventId !== null) {
            localStorage.removeItem("update");
            localStorage.removeItem("viewEvent");
            document.getElementById("completed").innerHTML = `<center style="margin:auto">
                                              <img src="/assert/booked.png" height="100px" width="100px"><br>
                                              <h2>You've Successfully Updated.</h2>
                                              </center>`;
        } else {
            document.getElementById("completed").innerHTML = `<center style="margin:auto">
                                              <img src="/assert/booked.png" height="100px" width="100px"><br>
                                              <h2>You've Successfully Created.</h2>
                                              </center>`;
        }
        const myTimeout = setTimeout(pageReload, 1500);
    }
});

//seting time to reload page
function pageReload() {
    window.location = '/pages/userPage.html';
}

//finding slot timing is proper or not
function slotEndTiming(dt1, dt2) {
    let d1Hrs = Number(dt1.slice(0, 2));
    let d1Minutes = Number(dt1.slice(3, 5));
    let d2Hrs = Number(dt2.slice(0, 2));
    let d2Minutes = Number(dt2.slice(3, 5));
    if (d1Hrs > d2Hrs) {
        return false;
    }
    else if (d1Hrs === d2Hrs) {
        if (d1Minutes >= d2Minutes) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}

//day time showing
function timeShowing(id) {
    var checkBox = document.getElementById(id);
    let timeId = id + 'Time';
    var text = document.getElementById(timeId);
    timeId = id + 'Start';
    var startTime = document.getElementById(timeId);
    timeId = id + 'End';
    var endTime = document.getElementById(timeId);
    if (checkBox.checked == true) {
        text.style.display = "";
        checkBox.parentElement.style.color = "black";
        text.style.color = 'black';
        startTime.disabled = false;
        endTime.disabled = false;
        startTime.style.color = 'black';
        endTime.style.color = 'black';
    } else {
        text.style.color = '#BDBDBD';
        startTime.disabled = true;
        endTime.disabled = true;
        startTime.style.color = '#BDBDBD';
        endTime.style.color = '#BDBDBD';
        checkBox.parentElement.style.color = "rgb(137, 137, 137)";
    }
}

//validating inputs
const validateInputs = () => {
    let eventNameValue = eventName.value.trim();
    let daysValue = Number(noOfDays.value);
    let durationValue = Number(duration.value);
    let formatValue = format.value;
    let checkboxes = document.querySelectorAll('input[name="week-day"]:checked');
    let weekDays = [];
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked == true) {
            weekDays.push(checkbox.value);
        }
    });
    let eventDescValue = eventDesc.value.trim();

    let result = true;
    //event name validate
    if (eventNameValue === '') {
        result = false;
        setError(eventName, 'Event Name is required');
    } else {
        setSuccess(eventName);
    }
    if (daysValue <= 0) {
        result = false;
        setError(noOfDays, 'Date is invalid. Provide Upcomming dates');
    } else {
        setSuccess(noOfDays);
    }
    // }
    //duration validate
    if (durationValue <= 0) {
        result = false;
        document.getElementById('duration').style.borderColor = '#ff3860';
        let error = document.getElementById('error');
        error.innerHTML = '<p style="color:#ff3860">Please Enter Valid Duration Time</p>';
    } else if ((formatValue === 'hrs' && durationValue > 20)) {
        result = false;
        document.getElementById('duration').style.borderColor = '#ff3860';
        let error = document.getElementById('error');
        error.innerHTML = '<p style="color:#ff3860">Duration Time is exceeds more than slot timing</p>';
    } else {
        document.getElementById('duration').style.borderColor = '#09c372';
        let error = document.getElementById('error');
        error.innerHTML = '<p style="color:#ff3860"></p>';
    }
    //coverting duration to minutes
    if (formatValue === 'hrs') {
        durationValue = durationValue * 60;
    }
    //week days validate
    if (weekDays.length <= 0) {
        result = false;
        let error = document.getElementById("weekDaysError");
        error.innerText = "You should select atleast one day...!";
        error.style.color = "red";
        error.style.fontSize = "12px";
    } else {
        let error = document.getElementById("weekDaysError");
        error.innerText = "";
    }
    //week Times validate
    for (let i = 0; i < weekDays.length; i++) {
        let startId = weekDays[i] + 'Start';
        let endId = weekDays[i] + 'End';
        let startTime = document.getElementById(startId).value;
        let endTime = document.getElementById(endId).value;
        let d1Hrs = Number(startTime.slice(0, 2));
        let d1Minutes = Number(startTime.slice(3, 5)) + Number(durationValue);
        if (d1Minutes >= 60) {
            d1Hrs += Math.floor(d1Minutes / 60);
            d1Minutes = d1Minutes % 60;
        }
        let slotEndTime = d1Hrs + ':' + d1Minutes;
        let errorId = weekDays[i] + 'error';
        if (startTime === "") {
            result = false;
            let errorId = weekDays[i] + 'error';
            let error = document.getElementById(errorId);
            error.innerText = "Enter Start time Please!";
            error.style.color = 'red';
            error.style.fontSize = '12px';
        } else {
            let error = document.getElementById(errorId);
            error.innerText = "";
        }
        if (endTime === "") {
            result = false;
            let error = document.getElementById(errorId);
            if (startTime !== "") {
                error.innerText = "Enter Ending time Please!";
            }
            error.style.color = 'red';
            error.style.fontSize = '12px';
        } else if (!slotEndTiming(startTime, endTime)) {
            result = false;
            let error = document.getElementById(errorId);
            if (startTime !== "") {
                error.innerText = "Enter a Valid Ending time Please!";
            }
            error.style.color = 'red';
            error.style.fontSize = '12px';
        } else if (!slotEndTiming(slotEndTime, endTime)) {
            result = false;
            let error = document.getElementById(errorId);
            if (startTime !== "") {
                error.innerText = "Ending time not Sufficient!";
            }
            error.style.color = 'red';
            error.style.fontSize = '12px';
        } else {
            let error = document.getElementById(errorId);
            error.innerText = "";
        }
    }
    // result=false;
    return result;
};