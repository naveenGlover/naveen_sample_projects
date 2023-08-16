// getting the choosen event details
let currentEventId = localStorage.getItem("register");
let tempEvent = localStorage.getItem("events");
let tempEventLst = JSON.parse(tempEvent);
let currentEvent = tempEventLst.find((e) => e.eventId === currentEventId);
let eventDates = [];
var previousBlockedSlot = [];
const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
let workingDays = Object.keys(currentEvent.workingDays);
let today = new Date();
let noOfDays = Number(currentEvent.noOfDays);
today.setDate(today.getDate() + noOfDays - 1);
let endDate = today;
for (let i = 0; i < noOfDays; i++) {
  today = new Date();
  today.setDate(today.getDate() + i);
  if (workingDays.includes(days[today.getDay()]) && today.getTime() >= today.getTime()) {
    eventDates.push(today.toDateString());
  }
}
if (eventDates.length != 0) {
  today = new Date(eventDates[0]);
}
else {
  today = new Date();
}

// seting time to reload page
function pageReload() {
  window.location = "../index.html";
}


//for generation of slots
let dateKeyValue = today;
let dateKeyId = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
let slotValue;

function pageOnloadRegister() {
  let tempcurrentEventId = localStorage.getItem("register");
  if (tempcurrentEventId === null) {
    window.location = '../pages/eventBookingPage.html';
    return false;
  }
  else {
    return true;
  }
}


// calender details
let calendar = document.querySelector('.calendar');

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0)
}

getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28
}

generateCalendar = (month, year) => {

  let calendar_days = calendar.querySelector('.calendar-days');
  let calendar_header_year = calendar.querySelector('#year');

  let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  calendar_days.innerHTML = '';

  let currDate = new Date();
  if (month > 11 || month < 0) month = currDate.getMonth();
  if (!year) year = currDate.getFullYear();

  let curr_month = `${month_names[month]}`;
  month_picker.innerHTML = curr_month;
  calendar_header_year.innerHTML = year;

  // get first day of month

  let first_day = new Date(year, month, 1);

  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
    let day = document.createElement('div');
    if (i >= first_day.getDay()) {
      day.innerText = i - first_day.getDay() + 1;
      let dateId = year + '-' + (month + 1) + '-' + (i - first_day.getDay() + 1);
      let tempDateString = new Date(first_day.getFullYear(), first_day.getMonth(), i - first_day.getDay() + 1).toDateString();
      let tempDate = new Date(first_day.getFullYear(), first_day.getMonth(), i - first_day.getDay() + 1);
      if (eventDates.includes(tempDateString) && workingDays.includes(days[tempDate.getDay()])) {
        day.classList.add('calendar-day-event');
        day.setAttribute('id', `${dateId}`);
        day.setAttribute('value', `${dateId}`);
        day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`;
      }
      if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
        day.classList.add('curr-date');
      }
    }
    calendar_days.appendChild(day);
  }
}

let month_picker = calendar.querySelector('#month-picker');

let currDate = new Date(today);

let curr_month = { value: currDate.getMonth() }
let curr_year = { value: currDate.getFullYear() }

generateCalendar(curr_month.value, curr_year.value);

document.querySelector('#prev-year').onclick = () => {
  --curr_month.value;
  if (curr_month.value == -1) {
    curr_month.value = 11;
    curr_year.value -= 1;
  }
  let days_of_month = [31, getFebDays(curr_year.value), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let monthBlock = new Date(curr_year.value, curr_month.value, days_of_month[curr_month.value]);
  if (monthBlock.getTime() >= today.getTime() || monthBlock.getTime() >= endDate.getTime()) {
    generateCalendar(curr_month.value, curr_year.value);
    selectedDateColor();
  } else {
    ++curr_month.value;
    if (curr_month.value == 12) {
      curr_month.value = 0;
      curr_year.value += 1;
    }
  }
}

document.querySelector('#next-year').onclick = () => {
  ++curr_month.value;
  if (curr_month.value == 12) {
    curr_month.value = 0;
    curr_year.value += 1;
  }
  let monthBlock = new Date(curr_year.value, curr_month.value, 1);
  if (monthBlock.getTime() <= today.getTime() || monthBlock.getTime() <= endDate.getTime()) {
    generateCalendar(curr_month.value, curr_year.value);
    selectedDateColor();
  } else {
    --curr_month.value;
    if (curr_month.value == -1) {
      curr_month.value = 11;
      curr_year.value -= 1;
    }
  }
}

selectedDateColor();
function selectedDateColor() {
  let bookedSlots = JSON.parse(localStorage.getItem("bookedSlots"));
  previousBlockedSlot = [];
  if (bookedSlots !== null) {
    previousBlockedSlot = bookedSlots.filter(e => e.eventId == currentEventId && e.slot.date === new Date(dateKeyValue).toDateString());
  }
  if (document.getElementById(dateKeyId) !== null) {
    document.getElementById(dateKeyId).style.color = "white";
    document.getElementById(dateKeyId).style.backgroundColor = "blue";
  }
}
document.body.addEventListener('click', doCheck);
function doCheck({ target }) {
  if (target.classList.contains("calendar-day-event")) {
    previousDate = document.getElementById(dateKeyId);
    previousDate.style.color = "black";
    previousDate.style.backgroundColor = "#F5F5F5";
    target.style.color = "white";
    target.style.backgroundColor = "blue";
    dateKeyValue = new Date(target.getAttribute("value"));
    dateKeyId = target.getAttribute("id");
    let bookedSlots = JSON.parse(localStorage.getItem("bookedSlots"));
    previousBlockedSlot = [];
    if (bookedSlots !== null) {
      previousBlockedSlot = bookedSlots.filter(e => e.eventId == currentEventId && e.slot.date === new Date(dateKeyValue).toDateString());
    }
    generationOfSlots();
  } else if (target.classList.contains("slotTime")) {
    slotValue = target.getAttribute("value");
    document.getElementById("eventSlotPage").style.display = "block";
  }
}

// adding duration with start time
function slotTiming(start, end, duration) {
  let startHrs = Number(start.slice(0, 2));
  let startMin = Number(start.slice(3, 5)) + duration;
  if (startMin >= 60) {
    startHrs += Math.floor(startMin / 60);
    startMin = startMin % 60;
  }
  let endHrs = Number(end.slice(0, 2));
  let endMin = Number(end.slice(3, 5));

  if (startHrs > endHrs) {
    return start;
  } else if (startHrs === endHrs) {
    if (startMin > endMin) {
      return start;
    } else {
      if (startHrs <= 9) {
        startHrs = '0' + startHrs;
      }
      if (startMin <= 9) {
        startMin = '0' + startMin;
      }
      let res = startHrs + ':' + startMin;
      return res;
    }
  } else {
    if (startHrs <= 9) {
      startHrs = '0' + startHrs;
    }
    if (startMin <= 9) {
      startMin = '0' + startMin;
    }
    let res = startHrs + ':' + startMin;
    return res;
  }
}

// ckecking Slot Fits or not
function checkSlotFits(start, end, slotStart, slotEnd) {
  let startHrs = Number(start.slice(0, 2));
  let startMin = Number(start.slice(3, 5));
  let endHrs = Number(end.slice(0, 2));
  let endMin = Number(end.slice(3, 5));
  let slotStartHrs = Number(slotStart.slice(0, 2));
  let slotStartMin = Number(slotStart.slice(3, 5));
  let slotEndHrs = Number(slotEnd.slice(0, 2));
  let slotEndMin = Number(slotEnd.slice(3, 5));
  let startDay = new Date();
  startDay.setHours(startHrs);
  startDay.setMinutes(startMin);
  let endDay = new Date();
  endDay.setHours(endHrs);
  endDay.setMinutes(endMin);
  let slotStartDay = new Date();
  slotStartDay.setHours(slotStartHrs);
  slotStartDay.setMinutes(slotStartMin);
  let slotEndDay = new Date();
  slotEndDay.setHours(slotEndHrs);
  slotEndDay.setMinutes(slotEndMin);
  if (slotStartDay.getTime() < startDay.getTime() && slotEndDay.getTime() <= startDay.getTime()) {
    return true;
  } else if (slotStartDay.getTime() >= endDay.getTime() && slotEndDay.getTime() > endDay.getTime()) {
    return true;
  } else {
    return false;
  }
}

// check today slot time is over or not
function checkTodaySlotTime(time) {
  let checkSlotTime = new Date();
  checkSlotTime.setHours(time.slice(0, 2), time.slice(3, 5), 0);
  let todayTime = new Date();
  if (checkSlotTime.getTime() < todayTime.getTime()) {
    return false;
  }
  return true;
}

let tempBookedSlots = localStorage.getItem("bookedSlots");


generationOfSlots();
//generation of slots
function generationOfSlots() {
  if (eventDates.length != 0) {
    let tempAllEvents = localStorage.getItem('events');
    let allEvents = JSON.parse(tempAllEvents);
    let selectedEventId = localStorage.getItem('register');
    // getting previous slots
    let selectedDate = dateKeyValue;
    let todayDate = new Date();
    let checkTodaySlotKey = false;
    if (todayDate.toDateString() == selectedDate.toDateString()) {
      checkTodaySlotKey = true;
    }
    let selectedDay = days[selectedDate.getDay()];
    let currentEvent;
    let currentBookedEvents = [];
    let previousBookedSlotBlock = [];
    if (tempBookedSlots != null) {
      let tempSlots = JSON.parse(tempBookedSlots);
      currentBookedEvents = tempSlots.filter(e => e.eventId == selectedEventId && e.slot.date === selectedDate.toDateString());
    }
    currentEvent = allEvents.find(e => e.eventId == selectedEventId);
    let workingDays = Object.keys(currentEvent.workingDays);
    let workingDayTimes = Object.values(currentEvent.workingDays);
    // To get Start Time and End Time of the particular Day this [i] value used in line 330 
    let i = 0;
    for (i = 0; i < workingDays.length; i++) {
      if (selectedDay === workingDays[i]) {
        break;
      }
    }
    function chechSlotExist(id) {
      if (currentBookedEvents.includes(id)) {
        id = "slotTimeBlocked";
        return id;
      }
      if (previousBookedSlotBlock.includes(id)) {
        id = "slotTimeBlocked";
        return id;
      }
      id = "slotTime";
      return id;
    }
    let startTime = workingDayTimes[i].startTime;
    let endTime = workingDayTimes[i].endTime;
    let slotDuration = Number(currentEvent.duration);
    let slots = [];
    for (i = 0; i >= 0; i++) {
      let slotEnd = slotTiming(startTime, endTime, slotDuration);
      if (slotEnd == startTime) {
        break;
      }
      let time = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
      let AmPm = [' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' AM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM', ' PM']
      let startHrs = Number(startTime.slice(0, 2));
      let startMin = Number(startTime.slice(3, 5));
      let slotEndHrs = Number(slotEnd.slice(0, 2));
      let slotEndMin = Number(slotEnd.slice(3, 5));
      if (startMin <= 9) {
        startMin = '0' + startMin;
      }
      if (slotEndMin <= 9) {
        slotEndMin = '0' + slotEndMin;
      }
      let slot = (time[startHrs] + ':' + startMin + AmPm[startHrs] + ' - ' + time[slotEndHrs] + ':' + slotEndMin + AmPm[slotEndHrs]);
      for (let i = 0; i < previousBlockedSlot.length; i++) {
        let tempSlot = previousBlockedSlot[i].slot.time;
        let tempStart = tempSlot.slice(0, 8);
        let tempEnd = tempSlot.slice(11,);
        if (tempStart.slice(6,) == 'PM') {
          if (tempStart.slice(0, 2) != '12') {
            tempStart = (Number(tempStart.slice(0, 2)) + 12) + ':' + tempStart.slice(3, 5);
          } else {
            tempStart = tempStart.slice(0, 5);
          }
        } else if (tempStart.slice(6,) == 'AM') {
          if (tempStart.slice(0, 2) != '12') {
            tempStart = tempStart.slice(0, 5);
          } else {
            tempStart = '00' + tempStart.slice(3, 5);
          }
        }
        if (tempEnd.slice(6,) == 'PM') {
          if (tempEnd.slice(0, 2) != '12') {
            tempEnd = (Number(tempEnd.slice(0, 2)) + 12) + ':' + tempEnd.slice(3, 5);
          } else {
            tempEnd = tempEnd.slice(0, 5);
          }
        } else if (tempEnd.slice(6,) == 'AM') {
          if (tempEnd.slice(0, 2) != '12') {
            tempEnd = tempEnd.slice(0, 5);
          } else {
            tempEnd = '00' + tempEnd.slice(3, 5);
          }
        }
        if (!checkSlotFits(startTime, slotEnd, tempStart, tempEnd)) {
          previousBookedSlotBlock.push(slot);
        }

      }
      if (checkTodaySlotKey) {
        if (!checkTodaySlotTime(startTime)) {
          previousBookedSlotBlock.push(slot);
        }
      }
      startTime = slotEnd;
      slots.push(slot);
    }
    let slotDisplay = document.getElementById("eventSlotsBlock");
    slotDisplay.innerHTML = slots.map((wizard) => {
      return `<input type="radio" name="eventSlot" id="${wizard}" class="${chechSlotExist(wizard)}" value="${wizard}"/>
            <label class="radioLabel ${chechSlotExist(wizard)}" for="${wizard}"  value="${wizard}">${wizard}</label>`;
    }).join(" ");
    let blockSlot = document.querySelectorAll(".slotTimeBlocked");
    let count = 0;
    blockSlot.forEach(slot => {
      count += 1;
      let tempBlock = slot.getAttribute("id");
      if (tempBlock != null) {
        document.getElementById(tempBlock).disabled = true;
      }
    });
    let allSlots = document.querySelectorAll(".slotTime");
    let totalSlotsCount = allSlots.length;
    if (totalSlotsCount == 0) {
      document.getElementById("eventSlotsBlock").innerText = `Sorry there was no slots available for this day.`;
    }
  }
}



if (eventDates.length == 0) {
  document.getElementById("eventSlotsBlock").innerText = `Sorry there was no dates available now.`;
}

//form phase
const prevBtns = document.querySelectorAll(".btn-prev");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
const eventSlotPage = document.getElementById("eventSlotPage");
const registerUserPage = document.getElementById("registerUserPage");

let formStepsNum = 0;

eventSlotPage.addEventListener("click", () => {
  document.getElementById("calendar-phase").style.display = "none";
  document.getElementById("main-phase").style.justifyContent = "center";
  formStepsNum++;
  updateFormSteps();
  updateProgressbar();
});
registerUserPage.addEventListener("click", () => {
  if (userDetailsValid()) {
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
    confirmation();
  }
});

backToEvnets.addEventListener("click", () => {
  document.getElementById("calendar-phase").style.display = "block";
  document.getElementById("main-phase").style.justifyContent = "baseline";
  formStepsNum--;
  updateFormSteps();
  updateProgressbar();
});
prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum--;
    updateFormSteps();
    updateProgressbar();
  });
});

function updateFormSteps() {
  formSteps.forEach((formStep) => {
    formStep.classList.contains("form-step-active") &&
      formStep.classList.remove("form-step-active");
  });

  formSteps[formStepsNum].classList.add("form-step-active");
}

function updateProgressbar() {
  progressSteps.forEach((progressStep, idx) => {
    if (idx < formStepsNum + 1) {
      progressStep.classList.add("progress-step-active");
    } else {
      progressStep.classList.remove("progress-step-active");
    }
  });

  const progressActive = document.querySelectorAll(".progress-step-active");

  progress.style.width = ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}


//validation part
let form = document.getElementById('form');
let userName = document.getElementById('userName');
let mobileNo = document.getElementById('mobileno');
let email = document.getElementById('email');

form.addEventListener('submit', e => {
  e.preventDefault();
  if (document.getElementById("verify").checked) {
    let eventDateValue = dateKeyValue.toDateString();
    let eventIdValue = currentEvent.eventId;
    let userNameValue = userName.value;
    let mobileNoValue = mobileNo.value;
    let emailValue = email.value;
    let slotId = randomIdGenerate();
    let tempuserDetail = {
      slotId: slotId,
      eventId: eventIdValue,
      userDetail: {
        userName: userNameValue,
        mobileNo: mobileNoValue,
        email: emailValue,
      },
      slot: {
        time: slotValue,
        date: eventDateValue,
      },
    }
    if (tempBookedSlots == null) {
      tempBookedSlots = '[]';
    }
    let bookedSlots = JSON.parse(tempBookedSlots);
    bookedSlots.push(tempuserDetail);
    localStorage.setItem("bookedSlots", JSON.stringify(bookedSlots));
    localStorage.removeItem("register");
    document.getElementById("completed").innerHTML = `<center style="margin:auto">
                                              <img src="/assert/booked.png" height="100px" width="100px"><br>
                                              <h2>You've Successfully Booked Your Slot.</h2>
                                              </center>`;
    const myTimeout = setTimeout(pageReload, 2000);
  } else {
    document.getElementById("error").innerText = "Confirm to continue..!";
  }
});

//user details Validate
function userDetailsValid() {
  let result = true;
  let userNameVal = userName.value;
  let mobileNoVal = mobileNo.value;
  let emailVal = email.value;
  if (userNameVal === '') {
    result = false;
    setError(userName, 'Event Name is required');
  } else {
    setSuccess(userName);
  }
  if (mobileNoVal === '') {
    result = false;
    setError(mobileNo, 'Mobile No is required');
  } else if (mobileNoVal.length < 10 || mobileNoVal.length > 10) {
    result = false;
    setError(mobileNo, 'Enter a Valid Mobile No')
  } else {
    setSuccess(mobileNo);
  }
  if (emailVal === '') {
    result = false;
    setError(email, 'Email is required');
  } else if (!isValidEmail(emailVal)) {
    result = false;
    setError(email, 'Provide a valid email address');
  } else {
    setSuccess(email);
  }
  return result;
}
//generating the details that are collected
function confirmation() {
  let tempUser = localStorage.getItem("users");
  let userLst = JSON.parse(tempUser);
  let currentUser = userLst.find(e => e.userId === currentEvent.userId);
  let organizer = currentUser.userName;
  let verify = document.getElementById("verifyDetails");
  verify.innerHTML = `
  <h3 class="verifyDetails">Slot Details:</h3>
  <div class="event-details">
    <div class="event-key">Event:</div>
    <div class="event-value">${currentEvent.eventName}</div>
  </div>
  <div class="event-details">
    <div class="event-key">Event Date:</div>
    <div class="event-value">${dateKeyValue.toDateString()}</div>
  </div>
  <div class="event-details">
    <div class="event-key">Your Slot:</div>
    <div class="event-value">${slotValue}</div>
  </div>
  <div class="event-details">
    <div class="event-key">Organizer:</div>
    <div class="event-value">${organizer}</div>
  </div><br>
<h3 class="verifyDetails">Your Details:</h3>
  <div class="event-details">
    <div class="event-key">Name:</div>
    <div class="event-value">${userName.value}</div>
  </div>
  <div class="event-details">
    <div class="event-key">Event Date:</div>
    <div class="event-value">${mobileNo.value}</div>
  </div>
  <div class="event-details">
    <div class="event-key">Your Slot:</div>
    <div class="event-value">${email.value}</div>
  </div>
`;
}