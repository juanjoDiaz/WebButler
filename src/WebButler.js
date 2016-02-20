/* @preserve
 * WebButler.js
 *
 * Author: Juanjo Diaz <juanjo.diazmo@gmail.com>
 *
 * License: The MIT License (MIT)
 *
 * Copyright 2011-2016 Juanjo Diaz
 *
 * Permission is hereby granted,y free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 */
'use strict';

class WebButler {
    constructor(name, lang) {
     this.name = name || 'Alfred';
    this.lang = lang || 'en';
    this.instructions = [];

    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      this.isMute = true;
    } else {
      this.isMute = false;
      this.u = new SpeechSynthesisUtterance();
      this.u.rate = 1.0;
    }

    if (!window.SpeechRecognition) {
      window.SpeechRecognition = window.webkitSpeechRecognition;
    }
    if (!SpeechRecognition) {
      this.isDeaf = true;
      delete this.call;
      delete this.dismiss;
      return;
    } else {
      this.isDeaf = false;
      this.listener = new SpeechRecognition();
    }

    this.listener.addEventListener('result', e => {
      if (e.results.length > 0) {
        let result = e.results[e.results.length - 1];
        if (result.isFinal) {
          this.obey(result[0].transcript);
        }
      }
    });

    this.listener.addEventListener('start', e => {
      this.available = true;
      document.getElementById('butler-image').src = 'img/butler_awake.gif';
    });

    this.listener.addEventListener('end', e => {
      this.available = false;
      document.getElementById('butler-image').src = 'img/butler.gif';
    });
  }

  speak(text, lang) {
    if (this.mute) {
      return console.log(this.name + ' said: ' + text);
    }
    this.u.lang = lang || this.lang;
    this.u.text = text;
    speechSynthesis.speak(this.u);
  }

  call(lang) {
    if (this.available) {
      return;
    }
    this.listener.lang = lang || this.lang;
    this.listener.start();
  }

  dismiss() {
    if (!this.available) {
      return;
    }
    this.available = false;
    this.listener.stop();
  }

 instruct(cmd, func, name) {
    if (typeof cmd === 'string') {
      cmd = new RegExp('(^' + cmd + ')(.*)?', 'i');
    } else if ((cmd instanceof RegExp)) {
      cmd = new RegExp(cmd.source, 'i');
    } else {
      throw 'Unfortunately your butler can only learn string or RegExp commands.';
    }

    if (typeof func !== 'function') {
      throw 'Butlers can only execute functions in order to obey a command.';
    }

    this.instructions.push({
      name: name || cmd,
      cmd: cmd,
      response: func
    });
  }

  obey(cmd) {
    if (this.debug) {
      console.debug('Trying to execute', cmd);
    }
    cmd = cmd.trim();
    if (cmd.indexOf(this.name) !== 0) {
      this.speak('Are you talking to me sir?');
      return;
    }
    cmd = cmd.substring(this.name.length).trim();

    let instruction,
      details,
      response;
    for (let i = 0; i < this.instructions.length; i++) {
      instruction = this.instructions[i];
      details = instruction.cmd.exec(cmd);
      if (details) {
        details.shift();
        details.shift();
        if (this.debug) {
          console.debug(this.name + ' is executing ', instruction.name, ' with params: ', JSON.stringify(details));
        }
        try {
          return instruction.response.apply(this, details);
        } catch (err) {
          this.speak('Sorry sir. I could not fulfil your request.');
          return;
        }
      }
    }
    this.speak('I did not understand sir.');
  }
}