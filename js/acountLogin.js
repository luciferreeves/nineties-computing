const welcomeSection = document.getElementById("welcome");
const loginSelectorSection = document.getElementById("loginSelector");
const localAccounts = localStorage.getItem("accounts");
const loginButton = document.getElementById("loginButton");
const currentLoggedInUser = sessionStorage.getItem("currentLoggedInUser");

if (localAccounts && !currentLoggedInUser) {
  welcomeSection.style.display = "none";
  loginSelectorSection.style.display = "block";
}

if (currentLoggedInUser) {
  welcomeSection.style.display = "none";
  loginSelectorSection.style.display = "none";
  DELoader();
}

async function sha512(str) {
  const buf = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder("utf-8").encode(str)
  );
  return Array.prototype.map
    .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

loginButton.addEventListener("click", () => {
  const fullName = document.getElementById("loginFullName").value;
  const password = document.getElementById("loginPassword").value;
  const loginError = document.getElementById("loginError");
  if (!fullName || !password) {
    loginError.innerHTML = "Please enter your credentials.";
  } else {
    const parsedAccounts = JSON.parse(localStorage.getItem("accounts"));
    const accountIndex = parsedAccounts.findIndex(
      (account) => account.fullName === fullName
    );
    if (accountIndex > -1) {
      const account = parsedAccounts[accountIndex];
      sha512(password).then((hashedPassword) => {
        if (hashedPassword === account.password) {
          loginSelectorSection.style.display = "none";
          sessionStorage.setItem("currentLoggedInUser", fullName);
          DELoader();
        } else {
          loginError.innerHTML = "The password entered is incorrect.";
        }
      });
    } else {
      loginError.innerHTML = "This user account does not exist.";
    }
  }
});

function DELoader() {
  const loadingDesktopExperienceElement = document.getElementById(
    "loadingDesktopExperience"
  );
  loadingDesktopExperienceElement.style.display = "block";
  const meterLoaderElement = document.getElementById("meter-loader");
  let width = 0;

  function loadMeter() {
    if (width < 100) {
      if (100 - width < 10) {
        width = 100;
      } else {
        width += Math.round(Math.random() * 10);
      }
      meterLoaderElement.style.width = width + "%";
    } else {
      loadingDesktopExperienceElement.style.display = "none";
      document.getElementById('desktop').style.display = "block";
    }
  }

  (function loop() {
    var rand = Math.round(Math.random() * 500);
    setTimeout(function () {
      loadMeter();
      loop();
    }, rand);
  })();
}
