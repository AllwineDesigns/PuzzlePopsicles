import React, { Component } from 'react';
import seedrandom from 'seedrandom';
import spo from 'svg-path-outline';
import makerjs from 'makerjs';

//import img from './Logo3x3.svg';
//import img from './mom-and-pop-shop.svg';
import img from './CampTrinity.svg';

const pt2str = ([x,y]) => (x +" " + y);
const lerp = (pt1,pt2,t) => ([pt1[0]*(1-t)+pt2[0]*t, pt1[1]*(1-t)+pt2[1]*t]);
const add = (pt1,pt2) => ([pt1[0]+pt2[0], pt1[1]+pt2[1]]);
const mult = (s, pt) => ([pt[0]*s, pt[1]*s])

const cubicBezierInterp = (p1,p2,p3,p4, samples) => {
  let pts = [];
  for(let i = 0; i < samples; i++) {
    let t = i/(samples-1);
    pts.push(add(
               add(
                 mult((1-t)*(1-t)*(1-t),p1),
                 mult(3*(1-t)*(1-t)*t, p2)
               ),

               add(
                 mult(3*(1-t)*t*t, p3),
                 mult(t*t*t, p4)
               )
             ));
     
  }
  return pts;
};

const quadraticBezierInterp = (p1,p2,p3, samples) => {
  let pts = [];
  for(let i = 0; i < samples; i++) {
    let t = i/(samples-1);
    pts.push(add(
               add(
                 mult((1-t)*(1-t),p1),
                 mult(2*(1-t)*t, p2)
               ),
               mult(t*t, p3)
             ));
     
  }
  return pts;
};

const offsetEdge = (edge, offset) => {
  let newEdge = [];
  for(let i = 0; i < edge.length; i++) {
    newEdge.push(add(edge[i], offset));
  }
  return newEdge;
};

const appendEdge = (pts, edge) => {
  if(edge.length === 2) {
    pts.push("L " + pt2str(edge[1]));
  } else {
    pts.push("L " + pt2str(lerp(edge[0], edge[1], .5)));
    pts.push("Q " + pt2str(edge[1]) + " " + pt2str(lerp(edge[1], edge[2], .5)));
    pts.push("T " + pt2str(lerp(edge[2], edge[3], .5)));
    pts.push("T " + pt2str(lerp(edge[3], edge[4], .5)));
    pts.push("T " + pt2str(lerp(edge[4], edge[5], .5)));
    pts.push("L " + pt2str(edge[5]));

/*
    let e0_5 = lerp(edge[0], edge[1], .5);
    let e1_5 = lerp(edge[1], edge[2], .5);
    let e2_5 = lerp(edge[2], edge[3], .5);
    let e3_5 = lerp(edge[3], edge[4], .5);
    let e4_5 = lerp(edge[4], edge[5], .5);

    let bez = quadraticBezierInterp(e0_5, edge[1], e1_5, 10);
    for(let i = 0; i < bez.length-1; i++) {
      pts.push("L " + pt2str(bez[i]));
    }

    bez = quadraticBezierInterp(e1_5, edge[2], e2_5, 10);
    for(let i = 0; i < bez.length-1; i++) {
      pts.push("L " + pt2str(bez[i]));
    }

    bez = quadraticBezierInterp(e2_5, edge[3], e3_5, 10);
    for(let i = 0; i < bez.length-1; i++) {
      pts.push("L " + pt2str(bez[i]));
    }

    bez = quadraticBezierInterp(e3_5, edge[4], e4_5, 10);
    for(let i = 0; i < bez.length; i++) {
      pts.push("L " + pt2str(bez[i]));
    }
    pts.push("L " + pt2str(edge[5]));
    */

//    let bez = cubicBezierInterp(edge[1], edge[2], edge[3], edge[4], 30);
//    for(let i = 0; i < bez.length; i++) {
//      pts.push("L " + pt2str(bez[i]));
//    }
//    pts.push("C " + pt2str(edge[2]) + " " + pt2str(edge[3]) + " " + pt2str(edge[4]));

//    pts.push("L " + pt2str(edge[1]));
//    pts.push("L " + pt2str(edge[2]));
//    pts.push("L " + pt2str(edge[3]));
//    pts.push("L " + pt2str(edge[4]));
//    pts.push("L " + pt2str(edge[5]));
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    const rng = seedrandom(this.props.seed);
//    const rng = seedrandom(img);
    const crng = (m) => (m*(rng()-.5));

    let w = this.props.piece_width;
    let h = this.props.piece_height;

    this.points = [];

    var pointOffsetXMax = .25*w;
    var pointOffsetYMax = .25*h;

    var controlPointOffsetXMax = w*.083;
    var controlPointOffsetYMax = h*.083;

    var controlT1H = .55;
    var controlT2H = .38;
    var controlT3H = .72;
    var controlT4H = .55;

    var controlT1V = .5;
    var controlT2V = .33;
    var controlT3V = .67;
    var controlT4V = .5;

    for(let r = 0; r < this.props.rows+1; r++) {
      let row = [];
      this.points.push(row);
      for(let c = 0; c < this.props.cols+1; c++) {
        let x = c*this.props.piece_width;
        let y = r*this.props.piece_height;
        if(r !== 0 && r !== this.props.rows) {
          y += crng(pointOffsetYMax);
        }

        if(c !== 0 && c !== this.props.cols) {
          x += crng(pointOffsetXMax);
        }

        row.push([x,y]);
      }
    }

    this.horizontal_edges = [];
    for(let r = 0; r < this.props.rows+1; r++) {
      let row = [];
      this.horizontal_edges.push(row);
      for(let c = 0; c < this.props.cols; c++) {
        let pt1 = this.points[r][c];
        let pt2 = this.points[r][c+1];

        if(r === 0 || r === this.props.rows) {
          row.push([ pt1, pt2 ]);
        } else {
          const up = 2*Math.floor(2*rng())-1;

          row.push([ pt1, add(lerp(pt1,pt2,controlT1H), [ crng(controlPointOffsetXMax), crng(controlPointOffsetYMax) ]),
                          add(lerp(pt1,pt2,controlT2H), [ crng(controlPointOffsetXMax), up*.33*h+crng(controlPointOffsetYMax) ]),
                          add(lerp(pt1,pt2,controlT3H), [ crng(controlPointOffsetXMax), up*.33*h+crng(controlPointOffsetYMax) ]),
                          add(lerp(pt1,pt2,controlT4H), [ crng(controlPointOffsetXMax), crng(controlPointOffsetYMax) ]),
                          pt2 ]);

        }
      }
    }

    this.vertical_edges = [];
    for(let r = 0; r < this.props.rows; r++) {
      let row = [];
      this.vertical_edges.push(row);
      for(let c = 0; c < this.props.cols+1; c++) {
        let pt1 = this.points[r][c];
        let pt2 = this.points[r+1][c];

        if(c === 0 || c === this.props.cols) {
          row.push([ pt1, pt2 ]);
        } else {
          const left = 2*Math.floor(2*rng())-1;
          row.push([ pt1, add(lerp(pt1,pt2,controlT1V), [ crng(controlPointOffsetYMax), crng(controlPointOffsetYMax) ]),
                          add(lerp(pt1,pt2,controlT2V), [ left*.33*h+crng(controlPointOffsetYMax), crng(controlPointOffsetYMax) ]),
                          add(lerp(pt1,pt2,controlT3V), [ left*.33*h+crng(controlPointOffsetYMax), crng(controlPointOffsetYMax) ]),
                          add(lerp(pt1,pt2,controlT4V), [ crng(controlPointOffsetYMax), crng(controlPointOffsetYMax) ]),
                          pt2 ]);

        }
      }
    }
  }
  render() {
    const {
      piece_width,
      piece_height,
      strokeWidth,
      margin,
      dpi,
      kerf,
      cols,
      rows
    } = this.props;

    let puzzle_width = piece_width*cols;
    let puzzle_height = piece_height*rows;
    let width = puzzle_width+strokeWidth+margin*2 + 10*cols+60;
    let height = puzzle_height+strokeWidth+margin*2 + 80*rows;
//    let width = 18*25.4;
//    let height = 4*25.4;
    let img_width = dpi/25.4*width;
    let img_height = dpi/25.4*height;

    let pieces = [];

    for(let r = 0; r < rows; r++) {
      for(let c = 0; c < cols; c++) {
//        if(!(r == 0 && c == 0)) continue;
        let pts = [];

        var edge1 = this.horizontal_edges[r][c];
        var edge2 = this.vertical_edges[r][c+1];
        var edge3 = this.horizontal_edges[r+1][c].slice().reverse();
        var edge4 = this.vertical_edges[r][c].slice().reverse();

        pts.push("M " + pt2str(edge1[0]));
        appendEdge(pts, edge1)
        appendEdge(pts, edge2)
        appendEdge(pts, edge3)
        appendEdge(pts, edge4)
        pts[pts.length-1] = "Z";

        //let outline = spo(pts.join(" "), kerf*.5, { bezierAccuracy: .001 });
        let outline = pts.join(" ");
        let outline_model = makerjs.importer.fromSVGPathData(outline, { bezierAccuracy: .001 });

        //let stick_model = makerjs.importer.fromSVGPathData("M 57.81185,0.20777918 L 56.912216,0.20777918 L 56.912218,3.3678212 L 56.092246,3.3678212 L 56.091928,3.3476712 L 55.863926,3.3476572 L 55.863496,3.3678072 L 54.632074,3.3678032 L 54.632062,0.15880718 L 53.732428,0.15880918 L 53.732442,3.3678052 L 51.648158,3.3678012 L 51.648148,0.01190718 L 50.74816,0.01226518 L 50.748152,3.3681772 L 48.03792,3.3678132 L 25.779862,25.149381 L 18.413244,32.515997 L 18.439924,32.542667 C 18.426124,32.556177 18.408414,32.568337 18.394964,32.581787 C 14.20349,36.725039 6.8367576,37.777521 2.6272796,41.986997 C -0.85999645,45.474273 -0.85998045,51.128223 2.6272796,54.615483 C 6.1145396,58.102741 11.76849,58.102759 15.255766,54.615481 C 19.459628,50.411621 19.46596,44.108575 24.7253,38.828049 L 24.7275,38.830249 L 32.094116,31.463633 L 58.963996,4.6748712 L 59.062276,4.5765912 A 0.77105004,0.6673662 45 0 0 59.091536,4.5378612 A 0.77105004,0.6673662 45 0 0 59.125886,4.4801212 A 0.77105004,0.6673662 45 0 0 59.153296,4.4183612 A 0.77105004,0.6673662 45 0 0 59.174116,4.3529712 A 0.77105004,0.6673662 45 0 0 59.188006,4.2849912 A 0.77105004,0.6673662 45 0 0 59.194606,4.2148312 A 0.77105004,0.6673662 45 0 0 59.193866,4.1432212 A 0.77105004,0.6673662 45 0 0 59.186166,4.0712312 A 0.77105004,0.6673662 45 0 0 59.171176,3.9992612 A 0.77105004,0.6673662 45 0 0 59.149256,3.9283612 A 0.77105004,0.6673662 45 0 0 59.121116,3.8585712 A 0.77105004,0.6673662 45 0 0 59.086046,3.7913212 A 0.77105004,0.6673662 45 0 0 59.044846,3.7265512 A 0.77105004,0.6673662 45 0 0 58.998056,3.6659112 A 0.77105004,0.6673662 45 0 0 58.946226,3.6088512 A 0.77105004,0.6673662 45 0 0 58.905616,3.5719912 A 0.77105004,0.6673662 45 0 0 58.846116,3.5233312 A 0.77105004,0.6673662 45 0 0 58.782466,3.4810112 A 0.77105004,0.6673662 45 0 0 58.715986,3.4437212 A 0.77105004,0.6673662 45 0 0 58.646906,3.4134112 A 0.77105004,0.6673662 45 0 0 58.576376,3.3896512 A 0.77105004,0.6673662 45 0 0 58.504776,3.3728212 A 0.77105004,0.6673662 45 0 0 58.471556,3.3680212 L 58.273136,3.3676492 L 57.811622,3.3680192 L 57.81162,0.20797718 Z", { bezierAccuracy: .001 });
        //let stick_model = makerjs.importer.fromSVGPathData("M 51.26772,0.01191811 L 50.74837,0.01243511 L 50.74837,3.3683031 L 48.03795,3.3677861 L 25.77987,25.149404 L 18.4134,32.515874 L 18.43975,32.542744 C 18.42595,32.556264 18.40824,32.568574 18.39479,32.582024 C 14.203319,36.725274 6.8367576,37.777654 2.6272796,41.987134 C -0.85999636,45.474404 -0.85998036,51.128044 2.6272796,54.615304 C 6.1145396,58.102564 11.768691,58.102584 15.255967,54.615304 C 19.45983,50.411444 19.46582,44.108684 24.72516,38.828154 L 24.72774,38.830224 L 32.09421,31.463744 L 58.96389,4.6746831 L 59.06208,4.5764981 A 0.77105006,0.66736623 45.000011 0 0 59.09153,4.5377401 A 0.77105006,0.66736623 45.000011 0 0 59.12616,4.4803801 A 0.77105006,0.66736623 45.000011 0 0 59.15355,4.4183681 A 0.77105006,0.66736623 45.000011 0 0 59.17422,4.3532551 A 0.77105006,0.66736623 45.000011 0 0 59.18817,4.2850421 A 0.77105006,0.66736623 45.000011 0 0 59.19489,4.2147631 A 0.77105006,0.66736623 45.000011 0 0 59.19385,4.1434491 A 0.77105006,0.66736623 45.000011 0 0 59.1861,4.0711021 A 0.77105006,0.66736623 45.000011 0 0 59.17111,3.9992721 A 0.77105006,0.66736623 45.000011 0 0 59.14941,3.9284751 A 0.77105006,0.66736623 45.000011 0 0 59.12099,3.8587121 A 0.77105006,0.66736623 45.000011 0 0 59.08585,3.7915331 A 0.77105006,0.66736623 45.000011 0 0 59.04502,3.7264201 A 0.77105006,0.66736623 45.000011 0 0 58.998,3.6659591 A 0.77105006,0.66736623 45.000011 0 0 58.94632,3.6091151 A 0.77105006,0.66736623 45.000011 0 0 58.9055,3.5719081 A 0.77105006,0.66736623 45.000011 0 0 58.84607,3.5233321 A 0.77105006,0.66736623 45.000011 0 0 58.78251,3.4809571 A 0.77105006,0.66736623 45.000011 0 0 58.71585,3.4437501 A 0.77105006,0.66736623 45.000011 0 0 58.64712,3.4132611 A 0.77105006,0.66736623 45.000011 0 0 58.57632,3.3894901 A 0.77105006,0.66736623 45.000011 0 0 58.505,3.3729541 A 0.77105006,0.66736623 45.000011 0 0 58.47142,3.3683031 L 58.27298,3.3677861 L 57.81151,3.3683031 L 57.81151,0.20777211 L 57.28493,0.20777211 L 57.28493,3.3822551 L 54.64323,3.3822551 L 54.64323,3.3677861 L 54.63238,3.3677861 L 54.63186,0.15867911 L 54.05618,0.15867911 L 54.05618,3.3822551 L 51.26772,3.3822551 L 51.26772,0.01191811 Z", { bezierAccuracy: .001 });
        // stick_model.origin = [-50+edge3[edge3.length-1][0],-edge3[edge3.length-1][1]+1];

        let stick_outline = "M 46.124583,0 L 46.124583,5.18857 L 1.3941711,49.91898 L 1.3759808,49.93662 L 1.3770834,49.93772 A 4.7624833,4.7624833 0 0 0 1.3941711,56.65425 A 4.7624833,4.7624833 0 0 0 8.1107057,56.67134 L 8.1112568,56.67189 L 8.1294469,56.65425 L 53.012545,11.77116 L 53.011992,11.77006 A 4.7624833,4.7624833 0 0 0 53.030734,11.75297 A 4.7624833,4.7624833 0 0 0 54.124892,6.73693 L 54.124892,0 L 53.12499,0 L 53.12499,5.11912 A 4.7624833,4.7624833 0 0 0 53.030734,5.01769 A 4.7624833,4.7624833 0 0 0 50.624688,3.72455 L 50.624688,0 L 49.624787,0 L 49.624787,3.62478 A 4.7624833,4.7624833 0 0 0 47.125035,4.36285 L 47.125035,0 L 46.124583,0 Z";
        let stick_model = makerjs.importer.fromSVGPathData(stick_outline, { bezierAccuracy: .001 });
        stick_model.origin = [-45.5+edge3[edge3.length-1][0],-edge3[edge3.length-1][1]+2];

        let outline_output = makerjs.exporter.toSVGPathData(outline_model, false, [0, 0]);

        makerjs.model.combineUnion(outline_model, stick_model);

        let output = makerjs.exporter.toSVGPathData({ models: [ stick_model, outline_model ] }, false, [0,0]);

        if(!outline) {
          console.log("Couldn't generate outline for " + r + ", " + c);
          pieces.push(<g key={r + "," + c} transform={"translate(" + (0*c) + ", " + (0*r) +")"}><path d={pts.join(" ")} fill="url(#mypattern)" strokeWidth={strokeWidth} stroke="black"/></g>)
        }
        //pieces.push(<g key={r + "," + c} transform={"translate(" + (0*c) + ", " + (0*r) +")"}><path d={pts.join(" ")} fill="url(#mypattern)" strokeWidth={strokeWidth} stroke="black"/></g>)
        //pieces.push(<g key={r + "," + c} transform={"translate(" + (10*c) + ", " + (10*r) +")"}><path d={outline} fill="url(#mypattern)" strokeWidth={strokeWidth} stroke="black"/></g>)

//        pieces.push(<g key={r + "," + c} transform={"translate(" + (10*c) + ", " + (10*r) +")"}><path d={stick_output} fill="url(#mypattern)" strokeWidth={strokeWidth} stroke="black"/></g>)
//        pieces.push(<g key={r + "," + c + "x"} transform={"translate(" + (10*c) + ", " + (10*r) +")"}><path d={outline_output} fill="url(#mypattern)" strokeWidth={strokeWidth} stroke="black"/></g>)

//        let x = 18*c+100+160*r;
//        let y = -2*c-20*r;
//        pieces.push(<g key={r + "," + c} transform={"translate(" + (x) + ", " + (y) +") rotate(45)" }><g><path d={outline_output} fill="url(#mypattern)"/></g>
//                    <g><path d={output} fill="none" strokeWidth={strokeWidth} stroke="black"/></g></g>)

        let x = 10*c+60;
        let y = 80*r;
        pieces.push(<g key={r + "," + c} transform={"translate(" + (x) + ", " + (y) +")" }><g><path d={outline_output} fill="url(#mypattern)"/></g>
                    <g><path d={output} fill="none" strokeWidth={strokeWidth} stroke="black"/></g></g>)
//        pieces.push(<g key={r + "," + c} transform={"translate(" + (x) + ", " + (y) +")" }><g><path d={outline_output} fill="url(#mypattern)"/></g>
//                    <g transform={"translate(" + stick_model.origin[0] + ", " + (-stick_model.origin[1]) + ")"}><path d={stick_outline} fill="none" strokeWidth={strokeWidth} stroke="black"/></g>
//                    <g><path d={outline} fill="none" strokeWidth={strokeWidth} stroke="black"/></g></g>)
      }
    }

    return (
    <div style={{ margin: "30px" }}>
      <svg style={{border: "1px solid black"}} width={.5*img_width} height={.5*img_height} viewBox={"0 0 " + width + " " + height} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mypattern" width={puzzle_width} height={puzzle_height} patternUnits="userSpaceOnUse">
            <image x={0} y={0} width={puzzle_width} height={puzzle_height} xlinkHref={img}/>
          </pattern>
        </defs>
        <g transform={"translate(" + (margin+strokeWidth*.5) + ", " + (margin+strokeWidth*.5) + ")"}>
          {pieces}
        </g>
      </svg>
    </div>
    );
  }
}

export default App;
