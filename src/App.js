import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PuzzleSVG from './PuzzleSVG.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleSaveSVG = () => {
    let element = document.createElement('div');

    let onUpdate = () => {
      let url = window.URL.createObjectURL(new Blob([ element.innerHTML ], { type: 'image/svg+xml' }));
      let canvas = document.createElement('canvas');
      canvas.width = 18*600;
      canvas.height = 4*600;

      let ctx = canvas.getContext('2d');
      let img = document.createElement('img');
      img.src = url;
      img.onload = () => {
        console.log(img.width, img.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let rasterURL = canvas.toDataURL();

        let element2 = document.createElement('div');
        let onUpdate2 = () => {
          let url = window.URL.createObjectURL(new Blob([ element2.innerHTML ], { type: 'image/svg+xml' }));
          this.setState({ download_url: url });
        };
        ReactDOM.render(
            <PuzzleSVG onUpdate={onUpdate2} raster={false} vector={true} image={rasterURL} cols={2} rows={2} seed="123" piece_width={25.4} piece_height={25.4} dpi={96} margin={.25*25.4} kerf={.004*25.4} strokeWidth={.001*25.4}/>,
            element2);

      };
    };

    ReactDOM.render(
        <PuzzleSVG onUpdate={onUpdate} raster={true} vector={false} cols={2} rows={2} seed="123" piece_width={25.4} piece_height={25.4} dpi={96} margin={.25*25.4} kerf={.004*25.4} strokeWidth={.001*25.4}/>,
        element);

  };
  render() {
    const {
      download_url
    } = this.state;

    return (
        <div>
        <div>
          <PuzzleSVG raster={true} vector={true} cols={2} rows={2} seed="123" piece_width={25.4} piece_height={25.4} dpi={96} margin={.25*25.4} kerf={.004*25.4} strokeWidth={.001*25.4}/>
          </div>
          <button onClick={this.handleSaveSVG}>Save SVG</button>
          { download_url ? <a href={download_url} download="PuzzleSVG.svg">Download SVG</a> : null }
        </div>
    );
  }
}

export default App;
