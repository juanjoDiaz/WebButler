'use strict';

let butler = new WebButler('Alfred', 'en-GB');
butler.debug = true;

butler.instruct('I hate you', () => butler.speak('I hate you more!'));
butler.instruct('Repeat', text => butler.speak(text));
butler.instruct('google', googleSearch);
butler.instruct('Release the beast', releaseRaptor);

let note = 'Your web butler is ready. His name is ' + this.name + ' and he can comunicate in English. ';
if (butler.isMute) {
  note = 'Unfortunately he is mute ';
  if(butler.isDeaf) {
    note = 'and deaf. You can command him using the console: "butler.obey(<MY_COMMAND>)."';
  } 
} else {
  if(butler.isDeaf) {
    note = 'Unfortunately he is deaf. You can command him using the console: "butler.obey(<MY_COMMAND>)."'
  }
}

function addNote(text) {
  let note = document.createElement('p');
  note.className = 'note';
  note.innerHTML = text;
  let dialog = document.getElementById('dialog');
  dialog.appendChild(note);
  dialog.parentElement.scrollTop = dialog.parentElement.scrollHeight;
}

addNote(note);

// Extend the butler to print the bubbles

function addBubble(text, right) {
  let bubble = document.createElement('p');
  bubble.className = 'bubble ' + (right ? 'right' : 'left');
  bubble.innerHTML = text;
  let dialog = document.getElementById('dialog');
  dialog.appendChild(bubble);
  dialog.parentElement.scrollTop = dialog.parentElement.scrollHeight;
}

function updateButler(butler) {
  let oldObey = butler.obey;
  butler.obey = function (cmd) {
    addBubble(cmd, true);
    oldObey.apply(butler, [cmd]);
  }
  let oldSpeak = butler.speak;
  butler.speak = function (text, lang) {
    addBubble(text);
    oldSpeak.apply(butler, [text, lang]);
  }
}

updateButler(butler);

function googleSearch(token) {
  let win = window.open('https://www.google.co.uk/#q=' + token, '_blank');
  win.focus();
}

let locked = false;
let raptorImage = document.createElement('img');
raptorImage.id = 'elRaptor';
raptorImage.style.position = 'fixed';
raptorImage.style.display = 'block';
raptorImage.style.bottom = '-700px';
raptorImage.style.right = 0;
raptorImage.src = 'img/raptor.png';

let raptorAudio = new Audio('img/raptor-sound.ogg');

//Append Raptor and Style
document.body.appendChild(raptorImage);

// Animating Code
function releaseRaptor() {
  locked = true;

  //Sound Hilarity
  raptorAudio.play();
          
  // Movement Hilarity

  setTimeout(() => {
    raptorImage.style.transition = 'all 100ms ease';
    raptorImage.style.bottom = '-130px';
    setTimeout(() => {
      raptorImage.style.transition = 'all 2200ms ease';
      raptorImage.style.right = raptorImage.offsetLeft + 400 + 'px';
      setTimeout(() => {
        raptorImage.style.transition = '';
        raptorImage.style.bottom = '-700px',
        raptorImage.style.right = 0;
        setTimeout(() => {
          locked = false;
      }, 400);
      }, 2200);
    }, 100);
  }, 400);
}

setTimeout(() => {
  let voices = document.getElementById('voices');
  voices.innerHTML = speechSynthesis.getVoices()
    .map(voice => {
      let selected = '';
      if (voice.voiceURI === 'Alex') {
        selected = 'selected';
        butler.u.voice = voice;
      }

      return `<option value="${voice.voiceURI}" ${selected}>${voice.name} (${voice.lang})</option>`
    })
    .join('/n');

  voices.addEventListener('change', () => butler.u.voice = speechSynthesis.getVoices().find(voice => voice.voiceURI === voices.value));

  let volume = document.getElementById('volume');
  volume.value = butler.u.volume;
  volume.addEventListener('change', () => butler.u.volume = volume.value);

  let rate = document.getElementById('rate');
  rate.value = butler.u.rate;
  rate.addEventListener('change', () => butler.u.rate = rate.value);

  let pitch = document.getElementById('pitch');
  pitch.value = butler.u.pitch;
  pitch.addEventListener('change', () => butler.u.pitch = pitch.value);
}, 500);

document.getElementById('instruct').addEventListener('click', () => {
  let command = document.getElementById('command'),
    response = document.getElementById('response');

  butler.instruct(command.value, (function (response) {
    return () => butler.speak(response);
  })(response.value));
  command.value = '';
  response.value ='';
});