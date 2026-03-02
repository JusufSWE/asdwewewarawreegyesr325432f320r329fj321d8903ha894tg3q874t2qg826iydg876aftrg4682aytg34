// Musiikkisoitin JS

// Polku kansioon, johon lisäät mp3-tiedostot
const musicPath = "../../music";

// DOM-elementit
const audio = document.getElementById("audio-player");
const playlistEl = document.getElementById("music-list");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let songs = [];
let currentIndex = 0;

// Lataa kaikki mp3-tiedostot music-kansiosta
async function loadMusic() {
  try {
    // GitHub Pages ei osaa listata kansiota suoraan, joten käytetään fetch API:ta vain jos listaus on JSONissä
    // Vaihtoehtoisesti jos tiedät tiedostojen nimet etukäteen, voit laittaa array:
    // songs = ["song1.mp3", "song2.mp3"];
    // Tässä oletetaan, että kaikki tiedostot lisätään manuaalisesti arrayhin:
    
    // Esimerkki automaattisesta hausta, jos käytät GitHub APIa:
    const user = "JusufSWE";
    const repo = "asdwewewarawreegyesr325432f320r329fj321d8903ha894tg3q874t2qg826iydg876aftrg4682aytg34";
    const path = "music"; // jos music-kansio docsissa
    const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;

    const response = await fetch(url);
    const files = await response.json();

    songs = files.filter(f => f.name.toLowerCase().endsWith(".mp3"));

    // Täytä playlist
    playlistEl.innerHTML = "";
    songs.forEach((file, index) => {
      const li = document.createElement("li");
      li.textContent = file.name.replace(".mp3", "");
      li.addEventListener("click", () => playSong(index));
      playlistEl.appendChild(li);
    });

    // Soita ensimmäinen kappale, jos löytyy
    if (songs.length > 0) playSong(0);

  } catch (err) {
    console.error("Error loading music:", err);
  }
}

// Toistaa kappaleen indexillä
function playSong(index) {
  currentIndex = index;
  const song = songs[index];
  
  // Jos käytät GitHub APIa:
  audio.src = song.download_url;

  // Jos paikallinen music/ kansio:
  // audio.src = `${musicPath}/${song}`;

  audio.play();

  document.querySelectorAll("#music-list li").forEach((li, i) => {
    li.classList.toggle("active", i === index);
  });

  // Media Session API, lockscreen painikkeet
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.name.replace(".mp3", ""),
    });

    navigator.mediaSession.setActionHandler("previoustrack", prevSong);
    navigator.mediaSession.setActionHandler("nexttrack", nextSong);
    navigator.mediaSession.setActionHandler("play", () => audio.play());
    navigator.mediaSession.setActionHandler("pause", () => audio.pause());
  }
}

// Prev / Next napit
function prevSong() {
  const index = (currentIndex - 1 + songs.length) % songs.length;
  playSong(index);
}

function nextSong() {
  const index = (currentIndex + 1) % songs.length;
  playSong(index);
}

document.addEventListener("keydown", function(e) {
  // Vain Space
  if (e.code === "Space") {
    const player = document.getElementById("music-player");
    const active = document.activeElement;

    // Jos fokus on musiikkisoittimessa tai sen lapset-elementeissä
    if (player.contains(active)) {
      e.preventDefault(); // tärkeää: estää selainkäytöksen (scrollaus / uudelleentoisto)
      
      // Toggle play/pause
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }
});

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// Lataa musiikki heti sivun latautuessa
loadMusic();
