function openNav() {
    document.getElementById("myNav").style.width = "100%";
    document.getElementById("gif").play();

}

function closenav() {
    document.getElementById("myNav").style.width = "0%";
    var video = document.getElementById("gif");
    video.pause();
    video.currentTime = 0;

}
