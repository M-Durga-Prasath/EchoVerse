var audio = new Audio();
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

  audio.addEventListener("timeupdate", () => {
    // console.log(audio.currentTime, audio.duration);
    document.querySelector(
      ".timespan"
    ).innerHTML = `${formatTime(audio.currentTime)}/${formatTime(audio.duration)}`;
  });
}

async function main() {
  let songs = await getsongs();
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
    });
  });

  let prevcontrol = document.getElementById("prev");
  let playcontrol = document.getElementById("play");
  let nextcontrol = document.getElementById("next");

  playcontrol.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playcontrol.src = "./assets/svg/pause.svg";
    } else {
      audio.pause();
      playcontrol.src = "./assets/svg/playcontorl.svg";
    }
  });
}

main();
