console.log("Javascript now!!!")


let currentSong = new Audio();
let songs = [];

let currfolder;

function secondsToMinutesSeconds(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

async function getSongs(folder) {
    currfolder = folder;

    let res = await fetch(`/songs/${folder}/songs.json`);
    songs = await res.json();

    let songUL = document.querySelector(".songsList ul");
    songUL.innerHTML = "";

    songs.forEach(song => {
        songUL.innerHTML += `
        <li>
            <img class="invert" src="img/music.svg">
            <div class="info">
                <div>${song}</div>
                <div>Mehak</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg">
            </div>
        </li>`;
    });

    Array.from(songUL.children).forEach((e, i) => {
        e.addEventListener("click", () => playMusic(songs[i]));
    });
}




const playMusic = (track, pause = false) => {
    currentSong.src = `/songs/${currfolder}/${track}`;

    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }

    document.querySelector(".songInfo").innerText = track;
    document.querySelector(".songTime").innerText = "00:00 / 00:00";
};


async function displayAlbums() {

    
    let res = await fetch("/songs/albums.json");
    let albums = await res.json();

    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    albums.forEach(album => {
        cardContainer.innerHTML += `
        <div data-folder="${album.folder}" class="card">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
                    <circle cx="50" cy="50" r="48" fill="#1DB954"/>
                    <polygon points="40,30 40,70 70,50" fill="black"/>
                </svg>
            </div>

            <img src="/songs/${album.folder}/cover.jpg" alt="">
            <h3>${album.title}</h3>
            <p>${album.description}</p>
        </div>
        `;
    });

    // click listeners
    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async () => {
            await getSongs(card.dataset.folder);
            playMusic(songs[0]);
        });
    });
}




async function main() {
    //get the list of all songs
   await getSongs("angry-mood");


    if (songs.length > 0) {
        playMusic(songs[0], true);
    }


    //Display all the albums on the page.

    await displayAlbums()



    //Attatch an event listner to each prev, play and next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    // Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}:${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    }
    )

    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    }
    )

    //add an eventlistner to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    }
    )

    //add an eventlistner to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    }
    )

    //Add an event listner to previous and next
    previous.addEventListener("click", () => {
        console.log("Previous clicked");
        console.log(currentSong)

        let currentFile = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentFile);
        if ((index - 1) >= 0) {

            playMusic(songs[index - 1])

        }
    }
    )

    next.addEventListener("click", () => {
        console.log("Next clicked");


        let currentFile = decodeURIComponent(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentFile);

        if (index < songs.length - 1) {

            playMusic(songs[index + 1])

        }

    }
    )

    //Add an event to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to :", e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value) / 100
        if(currentSong.volume>0){
            document.querySelector(".volume>img").src= document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
        }
    }
    )

    //Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;

        }

    }
    )



}

main()