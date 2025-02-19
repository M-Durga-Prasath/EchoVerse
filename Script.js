var audio = new Audio();
let isDragging = false;

let musicCircle = document.querySelector(".circle");
// get songs form user
async function getsongs() {
  var response = await fetch("http://127.0.0.1:5500/songs/");
  if (response.ok) {
    var data = await response.text();
    // console.log(data)
  } else {
    console.log("Eroor retreving teh songs");
  }

  let div = document.createElement("div");
  div.innerHTML = data;
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
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// PLAY MUSIC AND UPDATE TEH TIMER AND NAME IN CONTROLS SECTION
function playmusic(link, name) {
  audio.src = link;
  audio.play();
  let playcontrol = document.getElementById("play");
  playcontrol.src = "./assets/svg/pause.svg";
  document.querySelector(".infobar").innerHTML = name.replace(".mp3", "");
  musicCircle.style.left = "0%";

  audio.addEventListener("timeupdate", () => {
    // console.log(audio.currentTime, audio.duration);
    document.querySelector(
      ".timespan"
    ).innerHTML = `${formatTime(audio.currentTime)}/${formatTime(audio.duration)}`;
    document.querySelector(".circle").style.left = (audio.currentTime/audio.duration)*100 +"%" ;
  });
}

function moveCircle(e) {
  const rect = document.getElementsByClassName("seekbar")[0].getBoundingClientRect();
  let offsetX = e.clientX - rect.left; 
  offsetX = Math.max(0, Math.min(offsetX, rect.width));
  

  const progressPercent = (offsetX / rect.width) * 100;
  musicCircle.style.left = progressPercent + "%";
  if (!isNaN(audio.duration)) {
    audio.currentTime = (progressPercent / 100) * audio.duration;
  }
}

function updateFill(slider) {
  const fillPercent = (slider.value - slider.min) / (slider.max - slider.min) * 100;
  slider.style.setProperty('--fill-percent', `${fillPercent}%`);
}


async function main() {
  let songs = await getsongs();
  let songarray = Object.keys(songs);
  let cuurentindex = 0;

  // console.log(songs)
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

  prevcontrol.addEventListener("click", () => {
    if (cuurentindex == 0){
      cuurentindex = songarray.length -1;
    }
    else{
      cuurentindex--;
    }
    playmusic(songs[songarray[cuurentindex]], songarray[cuurentindex]);
    // console.log(cuurentindex);
    // console.log(songarray);
  }
  )

  nextcontrol.addEventListener("click", () => {
    if (cuurentindex == songarray.length-1){
      cuurentindex = 0;
    }
    else{
      cuurentindex++;
    }
    playmusic(songs[songarray[cuurentindex]], songarray[cuurentindex]);
  }
  )

  playcontrol.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playcontrol.src = "./assets/svg/pause.svg";
    } else {
      audio.pause();
      playcontrol.src = "./assets/svg/playcontorl.svg";
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
  }
  )
  closeHamburger.addEventListener("click", () => {
    leftBar.classList.remove("active");
    rightSection.classList.remove("blur");
  }
  )

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let seekbar = e.currentTarget.getBoundingClientRect();
    let circle = document.querySelector(".circle");

    let percent = ((e.clientX - seekbar.left)/seekbar.width) * 100;
    circle.style.left = `${percent}%`;

    if (!isNaN(audio.duration)) {
      audio.currentTime = (percent / 100) * audio.duration;
  }
  }
  )

  const slider = document.querySelector('.dark-range-slider');
  updateFill(slider);
  slider.addEventListener("input", (event)=> {
    // console.log(event.target.value/100);
    let vol = event.target.value/100
    audio.volume = vol;
  });
}

main();
