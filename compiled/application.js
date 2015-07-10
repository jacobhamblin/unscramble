'use strict';

var ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var ALPHABETCODES = new Object();
for (var i = 0; i < 26; i++) {
  ALPHABETCODES[ALPHABET[i]] = 65 + i;
}

var Game = React.createClass({ displayName: 'Game',

  getInitialState: function getInitialState() {
    var keyCodes = new Object();
    var currentWord = this.props.words[0];

    for (var i = 0; i < currentWord.length; i++) {
      keyCodes[ALPHABETCODES[currentWord[i]]] = true;
    }

    return {
      currentWord: currentWord,
      keyCodes: keyCodes
    };
  },

  componentDidMount: function componentDidMount() {
    document.addEventListener('keydown', this.keyDown);
  },

  keyDown: function keyDown(event) {
    if (event.keyCode === 17) {
      return;
    }
    if (this.state.keyCodes[event.keyCode]) {
      this.moveLetter(event.keyCode);
    } else if (event.keyCode === 8) {
      this.removeLetter();
    }
  },

  moveLetter: function moveLetter(keyCode) {
    alert(ALPHABET[keyCode - 65]);
  },

  removeLetter: function removeLetter() {
    alert('backspace');
  },

  shuffleWord: function shuffleWord(word) {
    var o = word.split('');
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o.join('');
  },

  makeBoxes: function makeBoxes() {
    var word = this.state.currentWord;
    var shuffledWord = this.shuffleWord(word);
    var letters = [];
    console.log(word);
    for (var i = 0; i < word.length; i++) {
      var letter = shuffledWord[i];
      letters.push(React.createElement('div', { className: 'letter-box' }, React.createElement('div', { className: 'letter' }, letter)));
    }
    return { letters: letters };
  },

  render: function render() {
    return React.createElement('div', { className: 'wordShow' }, this.makeBoxes());
  }

});
'use strict';

var Welcome = React.createClass({ displayName: 'Welcome',

  getInitialState: function getInitialState() {
    return {
      difficulty: false,
      clicked: false,
      words: false
    };
  },

  componentDidUpdate: function componentDidUpdate() {
    if (this.state.difficulty) {
      var fetchWords = function fetchWords(difficulty) {
        var min = 0;
        var max = 0;
        if (difficulty === 'hard') {
          min = '6';
          max = '10';
        } else if (difficulty === 'medium') {
          min = '5';
          max = '8';
        } else if (difficulty === 'easy') {
          min = '4';
          max = '6';
        }
        var url = 'http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=adjective&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=' + min + '&maxLength=' + max + '&limit=10&api_key=74cda975756707817800802c86206415d567812799f8139d5';

        $.getJSON(url, function (result) {
          var words = [];
          for (var i = 0; i < result.length; i++) {
            words.push(result[i].word);
          }
          self.state.words = words.sort(function (a, b) {
            return a.length - b.length;
          });
        });
      };

      var self = this;

      fetchWords(this.state.difficulty);
      debugger;
    }
  },

  difficultyClick: function difficultyClick(event) {
    this.setState({ difficulty: event.target.className });
  },

  render: function render() {
    if (this.state.words) {
      return React.createElement(Game, { words: this.state.words });
    } else {
      return React.createElement('div', { className: 'container' }, React.createElement('div', { className: 'welcome' }, 'Unscramble!'), React.createElement('div', { className: 'difficulties' }, React.createElement('div', { className: 'easy', onClick: this.difficultyClick }), React.createElement('div', { className: 'medium', onClick: this.difficultyClick }), React.createElement('div', { className: 'hard', onClick: this.difficultyClick })));
    }
  }
})

// 74cda975756707817800802c86206415d567812799f8139d5
//
// http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=adjective&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=5&limit=20&api_key=74cda975756707817800802c86206415d567812799f8139d5 | python -mjson.tool
;
"use strict";

var Main = React.createClass({ displayName: "Main",

  render: function render() {
    return React.createElement("div", { className: "background" }, React.createElement(Welcome, null));
  }
});

React.render(React.createElement(Main, null), document.body);