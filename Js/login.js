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

import {
    auth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,

} from "../firebase.js";

import { createUserWithEmailAndPassword } from "../firebase.js";



const passwordReset = () => {
    const resetEmail = document.getElementById("resetEmail").value;
    sendPasswordResetEmail(auth, resetEmail)
        .then(() => {
            toastr.success('Your request for password reset has been granted. Please check your inbox.');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toastr.error("Please try again.");
        });
}
const passwordResetBtn = document.getElementById("passwordResetBtn");
passwordResetBtn.addEventListener('click', passwordReset);

const logIn = () => {
    let emailL = document.getElementById('emailL').value;
    let passwordL = document.getElementById('passwordL').value;
    if (emailL === "") {
        toastr.error('Please Enter email.');
    } else if (passwordL === "") {
        toastr.error('Please enter Password.');
    } else {
        signInWithEmailAndPassword(auth, emailL, passwordL)
            .then((userCredential) => {
                const user = userCredential.user;
                toastr.success('Login Succcessfully.');
                setTimeout(() => {
                    location.pathname = "./htmlPages/gotoconsole.html";
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toastr.error('Invalid Email or Passowrd.');
            });
    }
}
loginBtn.addEventListener('click', logIn);
