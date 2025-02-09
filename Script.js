var audio = new Audio();
async function getsongs() {
  // get songs form user
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
  // console.log(s)
  for (let index = 0; index < s.length; index++) {
    if (s[index].title.endsWith(".mp3")) {
      // songs.push(s[index].title)
      songs[s[index].title] = s[index].href;
    }
  }
  // console.log(songs)
  return songs;
}

function playmusic(link) {
  audio.src = link;
  audio.play();
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
    // console.log(sname);
    e.addEventListener("click", () => {
      // console.log(songs[sname]);
      playmusic(songs[sname]);
    });
  });

  let prevcontrol = document.getElementById("prev");
  let playcontrol = document.getElementById("play");
  let nextcontrol = document.getElementById("next");

  playcontrol.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
    } 
    else {
        audio.pause();
    }
  });
}

main();
