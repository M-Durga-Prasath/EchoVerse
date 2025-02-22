var audio = new Audio();
let isDragging = false;

let musicCircle = document.querySelector(".circle");
// get songs form user
async function getsongs(folder) {
  var response = await fetch(`/public/songs/${folder}`);
  if (response.ok) {
    var data = await response.text();
    // console.log(data)
  } else {
    console.log("Eroor retreving teh songs");
  }

  let div = document.createElement("div");
  div.innerHTML = data;
  // console.log(div);
  var songs = {};
  var s = div.getElementsByTagName("a");
  for (let index = 0; index < s.length; index++) {
    if (s[index].title.endsWith(".mp3")) {
      // songs.push(s[index].title)
      songs[s[index].title] = s[index].href;
    }
  }
  // console.log(songs)
  return songs;
}

//FORMAT SECONDS TO 00:00 FORMAT
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// PLAY MUSIC AND UPDATE TEH TIMER AND NAME IN CONTROLS SECTION
function playmusic(link, name) {
  audio.pause(); // Pause any previous track

  if (!link) {
    console.error("Invalid song URL");
    return;
  }

  audio.src = link;
  audio.load(); // Ensure metadata is loaded before playing

  audio.oncanplay = () => {
    audio.play().catch((error) => console.error("Playback error:", error));
  };

  let playcontrol = document.getElementById("play");
  if (playcontrol) {
    playcontrol.src = "./assets/svg/pause.svg";
  }

  document.querySelector(".infobar").innerHTML = name.replace(".mp3", "");
  musicCircle.style.left = "0%";

  audio.removeEventListener("timeupdate", updateTime);
  audio.addEventListener("timeupdate", updateTime);
}

function updateTime() {
  document.querySelector(".timespan").innerHTML = `${formatTime(
    audio.currentTime
  )}/${formatTime(audio.duration)}`;
  document.querySelector(".circle").style.left =
    (audio.currentTime / audio.duration) * 100 + "%";
}

function moveCircle(e) {
  const rect = document
    .getElementsByClassName("seekbar")[0]
    .getBoundingClientRect();
  let offsetX = e.clientX - rect.left;
  offsetX = Math.max(0, Math.min(offsetX, rect.width));

  const progressPercent = (offsetX / rect.width) * 100;
  musicCircle.style.left = progressPercent + "%";
  if (!isNaN(audio.duration)) {
    audio.currentTime = (progressPercent / 100) * audio.duration;
  }
}

function updateFill(slider) {
  const fillPercent =
    ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.setProperty("--fill-percent", `${fillPercent}%`);
}

let cuurentindex = 0;

function songui(songs) {
  let songarray = Object.keys(songs);
  // console.log(songarray);
  let musicdiv = document.getElementsByClassName("music")[0];
  musicdiv.innerHTML = "";

  //update teh songs library in teh left accordingly
  for (let song in songs) {
    let songName = song.replace(".mp3", "");
    let songCard = `
        <div class="card">
            <div class="songimg">▶</div>
            <p class="nameofsong">${songName}</p>
        </div>
    `;
    musicdiv.innerHTML = musicdiv.innerHTML + songCard;
  }

  Array.from(musicdiv.getElementsByClassName("card")).forEach((e) => {
    // console.log(e);
    let sname = e.getElementsByClassName("nameofsong")[0].innerHTML + ".mp3";
    e.addEventListener("click", () => {
      playmusic(songs[sname], sname);
      cuurentindex = songarray.indexOf(sname);
    });
  });

  let prevcontrol = document.getElementById("prev");
  let playcontrol = document.getElementById("play");
  let nextcontrol = document.getElementById("next");

  prevcontrol.replaceWith(prevcontrol.cloneNode(true)); // Reset event listener
  nextcontrol.replaceWith(nextcontrol.cloneNode(true));
  playcontrol.replaceWith(playcontrol.cloneNode(true));

  prevcontrol = document.getElementById("prev");
  nextcontrol = document.getElementById("next");
  playcontrol = document.getElementById("play");

  prevcontrol.addEventListener("click", () => {
    if (cuurentindex == 0) {
      cuurentindex = songarray.length - 1;
    } else {
      cuurentindex--;
    }
    // console.log(songs[songarray[cuurentindex]], songarray[cuurentindex]);
    playmusic(songs[songarray[cuurentindex]], songarray[cuurentindex]);
  });

  nextcontrol.addEventListener("click", () => {
    if (cuurentindex == songarray.length - 1) {
      cuurentindex = 0;
    } else {
      cuurentindex++;
    }
    // console.log(songs[songarray[cuurentindex]], songarray[cuurentindex]);
    playmusic(songs[songarray[cuurentindex]], songarray[cuurentindex]);
  });

  playcontrol.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playcontrol.src = "public/assets/svg/pause.svg";
    } else {
      audio.pause();
      playcontrol.src = "public/assets/svg/playcontorl.svg";
    }
  });

  musicCircle.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartTime = Date.now(); // Track when dragging started
    moveCircle(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      musicCircle.style.transition = "none";
      moveCircle(e);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    void musicCircle.offsetWidth; // Force reflow to apply transition properly
    musicCircle.style.transition = "left 0.3s linear";
  });

  let openHamburger = document.querySelector(".hamburger");
  let closeHamburger = document.querySelector(".hamburger-close");
  let leftBar = document.querySelector(".left");
  let rightSection = document.querySelector(".right");

  openHamburger.addEventListener("click", () => {
    leftBar.classList.add("active");
    rightSection.classList.add("blur");
  });
  closeHamburger.addEventListener("click", () => {
    leftBar.classList.remove("active");
    rightSection.classList.remove("blur");
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let seekbar = e.currentTarget.getBoundingClientRect();
    let circle = document.querySelector(".circle");

    let percent = ((e.clientX - seekbar.left) / seekbar.width) * 100;
    circle.style.left = `${percent}%`;

    if (!isNaN(audio.duration)) {
      audio.currentTime = (percent / 100) * audio.duration;
    }
  });

  const slider = document.querySelector(".dark-range-slider");
  updateFill(slider);
  slider.addEventListener("input", (event) => {
    // console.log(event.target.value/100);
    let vol = event.target.value / 100;
    audio.volume = vol;
  });
}


function loadalbum(){
  
}

async function main() {
  let songs;
  let folder;
  let cardcontainer = document.querySelector(".card-container");
  document.addEventListener("DOMContentLoaded", async () => {
    let info = [];
    let res = await fetch("/public/songs");
    let text = await res.text(); 

    // console.log(text);
    let parse = new DOMParser();
    let docs = parse.parseFromString(text, "text/html");

    // console.log(docs);
    let folders = [...docs.querySelectorAll(".icon-directory")];

    let folderNames = folders
    .map(element => element.querySelector(".name")?.textContent.trim())
    .filter(name => name !== "..");

    info = await Promise.all(folderNames.map( async (element) => {
      let infojson = await fetch(`/public/songs/${element}/info.json`);
      infojson = await infojson.json();
      return { element, data: infojson };
    }
    ));
    
    // console.log(info)
   for (let index = 0; index < info.length; index++) {
     console.log(info[index].element)
      cardcontainer.innerHTML += `<div data-folder="${info[index].element}" class="card hover">
            <img
              src="/public/songs/${info[index].element}/cover.png"
              alt="title"
            />
            <h3>${info[index].data["Title"]}</h3>
            <button class="coldplay"><img src="/public/assets/svg/play.svg" alt="play"></button>
            <p>${info[index].data["Desc"]}</p>
          </div>`
    }
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", async () => {
        // console.log(card.dataset.folder);
        folder = card.dataset.folder;
        // console.log(folder);
        songs = await getsongs(folder);
        songui(songs);
      });
    });
});

}

main();
