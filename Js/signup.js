import { auth, createUserWithEmailAndPassword } from "../firebase.js";
//Initialize Toastr;
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-full-width",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "2000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

const registerYourSelf = () => {
  let passwordS = document.getElementById('passwordS').value;
  let cPasswordS = document.getElementById('cPasswordS').value;
  let passwordRegex = /^(?=.*[!@#$%^&*()-_+=])[0-9!@#$%^&*()-_+=]{6,10}$/;
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let emailS = document.getElementById('emailS').value;
  if (emailS === "") {
    toastr.error("Please enter email.");
  } else if (!emailRegex.test(emailS)) {
    toastr.error("Invalid Email");
  } else if (passwordS === "") {
    toastr.error("Please enter password.");
  }
  else if (!passwordRegex.test(passwordS)) {
    toastr.error("Password must be 6 characters long of only 5 digits and one special character.")
  }
  else if (cPasswordS === "") {
    toastr.error("Please confirm password.");
  }
  else if (passwordS !== cPasswordS) {
    toastr.error("Please match password.");
  }
  else {
    createUserWithEmailAndPassword(auth, emailS, passwordS)
      .then((userCredential) => {
        const user = userCredential.user;
        toastr.success("Registered successfully.");
        setTimeout(() => {
          location.pathname = '/htmlPages/login.html';
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/email-already-in-use") {
          toastr.info("Email already registered.")
        }
      });
  }
}

signupBtn && signupBtn.addEventListener('click', registerYourSelf);
