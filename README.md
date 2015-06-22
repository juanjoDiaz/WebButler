# WebButler

WebButler.js is a butler that lives in your website, can be instructed and executes your commands. It basically add voice control capability to your website in a really cool way. Isn't that awesome?

It's just a litle project that I did to play around with the [Web Speech API](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html) which unfortunately is only supported by Chrome 25+ at the moment.

## Using the butler

You create your butler by giving it a name and a language.

    var butler = new WebButler('Alfred', 'en-GB');
    // This adds some logging to the console
    butler.debug = true;

You can instruct your butler to execute a callback function when he hears a specific instruction. The first parameter of the instruct function can be a regular expresion or a string wich will be converted to `/(^MY_STRING)(.*)?/i`. You can add a third parameter which will be the name of the command for debuging purposes.

    butler.instruct('google', function googleSearch(token) {
      var win = window.open('https://www.google.co.uk/#q=' + token, '_blank');
      win.focus();
    }, 'Google Search');

Your butler will obey your commands via code using the obey function. This is the function that is internally called when you talk to the butler. The butler always expect you to address him by his name

    butler.obey('Alfred google WebButler is awesome');

Your butler can also speak. You can pass a language as a second parameter to this function and the butler will talk in this language instead of using his default one. This is based on the speechSynthesis API. If it is not supported, the butler will be mute and just write to the console.

    // Yo can check butler.isMute to see if he can talk
    butler.speak('Hello sir, my name is Alfred.);

Finally you can talk to your butler. To do so you need to make sure that he is available. You make your butler available by calling it and let him go by dismissing him. yuo can call the butler passing a language as argument and the butler will be listening to that language. By default, you butler will dismiss himself when you stop talking. This is based on the SpeechRecognition API. If it is not supported, the butler will be deaf and this won't work.

    // You can check butler.isAvailable to see if he can talk
    // You can check butler.isDeaf to see if he actually listen to you
    butler.call();
    // Here is were you talk to him
    butler.dismiss(); // Not really necessary

### Testing the butler

The project includes a small test project to play around with the butler. Just go to the folder where the butler is and type:

    npm install
    gulp test
    
Then you can navigate to https:localhost:8888 and try the test butler. The test butler is called Alfred, speaks inglish and is instructed to do:

* `Google <SOMETHING>`   Will do a google search (don't forget to unblock the pop ups)
* `Write <SOMETHING>`   Will write whatever you say on the page
* `I hate you!`         Alfred also have a strong personality sometimes...
 
It has to be https and not http because otherwise the browser will keep asking for consent every single time you try to talk to your butler.
