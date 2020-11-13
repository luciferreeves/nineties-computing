const parsedAccounts = JSON.parse(localAccounts);
const currentAccount = parsedAccounts.find(
  (account) => account.fullName === currentLoggedInUser
);
const currentIndex = parsedAccounts.findIndex(
  (account) => account.fullName === currentLoggedInUser
);
const desktop = document.getElementById("desktop");
const wallpaperRoute = "./images/wallpapers";
const wallpaperExtension = ".jpeg";

if(!currentAccount.wallpaper) {
    currentAccount['wallpaper'] = 'Wallpaper1';
    parsedAccounts[currentIndex] = currentAccount;
    localStorage.setItem('accounts', JSON.stringify(parsedAccounts));
    desktop.style.backgroundImage = `url("${wallpaperRoute}/${currentAccount.wallpaper}${wallpaperExtension}")`;
} else {
    desktop.style.backgroundImage = `url("${wallpaperRoute}/${currentAccount.wallpaper}${wallpaperExtension}")`;
}
