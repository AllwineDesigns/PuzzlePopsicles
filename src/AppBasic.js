import React, { Component } from 'react';
import PuzzleSVGBasic from './PuzzleSVGBasic';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: 2,
      cols: 2
    };
  }

  handleRowDown = () => {
    this.setState((prevState) => ({ rows: prevState.rows-1 }));
  }
  handleRowUp = () => {
    this.setState((prevState) => ({ rows: prevState.rows+1 }));
  }
  handleColDown = () => {
    this.setState((prevState) => ({ cols: prevState.cols-1 }));
  }
  handleColUp = () => {
    this.setState((prevState) => ({ cols: prevState.cols+1 }));
  }

  render() {
    const {
      rows,
      cols
    } = this.state;
    return (
        <div>
          <button onClick={this.handleRowDown}>&lt;</button> { rows } Rows <button onClick={this.handleRowUp}>&gt;</button>
          <button onClick={this.handleColDown}>&lt;</button> { cols } Cols <button onClick={this.handleColUp}>&gt;</button><br/>
          <PuzzleSVGBasic cols={cols} rows={rows} seed="123" piece_width={25.4} piece_height={25.4} dpi={96} margin={.25*25.4} kerf={.004*25.4} strokeWidth={.001*25.4}/>
        </div>
    );
  }
}

export default App;
