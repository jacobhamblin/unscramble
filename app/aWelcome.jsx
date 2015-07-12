var Welcome = React.createClass({

  getInitialState: function() {
    return {
      difficulty: false,
      clicked: false,
      words: false
    }
  },

  componentDidUpdate: function () {
    if (this.state.difficulty) {
      var self = this;
      function fetchWords (difficulty) {
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

        $.getJSON(url, function(result) {
          var words = [];
          for (var i = 0; i < result.length; i++) {
            words.push(result[i].word);
          }
          self.state.words = words.sort(function(a,b) {
            return a.length - b.length
          });
        });
      }
    fetchWords(this.state.difficulty);
    }
  },

  difficultyClick: function(event) {
    this.setState({ difficulty: event.target.className })
  },

  makeBoxes: function() {
    var letters = [];
    var array = ['U', 'n', 's', 'c', 'r', 'a', 'm', 'b', 'l', 'e'];
    for (var i = 0; i < array.length; i++) {
      var letter = array[i];
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
    if (this.state.words) {
      return (
        <Game words={this.state.words} difficulty={this.state.difficulty} />
      )
    } else {
      return (
        <div className='container'>
          <div className='welcome'>
              {this.makeBoxes()}
          </div>
          <div className='difficulties'>
            <div className='easy' onClick={this.difficultyClick} />
            <div className='medium' onClick={this.difficultyClick} />
            <div className='hard' onClick={this.difficultyClick} />
          </div>
        </div>
      )
    }

  }
})


// 74cda975756707817800802c86206415d567812799f8139d5
//
// http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=adjective&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=5&limit=20&api_key=74cda975756707817800802c86206415d567812799f8139d5 | python -mjson.tool
