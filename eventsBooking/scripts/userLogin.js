const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateInputs()) {
    //setting current user for logged in page
    var currentUser = findUser(email.value);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    document.getElementById("completed").innerHTML=`<center style="margin:auto">
                                              <img src="/assert/login.png" height="100px" width="100px"><br>
                                              <h2>You've Successfully Logged In.</h2>
                                              </center>`;
    const myTimeout = setTimeout(pageReload, 2000);
  }
});

//seting time to reload page
function pageReload() {
  window.location = "../pages/userPage.html";
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

//checking the mail and password is right or wrong
const isRightUser = (email) => {
  var checkUserExist = findUser(email);
  if (checkUserExist === undefined) {
    return 3;
  } else if (checkUserExist.password !== password.value) {
    return 2;
  }
  return 1;
};

//validating Inputs
const validateInputs = () => {
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  let result = true;

  if (isRightUser(emailValue) == 3) {
    result = false;
    setError(email, "Email is not exists");
    setError(password, "Verify Email first");
  } else if (isRightUser(emailValue) == 2) {
    result = false;
    setSuccess(email);
    setError(password, "Password doesn't match");
  } else {
    setSuccess(email);
    setSuccess(password);
  }
  return result;
};

//finding current user
const findUser = (email) => {
  let tempUser = localStorage.getItem("users");
  if (tempUser === null) {
    return undefined;
  }
  let tempUserLst = JSON.parse(tempUser);
  let foundUser = tempUserLst.find((e) => e.email === email);
  return foundUser;
};
