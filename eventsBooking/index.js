// checking the user is already logged in or not
const login = () => {
    let loggedAlready = localStorage.getItem("currentUser");
    if (loggedAlready !== null) {
        window.location = '../pages/userPage.html';
    } else {
        window.location = '../pages/userLogin.html';
    }
}

//setting iput box as error field
const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error");
    errorDisplay.innerText = message;
    inputControl.classList.add("error");
    inputControl.classList.remove("success");
};

//setting iput box as success field
const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error");
    errorDisplay.innerText = "";
    inputControl.classList.add("success");
    inputControl.classList.remove("error");
};

//removing current user to logout
function delCurrentUser() {
    if (confirm("Are you sure want to Logout..?")) {
        localStorage.removeItem("currentUser");
        window.location = '../index.html';
        return true;
    }
    return false;
}

//checking the user is logged in or not
function pageOnload() {
    if (currentUser === null) {
        window.location = '../pages/userLogin.html';
        return false;
    }
    else {
        return true;
    }
}

//generating unque id
var randomIdGenerate = () => {
    let random = Math.random().toString(16).slice(2);
    return random;
}

//chechking it's valid mail or not
const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}