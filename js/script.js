
// creating variables connected to dom elements
const wrapper = document.querySelector(".wrapper"),
songImg = wrapper.querySelector(".img-area img"),
songName = wrapper.querySelector(".song-details .name"),
songArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn =  wrapper.querySelector(".play-pause"),
prevBtn =  wrapper.querySelector("#prev"),
nextBtn =  wrapper.querySelector("#next"),
progressArea =  wrapper.querySelector(".progress-area"),
progressBar =  wrapper.querySelector(".progress-bar"),
queue = wrapper.querySelector(".song-list"),
showQueueBtn = wrapper.querySelector("#more-music"),
hideQueueBtn = wrapper.querySelector("#close");


let songIndex =  Math.floor((Math.random() * allSongs.length) + 1);

window.addEventListener("load", () => {
    loadSong(songIndex);
    songPlaying();
});

// loading songs with all details according to index
function loadSong(indexNumb) {
    songName.innerText = allSongs[indexNumb - 1].name;
    songArtist.innerText = allSongs[indexNumb - 1].artist;
    songImg.src = `images/${allSongs[indexNumb - 1].img}.jpeg`;
    mainAudio.src = `songs/${allSongs[indexNumb - 1].src}.mp3`;
}

function playSong() {
    wrapper.classList.add("paused");
    // displays pause button 
    playPauseBtn.querySelector("i").innerText = "pause";
    // plays audio
    mainAudio.play();
}

function pauseSong() {
    wrapper.classList.remove("paused");
    // displays play arrow
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    // pauses audio
    mainAudio.pause();
}

function prevSong() {
    // decrement by 1
    songIndex--;
    // if the song index is less than 1, the last song will play
    songIndex < 1 ? songIndex = allSongs.length : songIndex = songIndex;
    // loads song with all details according to its index
    loadSong(songIndex);
    // and will play audio
    playSong();
    songPlaying();
}

function nextSong() {
    // increment by 1
    songIndex++;
    // after the last song on the song index, the first song will play next
    songIndex > allSongs.length ? songIndex = 1 : songIndex = songIndex;
    // loads song with all details according to its index
    loadSong(songIndex);
    // and will play audio
    playSong();
    songPlaying();
}

playPauseBtn.addEventListener("click", () => {
    // upon clicking the pause button, the song will have a class of 'paused'
    const isSongPaused = wrapper.classList.contains("paused");
    // if the song has a class of 'paused', the song will be paused, if not the song will play
    isSongPaused ? pauseSong() : playSong();
    songPlaying();
});

nextBtn.addEventListener("click", () => {
    nextSong();
});

prevBtn.addEventListener("click", () =>  {
    prevSong();
});

// progress bar width according to music time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    
        let songCurrentTime = wrapper.querySelector(".current"),
        songDuration = wrapper.querySelector(".duration");
        
        mainAudio.addEventListener("loadeddata", () => {
        // update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) { // this will add a '0' if the seconds are less than 10.... 2:8 will be 2:08
            totalSec = `0${totalSec}`;
        }
        songDuration.innerText =  `${totalMin}:${totalSec}`;
    });

    // update song total duration
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) { // this will add a '0' if the seconds are less than 10.... 2:8 will be 2:08
        currentSec = `0${currentSec}`;
    }
    songCurrentTime.innerText = `${currentMin}:${currentSec}`;
    
});

// update song's current time according to progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth; // 
    let clickedOffSetX = e.offsetX;
    let sngDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * sngDuration;
    playSong();
});


// repeat button 
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch(getText) {
        case "repeat":  // if the icon is repeat, switch to repeat one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped");
            break;
        case "repeat_one": // if icon is repeat one, switch to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "playback shuffle");
            break;
        case "shuffle": // iff icon is on shuffle, switch back to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "playlist looped");
            break;
    }
});

// once song ends, let's make sure the button will take effect
mainAudio.addEventListener("ended", () => {

    let getText = repeatBtn.innerText;

    switch(getText) {
        case "repeat": // if icon is repeat, the next song will play
            nextSong();  
            break;
        case "repeat_one": // if icon is repeat one, change the current time to 0:00, song will play from beginning
            mainAudio.currentTime = 0;
            loadSong(songIndex);
            playSong();
            break;
        case "shuffle": // if icon is on shuffle, switch back to repeat
            let randIndex = Math.floor((Math.random() * allSongs.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allSongs.length) + 1);
            } while (songIndex == randIndex); // the loop will run until the next random number is not the same as the current song index
            songIndex = randIndex; // the random song will play 
            loadSong(songIndex);
            playSong();
            songPlaying();
            break;
    }
});


showQueueBtn.addEventListener("click", () => {
    queue.classList.toggle("show");
});

hideQueueBtn.addEventListener("click", () => {
    showQueueBtn.click();
});

const ulTag =  wrapper.querySelector("ul");

for (let i = 0; i < allSongs.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allSongs[i].name}</span>
                        <p>${allSongs[i].artist}</p>
                    </div>
                    <span id="${allSongs[i].src}" class="audio-duration">3:27</span>
                    <audio id="${allSongs[i].src}" class="${allSongs[i].src}" src="songs/${allSongs[i].src}.mp3"></audio>
                </li>`;
    
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allSongs[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allSongs[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if (totalSec < 10) { // this will add a '0' if the seconds are less than 10.... 2:8 will be 2:08
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText =  `${totalMin}:${totalSec}`;
        // liAudioDuartion.setAttribute("t-duration", `${totalMin}:${totalSec}`);
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}
// add an onclick attribute to all li
const allLiTag = ulTag.querySelectorAll("li");

function songPlaying() {
    
    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration");

        if  (allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        if (allLiTag[j].getAttribute("li-index") == songIndex) {
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }

        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}

// play a particular song upon clicking from queue
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    songIndex = getLiIndex;
    loadSong(songIndex);
    playSong();
    songPlaying();
}