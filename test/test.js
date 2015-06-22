var butler = new WebButler('Alfred', 'en-GB');
butler.debug = true;

butler.instruct('Write', write);
butler.instruct('I hate you', hate);
butler.instruct('google', googleSearch);

function hate() {
  this.speak('I hate you more!');
}

function googleSearch(token) {
  var win = window.open('https://www.google.co.uk/#q=' + token, '_blank');
  win.focus();
}

function write(text) {
  document.getElementById('text').innerHTML = text;
}