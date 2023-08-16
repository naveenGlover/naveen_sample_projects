const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateInputs()) {

        //storing data in variables
        var unameVal = username.value.trim();
        var userId = randomIdGenerate();
        var emailVal = email.value.trim();
        var pwdVal = password.value.trim();

        //creating user object
        var currentUser = {
            userName: unameVal,
            userId: userId,
            email: emailVal,
            password: pwdVal,
            events: [],
        }

        //retrive details from local storage
        var tempuser = localStorage.getItem("users");
        if (tempuser === null) {
            tempuser = '[]';
        }
        var userlst = JSON.parse(tempuser);
        userlst.push(currentUser);
        localStorage.setItem("users", JSON.stringify(userlst));

        //setting the registered user as current user
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        //registration complete message
        document.getElementById("completed").innerHTML = `<center style="margin:auto">
                                              <img src="/assert/login.png" height="100px" width="100px"><br>
                                              <h2>You've Successfully Registered.</h2>
                                              </center>`;
        const myTimeout = setTimeout(pageReload, 2000);
    }
});

//seting time to reload page
function pageReload() {
    window.location = '/pages/userPage.html';
}

//checking the mail is already exist or not
const isRepeatEmail = email => {
    var tempuser = localStorage.getItem("users");
    if (tempuser === null) {
        return true;
    }
    var userlst = JSON.parse(tempuser);
    var checkUserExist = userlst.find(e => e.email === email)
    if (checkUserExist === undefined) {
        return true;
    }
    return false;
}

//validating inputs

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();
    let result = true;

    if (usernameValue === '') {
        result = false;
        setError(username, 'Username is required');
    } else {
        setSuccess(username);
    }

    if (emailValue === '') {
        result = false;
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        result = false;
        setError(email, 'Provide a valid email address');
    } else if (!isRepeatEmail(emailValue)) {
        result = false;
        setError(email, 'Email already exist');
    } else {
        setSuccess(email);
    }

    if (passwordValue === '') {
        result = false;
        setError(password, 'Password is required');
    } else if (passwordValue.length < 8) {
        result = false;
        setError(password, 'Password must be at least 8 character.')
    } else {
        setSuccess(password);
    }

    if (password2Value === '') {
        result = false;
        setError(password2, 'Please confirm your password');
    } else if (password2Value !== passwordValue) {
        result = false;
        setError(password2, "Passwords doesn't match");
    } else {
        setSuccess(password2);
    }
    return result;
};
