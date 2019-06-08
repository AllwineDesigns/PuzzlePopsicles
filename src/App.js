import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PuzzleSVG from './PuzzleSVG.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleSaveSVG = () => {
    console.log("in handleSaveSVG");
    const element = document.createElement('div');

    ReactDOM.render(
        <PuzzleSVG raster={false} vector={true} cols={33} rows={18} seed="becky" piece_width={14} piece_height={14} dpi={96} margin={.25*25.4} kerf={.009*25.4} strokeWidth={.001*25.4}/>,
        element);
    const url = window.URL.createObjectURL(new Blob([ element.innerHTML ], { type: 'image/svg+xml' }));
    this.setState({ download_url: url });
  };
  render() {
    const {
      download_url
    } = this.state;

    return (
        <div>
        <div>
          </div>
          <button onClick={this.handleSaveSVG}>Save SVG</button>
          { download_url ? <a href={download_url} download="PuzzleSVG.svg">Download SVG</a> : null }
        </div>
    );
  }
}

export default App;
