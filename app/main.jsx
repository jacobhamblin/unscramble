var Main = React.createClass({

  render: function() {
    return (
      <div className='outer-container'>
        <div className='background' />
        <Welcome />
      </div>
    )
  }
});

React.render(<Main />, document.body);
