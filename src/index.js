import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App cols={10} rows={10} seed="123" piece_width={25.4} piece_height={25.4} dpi={96} margin={.25*25.4} kerf={.004*25.4} strokeWidth={.001*25.4}/>,
  document.getElementById('root')
);
