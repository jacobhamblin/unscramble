
var ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var ALPHABETCODES = new Object;
for (var i = 0; i < 26; i++) {
  ALPHABETCODES[ALPHABET[i]] = 65 + i;
}

var Game = React.createClass({

  getInitialState: function() {
    var keyCodes = new Object;
    var currentWord = this.props.words[0];

    for (var i = 0; i < currentWord.length; i++) {
      keyCodes[ALPHABETCODES[currentWord[i]]] = true;
    }

    return {
      currentWord: currentWord,
      keyCodes: keyCodes,
    }
  },

  componentDidMount: function() {
    document.addEventListener('keydown', this.keyDown);
  },

  keyDown: function(event) {
    if (event.keyCode === 17) {
      return;
    }
    if (this.state.keyCodes[event.keyCode]) {
      this.moveLetter(event.keyCode);
    } else if (event.keyCode === 8) {
      this.removeLetter();
    }
  },

  moveLetter: function (keyCode) {
    alert(ALPHABET[keyCode - 65]);
  },

  removeLetter: function() {
    alert('backspace');
  },

  shuffleWord: function (word) {
    var o = word.split('');
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o.join('');
  },

  makeBoxes: function() {
    var word = this.state.currentWord;
    var shuffledWord = this.shuffleWord(word);
    var letters = [];
    console.log(word);
    for (var i = 0; i < word.length; i++) {
      var letter = shuffledWord[i];
      letters.push(
        <div className='letter-box'>
          <div className='letter'>
            {letter}
          </div>
        </div>
      )
    }
    return (
      {letters}
    )
  },

  render: function() {
    return (
      <div className='wordShow'>
        {this.makeBoxes()}
      </div>
    )
  }


});
