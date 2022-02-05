
window.addEventListener("load", function () {
    addVideoEvent ();
});

function addVideoEvent () {

    const videoPlayer = document.querySelector ('.video-player');
    const vpViewer = document.querySelector (".vp__viewer");
    const vpBtn = document.querySelector (".vp__btn");
    const vpImg = document.querySelector (".vp__img");

    const vpIconPlay = document.querySelector (".vp__icon-play");
    const vpIconVolume = document.querySelector (".vp__icon-volume");
    const vpProgressBar = document.querySelector (".vp__progress-bar");
    const vpVolumeBar = document.querySelector (".vp__volume-bar");
    
    const timeElapsed = document.querySelector ('.time-elapsed');
    const duration = document.querySelector ('.duration');  
    const fullScreenIcon = document.querySelector ('.vp__icon-fullscreen');

    let isPlay = false;
    let isManual = false;
    let volumePosition = 0;

    const playVideo = () => {
        if (!isPlay) {          
            vpViewer.play ();     
            vpBtn.classList.add ("hide");        
            vpIconPlay.classList.remove ("play");
            videoPlayer.classList.remove ("pause");
            isPlay = true;
        }
        else {        
            vpViewer.pause ();  
            vpBtn.classList.remove ("hide");   
            vpIconPlay.classList.add ("play");
            videoPlayer.classList.add ("pause");
            isPlay = false;
        }    
    };

    function updateProgressBar () {
        if (isManual) {
            isManual = false;
            return false;
        }
        // const percent = Math.floor (vpViewer.currentTime / vpViewer.duration * 1000) / 10;
        const percent = Math.floor (vpViewer.currentTime / vpViewer.duration * 100);
        vpProgressBar.value = percent;    
        updateBarGradient (vpProgressBar); 
        // console.log (percent);              
    }

    function updateProgressVideo () {
        isManual = true;
        // const currentTime = Math.floor (this.value / 100 * vpViewer.duration);
        const currentTime = Math.floor (this.value / 100 * vpViewer.duration * 10) / 10;
        vpViewer.currentTime = currentTime;      
        updateBarGradient (this);
    }

    function updateBarGradient (bar) {
        // const gradient = `linear-gradient(to right, #bdae82 0%, #bdae82 ${position}%, #c8c8c8 ${position}%, #c8c8c8 100% )`;
        const position = bar.value;
        const gradient = `linear-gradient(to right, #a7945d 0%, #917d44 ${position}%, #c8c8c8 ${position}%, #c8c8c8 100% )`;
        bar.style.backgroundImage = gradient;
    }

    function moveToStart () {
        vpViewer.currentTime = 0;
        isPlay = true;
        playVideo ();
    }

    const muteSound = () => {
        vpIconVolume.classList.toggle ("mute");
        if (vpViewer.muted) {
            vpViewer.muted = false;
            vpVolumeBar.value = volumePosition;
            updateBarGradient (vpVolumeBar);
        }
        else {
            vpViewer.muted = true;
            volumePosition = vpVolumeBar.value;
            vpVolumeBar.value = 0;
            updateBarGradient (vpVolumeBar);
        }
    }

    function updateVolume () {
        if (this.value == 0) {
            vpViewer.muted = true;       
            vpIconVolume.classList.add ("mute");
        }
        else {
            vpViewer.muted = false;
            vpIconVolume.classList.remove ("mute");
        }

        updateBarGradient (this); 
        var volume = this.value / 100;
        vpViewer.volume = volume;     
    }

    function formatTime (timeInSeconds) {
        const date = new Date (timeInSeconds * 1000);
        const dateString = date.toISOString().substr (11, 8);
        const minutes = dateString.substr (3, 2);
        const seconds = dateString.substr (6, 2);

        return {minutes, seconds};
    };

    function initVideo () {
        const videoDuration = Math.round (vpViewer.duration);   
        const time = formatTime (videoDuration);

        vpImg.removeEventListener("click", initVideo);
        vpImg.classList.add ("hide");

        vpBtn.removeEventListener("click", initVideo);
        vpBtn.classList.add ("activ");
        
        duration.innerText = `${time.minutes}:${time.seconds}`;
        duration.setAttribute ('datetime', `${time.minutes}m ${time.seconds}s`)
    }

    function updateTimeElapsed() {
        const time = formatTime (Math.round (this.currentTime));
        
        timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
        timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
    }

    function toggleFullScreen () {
        if (document.fullscreenElement) {
          document.exitFullscreen ();
          videoPlayer.classList.remove("full-screen");
        } else if (document.webkitFullscreenElement) {
          document.webkitExitFullscreen ();
          videoPlayer.classList.remove("full-screen");
        } else if (videoPlayer.webkitRequestFullscreen) {
          videoPlayer.webkitRequestFullscreen();
          videoPlayer.classList.add("full-screen");
        } else {
          videoPlayer.requestFullscreen();
          videoPlayer.classList.add("full-screen");
        }
        return false;
    }

    let timerClick;

    function countClick () {
        if (!timerClick) {
                timerClick = setTimeout (() => {
                    timerClick = false;
                }, 300);
        }
        else {
            timerClick = false;
            toggleFullScreen();
        }
    }

    let timerControls;

    function showСontrols () {
        if (!document.fullscreenElement || vpViewer.paused) return false;
        videoPlayer.classList.add ("show-controls");
        clearTimeout (timerControls);
        timerControls = setTimeout (() => {
            videoPlayer.classList.remove ("show-controls");
        }, 2000);
    }
   
    videoPlayer.addEventListener ("mousemove", showСontrols); // toggleFullScreen
    
    //vpViewer.addEventListener("loadedmetadata", initVideo); 
    vpViewer.addEventListener ("click", countClick); // toggleFullScreen
    vpViewer.addEventListener ("click", playVideo); 
    vpViewer.addEventListener('timeupdate', updateTimeElapsed);     
    vpViewer.addEventListener('timeupdate', updateProgressBar);
    vpViewer.addEventListener('ended', moveToStart);
    
    vpBtn.addEventListener ("click", countClick); 
    vpBtn.addEventListener ("click", playVideo);
    vpBtn.addEventListener("click", initVideo, { once: true });   
    
    vpImg.addEventListener("click", initVideo, { once: true });
    vpImg.addEventListener ("click", playVideo);
    
    vpIconPlay.addEventListener ("click", playVideo);
    vpProgressBar.addEventListener('input', updateProgressVideo);

    vpVolumeBar.addEventListener('input', updateVolume);
    vpVolumeBar.addEventListener('mousemove', updateVolume);
    vpIconVolume.addEventListener ("click", muteSound); 

    fullScreenIcon.addEventListener ("click", toggleFullScreen); 
}


