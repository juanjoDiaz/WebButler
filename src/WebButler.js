/* @preserve
 * WebButler.js
 *
 * Author: Juanjo Diaz <juanjo.diazmo@gmail.com>
 *
 * License: The MIT License (MIT)
 *
 * Copyright 2011-2013 Juanjo Diaz
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
var WebButler = (function() {
  function WebButler(name, lang) {
    'use strict';

    this.name = name || 'Alfred';
    this.lang = lang || 'en';
    this.instructions = [];

    if (!speechSynthesis || !SpeechSynthesisUtterance) {
      this.isMute = true;
    } else {
      this.isMute = false;
      this.u = new SpeechSynthesisUtterance();
      this.u.rate = 1.0;
    }

    if (!webkitSpeechRecognition) {
      this.isDeaf = true;
      delete this[call];
      delete this[dismiss];
    } else {
      this.isDeaf = false;
      /*jshint newcap: false */
      this.listener = new webkitSpeechRecognition();
      /*jshint newcap: true */
    }

    this.listener.onresult = function(event) {
      if (event.results.length > 0) {
        var result = event.results[event.results.length - 1];
        if (result.isFinal) {
          this.obey(result[0].transcript);
        }
      }
    }.bind(this);

    this.listener.onend = function(event) {
      this.available = false;
    }.bind(this);
  }

  WebButler.prototype.speak = function(text, lang) {
    if (this.mute) {
      console.log(this.name + ' said: ' + text);
    }
    this.u.lang = lang || this.lang;
    this.u.text = text;
    window.speechSynthesis.speak(this.u);
  };

  WebButler.prototype.call = function(lang) {
    if (this.available) {
      return;
    }
    this.available = true;
    this.listener.lang = lang || this.lang;
    this.listener.start();
  };

  WebButler.prototype.dismiss = function() {
    if (!this.available) {
      return;
    }
    this.available = false;
    this.listener.stop();
  };

  WebButler.prototype.instruct = function(cmd, func, name) {
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
  };

  WebButler.prototype.obey = function(cmd) {
    if (this.debug) {
      console.debug('Trying to execute', cmd);
    }
    cmd = cmd.trim();
    if (cmd.indexOf(this.name) !== 0) {
      this.speak('Are you talking to me sir?');
      return;
    }
    cmd = cmd.substring(this.name.length).trim();

    var instruction,
      details,
      response;
    for (var i = 0; i < this.instructions.length; i++) {
      instruction = this.instructions[i];
      details = instruction.cmd.exec(cmd);
      if (details) {
        details.shift();
        details.shift();
        if (this.debug) {
          console.debug(this.name + 'is executing ', instruction.name, ' with params: ', JSON.stringify(details));
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
  };

  return WebButler;
})();