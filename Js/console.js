import {
    auth,
    onAuthStateChanged,
    sendEmailVerification,
    doc,
    setDoc,
    getDoc,
    db,
    signOut,
    updateEmail,
    updatePassword,
    ref,
    uploadBytesResumable,
    storage,
    getDownloadURL,
    onSnapshot,
} from "../firebase.js";

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

//To check the user Status
onAuthStateChanged(auth, async (user) => {
    const userEmail = document.getElementById('userEmail');
    const userVerifyStatus = document.getElementById('userVerifyStatus');
    const loader3 = document.getElementById('loader3');
    const profile1 = document.getElementById('profile1');
    loader3.style.display = "block";
    if (user) {
        const uid = user.uid;
        userEmail.textContent = user.email;
        if (user.emailVerified === false) {
            userVerifyStatus.textContent = "Plese verify yourself to access more features.";
            uploadBtn.style.display = "none";
            seeProfileBtn.style.display = "none";
        } else {
            userVerifyStatus.textContent = "Congratulation! You are verified.";
            verifyBtn.style.display = "none";
            uploadBtn.style.display = "flex";
            seeProfileBtn.style.display = "flex";
        }
        loader3.style.display = "none";
        profile1.style.display = "flex";
    } else {
        let pathArr = location.pathname.split("/")
        let path = `/${pathArr[pathArr.length - 2]}/${pathArr[pathArr.length - 1]}`
        if (path === "/htmlPages/gotoconsole.html") {
            location.pathname = location.pathname.replace("/htmlPages/gotoconsole.html", "/htmlPages/signup.html");
        }
    }
});

//Checking user verification Status
const emailVerification = () => {
    sendEmailVerification(auth.currentUser)
        .then(() => {
            toastr.success("Email verification has been sented.");
        });
}
verifyBtn.addEventListener('click', emailVerification);

//Accessing the file outside the function
let file;
const selectShowPic = () => {
    let userPhotoUpload = document.getElementById('userPhotoUpload');
    let inputFile = document.getElementById('inputFile');
    userPhotoUpload.addEventListener('click', function () {
        inputFile.click();
    });

    inputFile.onchange = function () {
        file = inputFile.files[0];
        userPhotoUpload.src = URL.createObjectURL(file);
    }
}
selectShowPic();

//Uploading file
let uploadTask;
const uploadFile = async () => {
    //Validating select file
    if (!file) {
        toastr.warning("Please select a picture first.");
        return;
    }
    //File size validation
    if (file.size > 1572864) {
        toastr.warning("Picture must be less than 1.5Mb.");
        return;
    }
    const authCurrentUserUid = auth.currentUser.uid;
    const storageRef = ref(storage, `usersImages/${authCurrentUserUid}`);
    uploadTask = uploadBytesResumable(storageRef, file);
    cancelUploadBtn.style.display = "flex";
    uploadBtn.style.display = "none";
    await uploadTask.on('state_changed',
        (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            document.getElementById('progressBar').style.width = progress + '%';
            toastr.info("Uploading...");
            progressDiv.style.display = "block";
        },
        (error) => {
            toastr.error("Upload failed. Please try again.");
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    const imageUrl = downloadURL;
                    setDoc(doc(db, "usersImages", `${authCurrentUserUid}`), {
                        userImageUrl: `${imageUrl}`,
                    }).then(() => {
                        toastr.success("Image Uploaded successfully.");
                        progressDiv.style.display = "none";
                        uploadBtn.style.display = "flex";
                        cancelUploadBtn.style.display = "none";
                    }).catch((error) => {
                        toastr.error("Error occured in uploading file.");
                    });
                })
                .catch(error => {
                    toastr.error("Error getting download URL.");
                })
        }
    );
};
const uploadBtn = document.getElementById("uploadBtn");
uploadBtn.addEventListener("click", uploadFile);

//Cancel Upload
let cancelUpload = () => {
    uploadTask.cancel();
    toastr.success("Your upload has been cancelled.");
}
const cancelUploadBtn = document.getElementById("cancelUploadBtn");
cancelUploadBtn.addEventListener("click", cancelUpload);

//Saving Profile Data
const saveProfileDetails = async () => {
    const loader2 = document.getElementById('loader2');
    const editDetails = document.getElementById('editDetails');
    let name = document.getElementById('name').value;
    let surname = document.getElementById('surname').value;
    let area = document.getElementById('area').value;
    let mobileNo = document.getElementById('mobileNo').value;
    let emailProvided = document.getElementById('emailProvided').value;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let countryName = document.getElementById('countryName').value;
    const user = auth.currentUser;
    const uid = user.uid;
    if (name === "") {
        toastr.error("Please Provide name.");
    } else if (name === "") {
        toastr.error("Please Provide name.");
    } else if (surname === "") {
        toastr.error("Please provide surname.");
    } else if (area === "") {
        toastr.error("Please provide correct area.");
    } else if (mobileNo === "") {
        toastr.error("Please provide mobile number.");
    } else if (mobileNo.length < 11) {
        toastr.error("Invalid phone number.");
    } else if (emailProvided === "") {
        toastr.error("Please provide email.");
    } else if (!emailRegex.test(emailProvided)) {
        toastr.error("Invalid email.");
    } else if (countryName === "") {
        toastr.error("Please provide area.");
    } else {
        loader2.style.display = "block";
        editDetails.style.display = "none";
        await setDoc(doc(db, "usersData", `${uid}`), {
            name,
            surname,
            mobileNo,
            emailProvided,
            area,
            countryName,
        });
        loader2.style.display = "none";
        editDetails.style.display = "block";
        toastr.success("Your data has been saved.");
        document.getElementById('name').value = "";
        document.getElementById('surname').value = "";
        document.getElementById('area').value = "";
        document.getElementById('mobileNo').value = "";
        document.getElementById('emailProvided').value = "";
        document.getElementById('countryName').value = "";
    }
}
const saveDetailsBtn = document.getElementById("saveDetailsBtn");
saveDetailsBtn.addEventListener('click', saveProfileDetails);

//Getting Data
const viewDetails = async () => {
    const loader1 = document.getElementById('loader1');
    const getDetails = document.getElementById('getDetails');
    let getName = document.getElementById('getName');
    let getSurname = document.getElementById('getSurname');
    let getMobileNumber = document.getElementById('getMobileNumber');
    let primaryEmail = document.getElementById('primaryEmail');
    let secondaryEmail = document.getElementById('secondaryEmail');
    let getArea = document.getElementById('getArea');
    let getCountryName = document.getElementById('getCountryName');
    let getStatus = document.getElementById('getStatus');
    const userPhotoSettings1 = document.getElementById("userPhotoSettings1");
    let getId = document.getElementById('getId');
    loader1.style.display = "block";
    const user = auth.currentUser;
    const uid = user.uid;
    const docRefImage = doc(db, "usersImages", `${uid}`)
    const docSnapImage = await getDoc(docRefImage);
    if (docSnapImage.exists()) {
        let {
            userImageUrl,
        } = docSnapImage.data();
        userPhotoSettings1.src = userImageUrl;
    }
    const docRefdata = doc(db, "usersData", `${uid}`);
    const docSnapdata = await getDoc(docRefdata);
    if (docSnapdata.exists()) {
        let {
            name,
            surname,
            mobileNo,
            emailProvided,
            area,
            countryName,
        } = docSnapdata.data();
        getDetails.style.display = 'block';
        getName.value = name;
        getSurname.value = surname;
        getMobileNumber.value = mobileNo;
        primaryEmail.value = user.email;
        secondaryEmail.value = emailProvided;
        getArea.value = area;
        if (user.emailVerified === true) {
            getStatus.value = "Are you are verified? Yes!";
        } else {
            getStatus.value = "Are you are verified? No!";
        }
        getCountryName.value = countryName;
        getId.value = user.uid;
        loader1.style.display = 'none';
    } else {
        loader1.style.display = 'block';
        toastr.error("No such data available.");
        modalBody.innerHTML = "No data available!";
        loader1.style.display = 'none';
    }
}
const seeProfileBtn = document.getElementById("seeProfileBtn");
seeProfileBtn.addEventListener("click", viewDetails);

//Updating Details
const updateDetails = async () => {
    const loader4 = document.getElementById("loader4");
    const updateDetails = document.getElementById("updateDetails");
    const uid = auth.currentUser.uid;
    const docRef = doc(db, "usersData", uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        toastr.error("User data not found. Please edit details first and then update.");
        return;
    }
    const userData = docSnap.data();
    const updatedData = {};
    const updateName = document.getElementById('updateName').value.trim();
    const updateSurname = document.getElementById('updateSurname').value.trim();
    const updateMobileNumber = document.getElementById('updateMobileNumber').value.trim();
    const updateSecondaryEmail = document.getElementById('updateSecondaryEmail').value.trim();
    const updateCountryName = document.getElementById('updateCountryName').value.trim();
    const updateArea = document.getElementById('updateArea').value.trim();
    loader4.style.display = "block";
    updateDetails.style.display = "none";
    if (updateName !== '') updatedData.name = updateName;
    if (updateSurname !== '') updatedData.surname = updateSurname;
    if (updateMobileNumber !== '') updatedData.mobileNo = updateMobileNumber;
    if (updateSecondaryEmail !== '') updatedData.emailProvided = updateSecondaryEmail;
    if (updateCountryName !== '') updatedData.countryName = updateCountryName;
    if (updateArea !== '') updatedData.area = updateArea;
    if (Object.keys(updatedData).length === 0) {
        toastr.info("No fields to update. Existing data retained.");
        return;
    }
    try {
        await setDoc(docRef, updatedData, { merge: true });
        loader4.style.display = "none";
        updateDetails.style.display = "block";
        toastr.success("Details updated successfully.");
        updateDetailsModalCloseBtn.click();
    } catch (error) {
        loader4.style.display = "none";
        updateDetails.style.display = "block";
        console.error("Error updating details.");
        toastr.error("Failed to update details. Please try again.");
    }
}
const updateDetailsBtn = document.getElementById("updateDetailsBtn");
updateDetailsBtn.addEventListener("click", updateDetails);

//Setting the old email in input 
const accountSetting = async () => {
    let oldEmail = document.getElementById('oldEmail');
    const user = auth.currentUser;
    const uid = user.uid;
    const userPhotoSettings2 = document.getElementById("userPhotoSettings2");
    const docRefImage = doc(db, "usersImages", `${uid}`)
    const docSnapImage = await getDoc(docRefImage);
    if (docSnapImage.exists()) {
        let {
            userImageUrl,
        } = docSnapImage.data();
        userPhotoSettings2.src = userImageUrl;
    }
    oldEmail.value = user.email;
}
const accountSettingBtn = document.getElementById("accountSettingBtn");
accountSettingBtn.addEventListener('click', accountSetting);

//Changing the Password
const editPassword = () => {
    let newPassword = document.getElementById('newPassword').value;
    let passwordRegex = /^(?=.*[!@#$%^&*()-_+=])[0-9!@#$%^&*()-_+=]{6,10}$/;
    const user = auth.currentUser;
    if (newPassword === "") {
        toastr.error("Please provide Password.");
    } else if (!passwordRegex.test(newPassword)) {
        toastr.error('Invalid Password.');
    } else {
        updatePassword(user, newPassword).then(() => {
            toastr.success('Password Updated successfully.');
            document.getElementById('newPassword').value = "";
            privacyModalCloseBtn.click();
        }).catch((error) => {
            toastr.error("Please try again.");
        });
    }
}
const editPasswordBtn = document.getElementById("editPasswordBtn");
editPasswordBtn.addEventListener('click', editPassword);

//Changing the email
const editEmail = async () => {
    const user = auth.currentUser;
    let newEmail = document.getElementById('newEmail').value;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (newEmail === "") {
        toastr.error("Please provide email.");
    } else if (!emailRegex.test(newEmail)) {
        toastr.error('Invalid email.');
    } else {
        updateEmail(user, newEmail).then(() => {
            toastr.success("Your email has been updated.");
            document.getElementById('newEmail').value = "";
            privacyModalCloseBtn.click();
        }).catch((error) => {
            toastr.error("Please try again.");
        });
    }
}
const editEmailBtn = document.getElementById("editEmailBtn")
editEmailBtn.addEventListener('click', editEmail);

//Logout User
const logout = () => {
    signOut(auth).then(() => {
        toastr.success("You have been signout successfully.");
    }).catch((error) => {
        setTimeout(() => {
            location.pathname = '../index.html';
        })
        toastr.error("Please try again.");
    });
}
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener('click', logout);

//Password Visibility toggle
var icon4 = document.querySelector("#icon4");
icon4.addEventListener("click", () => {
    let newPassword = document.getElementById("newPassword");
    if (newPassword.type === "password") {
        newPassword.type = "text";
        icon4.src = "/images/eye-regular.svg";
    } else {
        newPassword.type = "password";
        icon4.src = "/images/eye-slash-regular.svg";
    }
});
