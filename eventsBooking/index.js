const login=()=>{
    let loggedAlready=localStorage.getItem("currentUser");
    if(loggedAlready!==null){
        window.location='../pages/userPage.html';
    } else{
        window.location='../pages/userLogin.html';
    }
}