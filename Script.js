async function getsongs(){
    var response = await fetch("http://127.0.0.1:5500/songs/")
    if(response.ok){
        var data = await response.text()
        // console.log(data)
    }
    else{
        console.log("Eroor retreving teh songs")
    }
    let div = document.createElement("div");
    div.innerHTML = data
    var songs = {}
    var s = div.getElementsByTagName("a")
    // console.log(s)
    for (let index = 0; index < s.length; index++) {
        if(s[index].title.endsWith(".mp3")){
            // console.log(s[index].title)
            // songs.push(s[index].title)
            songs[s[index].title] = s[index].href
        }
    }
    // console.log(songs)
    return songs
}


async function main(){
    let songs = await getsongs()
    let musicdiv = document.querySelector('.music').getElementsByTagName('ul')[0];
    for ( let song in songs) {
        musicdiv.innerHTML = musicdiv.innerHTML + `<li>${song.replace(".mp3", " ")}</li>`;
    };
    var audio = new Audio(songs[1])
    // audio.play()
}


main()