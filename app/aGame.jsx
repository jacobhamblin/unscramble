
var ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var ALPHABETCODES = new Object;
for (var i = 0; i < 26; i++) {
  ALPHABETCODES[ALPHABET[i]] = 65 + i;
}

var wordsCompleted = 0;
var mod = 0;
animate();

function animate () {
  requestAnimationFrame(animate);
  $('.background').css('-webkit-filter', 'hue-rotate(' + ((Math.cos(mod) - 1) * 50) + 'deg)');

  mod += (0.0025 * (wordsCompleted + 1));

  var blurred = $('.letter-move');
  for (var i = 0; i < blurred.length; i++) {
    $(blurred[i]).removeClass('letter-move');
  }
}

var Game = React.createClass({

  getInitialState: function() {
    var currentWord = this.props.words[0].toLowerCase();
    var shuffledWord = this.shuffleWord(currentWord);
    var keyCodes = this.setAcceptedKeyCodes();
    var reset = this.props.reset;
    return {
      currentWord: currentWord,
      keyCodes: keyCodes,
      gameOver: false,
      secondsElapsed: 0,
      shuffledWord: shuffledWord,
      selectedLetters: [],
      reset: reset,
      unselectedLetters: shuffledWord.split(''),
    }
  },

  setAcceptedKeyCodes: function() {
    var keyCodes = new Object();
    var currentWord = this.props.words[wordsCompleted].toLowerCase();

    for (var i = 0; i < currentWord.length; i++) {
      if (currentWord[i] === '-') {
        keyCodes[189] = true;
      } else if (currentWord[i] === '\'') {
        keyCodes[222] = true;
      } else {
        keyCodes[ALPHABETCODES[currentWord[i]]] = true;
      }
    }

    return keyCodes;
  },

  componentDidMount: function() {
    document.addEventListener('keydown', this.keyDown);
    this.interval = setInterval(this.tick, 1000);
  },

  tick: function() {
    this.setState({
      secondsElapsed: this.state.secondsElapsed + 1
    })

    if (this.state.gameOver) {
      clearInterval(this.interval);
    } else if (this.state.secondsElapsed === 60) {
      this.setState({
        gameOver: 'Lose',
        selectedLetters: [],
      });
      clearInterval(this.interval);
    }
  },

  keyDown: function (event) {
    if (event.which === 17 || this.state.gameOver) {
      return;
    }
    if (this.state.keyCodes[event.which]) {
      this.alterFormingWord(event.which);
    } else if (event.which === 8) {
      event.preventDefault();
      this.removeLetter();
    }
  },

  computeScore: function() {
    var difficulty = this.props.difficulty;
    var multiplier = 0;
    var bonus = 0;

    if (difficulty === 'easy') {
      multiplier = 0.5;
    } else if (difficulty === 'medium') {
      multiplier = 1.0;
    } else if (difficulty === 'hard') {
      multiplier = 1.5;
    }

    if (this.state.gameOver) {
      bonus = (60 - this.state.secondsElapsed) * 5;
    }

    return (
      ((wordsCompleted * 50) + bonus) * multiplier
    )
  },

  alterFormingWord: function (keyCode) {
    if (this.state.selectedLetters.length < this.state.currentWord.length) {
      var unselectedLetters = this.state.unselectedLetters;
      var selectedLetters = this.state.selectedLetters;
      if (keyCode === 189) {
        if (unselectedLetters.indexOf('-') > -1) {
          unselectedLetters.splice(unselectedLetters.indexOf('-'), 1);
          selectedLetters.push('-');
          this.setState({
            selectedLetters: selectedLetters,
            unselectedLetters: unselectedLetters,
          });
        }
      } else if (keyCode === 222) {
        if (unselectedLetters.indexOf('\'') > -1) {
          unselectedLetters.splice(unselectedLetters.indexOf('\-'), 1)
          selectedLetters.push('\-');
          this.setState({
            selectedLetters: selectedLetters,
            unselectedLetters: unselectedLetters,
          });
        }
      } else {
        if (unselectedLetters.indexOf(ALPHABET[keyCode - 65]) > -1) {
          var letter = ALPHABET[keyCode - 65];
          unselectedLetters.splice(unselectedLetters.indexOf(letter), 1)
          selectedLetters.push(letter);
          this.setState({
            selectedLetters: selectedLetters,
            unselectedLetters: unselectedLetters,
          });
        }
      }
      this.checkWordCompleted();
    }
  },

  nextWord: function() {
    wordsCompleted += 1;
    if (wordsCompleted === 10) {
      this.setState({
        gameOver: 'Win',
        selectedLetters: [],
      })
    } else {
      var keyCodes = this.setAcceptedKeyCodes();
      var curWord = this.props.words[wordsCompleted].toLowerCase();
      var shuffledWord = this.shuffleWord(curWord);

      this.setState({
        currentWord: curWord,
        keyCodes: keyCodes,
        shuffledWord: shuffledWord,
        selectedLetters: [],
        unselectedLetters: shuffledWord.split(''),
      });
    }
  },

  checkWordCompleted: function() {
    var self = this;
    if (this.state.selectedLetters.join('') === this.state.currentWord) {
      this.nextWord();
    } else if (this.state.selectedLetters.length === this.state.currentWord.length) {
      var url = 'http://api.wordnik.com:80/v4/word.json/' + this.state.selectedLetters.join('') + '/definitions?limit=1&includeRelated=true&useCanonical=false&includeTags=false&api_key=74cda975756707817800802c86206415d567812799f8139d5';

      $.getJSON(url, function(result) {
        if (result.length === 0) {
          var letters = $('.letter-box');
          for (var i = 0; i < letters.length; i++) {
            var letterBox = $(letters[i]);
            letterBox.addClass('wrong');
          }
          setTimeout(function() {
            for (var i = 0; i < letters.length; i++) {
              var letterBox = $(letters[i]);
              letterBox.removeClass('wrong');
            }
            self.clearSelectedLetters();
          }, 100);
        } else {
          self.nextWord();
        }
      })
    }
  },

  removeLetter: function() {
    var selectedLetters = this.state.selectedLetters;
    var unselectedLetters = this.state.unselectedLetters;
    if (selectedLetters.length > 0) {
      var poppedLetter = selectedLetters.pop();
      unselectedLetters.push(poppedLetter);
      this.setState({
        selectedLetters: selectedLetters,
        unselectedLetters: unselectedLetters,
      });
    }
  },

  clearSelectedLetters: function() {
    var selectedLetters = this.state.selectedLetters;
    var unselectedLetters = this.state.unselectedLetters;
    this.setState({
      selectedLetters: [],
      unselectedLetters: selectedLetters.concat(unselectedLetters),
    });
  },

  resetGame: function() {
    wordsCompleted = 0;
    mod = 0;
    this.props.reset();
  },

  shuffleWord: function (word) {
    var o = word.split('');
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o.join('');
  },

  playAgain: function() {
    if (this.state.gameOver) {
      var question = (<div onClick={this.resetGame}>Play again</div>)
      return (
        {question}
      );
    }
  },

  populateLetters: function(compilation, array, selected) {
    var className = selected ? 'letter-box selected' : 'letter-box';
    var selection = selected ? 'selected' : 'unselected';
    for (var i = 0; i < array.length; i++) {
      var letter = array[i];
      var key = selection + i.toString();
      if (selected && i === array.length - 1) {
        className = className + ' letter-move';
      }
      compilation.push(
        <div className={className}>
          <div className='letter'>
            {letter}
          </div>
        </div>
      )
    }
    return compilation;
  },

  makeBoxes: function() {
    var selectedLetters = this.state.selectedLetters;
    var unselectedLetters = this.state.unselectedLetters;
    if (this.state.gameOver === 'Win') {
      unselectedLetters = 'You Win!';
    } else if (this.state.gameOver === 'Lose') {
      unselectedLetters = 'Time Up!'
    }

    var letters = [];
    letters = this.populateLetters(letters, selectedLetters, true);
    letters = this.populateLetters(letters, unselectedLetters, false);
    console.log(this.state.currentWord);
    return (
      {letters}
    )
  },

  render: function() {
    return (
      <div className='container'>
        <div className="playAgain">
          {this.playAgain()}
        </div>
        <div className='wordShow'>
          {this.makeBoxes()}
        </div>
        <div className='stats-container'>
          <div className='score'>
            {this.computeScore()}
          </div>
          <div className='timer'>
            {60 - this.state.secondsElapsed}
          </div>
          <div className='wordsCompleted'>
            {wordsCompleted}
          </div>
        </div>
      </div>
    )
  }
});
