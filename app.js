import {
  auth,
  onAuthStateChanged,
} from "./firebase.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
  } else {
    const consolePage = async () => {
      if (location.pathname === "/htmlPages/gotoconsole.html") {
        location.pathname = "/htmlPages/signup.html";
      } else {
        window.location.pathname = "/htmlPages/signup.html"
      }
      consoleBtn.addEventListener('click', consolePage);
    }
  }
});

// Password Visibility
var icon1 = document.querySelector("#icon1");
icon1 && icon1.addEventListener("click", () => {
  let passwordS = document.querySelector("#passwordS");
  if (passwordS.type === "password") {
    passwordS.type = "text";
    icon1.src = "/images/eye-regular.svg";
  } else {
    passwordS.type = "password";
    icon1.src = "/images/eye-slash-regular.svg";
  }
})

var icon2 = document.querySelector("#icon2");
icon2 && icon2.addEventListener("click", () => {
  let cPasswordS = document.querySelector("#cPasswordS");
  if (cPasswordS.type === "password") {
    cPasswordS.type = "text";
    icon2.src = "/images/eye-regular.svg";
  } else {
    cPasswordS.type = "password";
    icon2.src = "/images/eye-slash-regular.svg";
  }
})

var icon3 = document.querySelector("#icon3");
icon3 && icon3.addEventListener("click", () => {
  let passwordL = document.querySelector("#passwordL");
  if (passwordL.type === "password") {
    passwordL.type = "text";
    icon3.src = "/images/eye-regular.svg";
  } else {
    passwordL.type = "password";
    icon3.src = "/images/eye-slash-regular.svg";
  }
})

//Scrollinh Effect
document.addEventListener("DOMContentLoaded", function () {
  const exploreLink = document.querySelector('.navbar a[href="#explore-section"]');
  if (exploreLink) {
    exploreLink.addEventListener('click', function (event) {
      event.preventDefault();
      const exploreSection = document.getElementById('explore-section');
      if (exploreSection) {
        // Scroll to the explore section smoothly
        exploreSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

// ServiceWorker And user to show the Install App
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => {
        // console.log("Service worker registered");
        if (res.installing) {
          // console.log("Service worker installing");
        } else if (res.waiting) {
          // console.log("Service worker installed");
        } else if (res.active) {
          // console.log("Service worker active");
        }
        res.addEventListener("updatefound", () => {
          // console.log("New service worker found");
        });
      })
      .catch(err => console.error("Service worker registration failed:", err))
  });

  let deferredPrompt;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });

  const installButton = document.getElementById("installButton");

  installButton.addEventListener("click", () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          } else {
            console.log("User dismissed the install prompt");
          }
          deferredPrompt = null;
        })
        .catch((error) => {
          console.error("Error during prompt:", error);
          deferredPrompt = null;
        });
    }
  });
}
