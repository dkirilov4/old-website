var settingsOpen = false;

function toggleSettings() {
    console.log("@toggleSettings");
    settingsOpen = !settingsOpen;

    if (settingsOpen) {
        document.getElementById("sidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
    }
    else
    {
        document.getElementById("sidebar").style.width = "0";
        document.getElementById("main").style.marginLeft= "0.25em";
    }
}