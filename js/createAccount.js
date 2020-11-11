const avatarImageElement = document.getElementById("avatar-image-element");
const avatarTextElement = document.getElementById("avatar-text-element");
const avatarFileInputElement = document.getElementById("avatar-file-input");
const createNewAccountButtonElement = document.getElementById(
  "createNewAccount"
);

[avatarImageElement, avatarTextElement].forEach((element) => {
  element.addEventListener("click", () => {
    avatarFileInputElement.click();
  });
});

avatarFileInputElement.addEventListener("change", (file) => {
  encodeImageFileAsURL(avatarFileInputElement);
});

function encodeImageFileAsURL(fileElement) {
  const file = fileElement.files[0];
  const fileReader = new FileReader();
  fileReader.onloadend = (event) => {
    avatarImageElement.style.backgroundImage = `url('${fileReader.result}')`;
    localStorage.setItem("encodedAvatar", fileReader.result);
  };
  try {
    fileReader.readAsDataURL(file);
  } catch (e) {
    alert("Failed to read image file.");
  }
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

createNewAccountButtonElement.addEventListener("click", () => {
  const fullNameElement = document.getElementById("fullname").value;
  const passwordElement = document.getElementById("password").value;
  const confirmPasswordElement = document.getElementById("confirmPassword")
    .value;
  const errorElement = document.getElementById("error");
  errorElement.innerHTML = "";

  if (!fullNameElement || !passwordElement || !confirmPasswordElement) {
    errorElement.innerHTML = "Please fill in all the fields.";
  } else if (passwordElement !== confirmPasswordElement) {
    errorElement.innerHTML = "Passwords do not match.";
  } else {
    const avatarImage = localStorage.getItem("encodedAvatar");
    if (!avatarImage) {
      errorElement.innerHTML = "Please set your avatar.";
    } else {
      sha512(passwordElement).then((hashedPassword) => {
        const currentAccount = {
          fullName: fullNameElement,
          password: hashedPassword,
          avatar: avatarImage,
        };
        const accounts = localStorage.getItem("accounts");
        if (!accounts) {
            const accounts = [];
            accounts.push(currentAccount);
            localStorage.setItem("accounts", JSON.stringify(accounts));
            localStorage.removeItem("encodedAvatar");
        } else {
          const previousAccounts = JSON.parse(localStorage.getItem("accounts"));
          console.log(previousAccounts);
          const ifUsernameExists = previousAccounts.find(
            (account) => account.fullName === fullNameElement
          );
          if (!ifUsernameExists) {
            previousAccounts.push(currentAccount);
            localStorage.removeItem("encodedAvatar");
            localStorage.setItem("accounts", JSON.stringify(accounts));
          } else {
              errorElement.innerHTML = 'An account with that name already exists.';
          }
        }
      });
    }
  }
});
