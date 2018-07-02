import React, { Component } from 'react';
import seedrandom from 'seedrandom';
import spo from 'svg-path-outline';
import makerjs from 'makerjs';
import clone from 'clone';

import img from './Trinity2018.svg';
//import img from './Logo3x3.svg';
//import img from './CampTrinity.svg';
//import img from './mom-and-pop-shop.svg';
//import img from './BozemanJS.svg';

const avgX = (pts) => pts.map(pt => pt[0]).reduce((a,b) => a+b)/pts.length;
const avgY = (pts) => pts.map(pt => pt[1]).reduce((a,b) => a+b)/pts.length;
const minX = (pts) => pts.map(pt => pt[0]).reduce((a,b) => Math.min(a,b));
const minY = (pts) => pts.map(pt => pt[1]).reduce((a,b) => Math.min(a,b));
const maxX = (pts) => pts.map(pt => pt[0]).reduce((a,b) => Math.max(a,b));
const maxY = (pts) => pts.map(pt => pt[1]).reduce((a,b) => Math.max(a,b));
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

class PuzzleSVG extends Component {
  constructor(props) {
    super(props);

    let that = this;

    fetch(img)
     .then(response => response.blob())
     .then((data) => {
       let urlCreator = window.URL || window.webkitURL; 
       let imageUrl = urlCreator.createObjectURL(data); 

       var a = new FileReader();
       a.onload = function(e) {that.setState({ img: e.target.result });}
       a.readAsDataURL(data);
     });

     this.state = { img: img };
  }

  componentDidUpdate() {
    const {
      onUpdate
    } = this.props;

    console.log(onUpdate);

    if(onUpdate) {
      onUpdate();
    }
  }

  render() {
    const {
      img
    } = this.state;
    const {
      seed,
      piece_width,
      piece_height,
      strokeWidth,
      margin,
      dpi,
      kerf,
      cols,
      rows,
      vector,
      raster,
      image
    } = this.props;

    const rng = seedrandom(seed);
    const crng = (m) => (m*(rng()-.5));
    const nrng = (n) => (Math.floor(n*rng()));

    let w = piece_width;
    let h = piece_height;

    let points = [];

    var pointOffsetXMax = .25*w;
    var pointOffsetYMax = .25*h;

    var controlPointOffsetXMax = w*.083;
    var controlPointOffsetYMax = h*.083;

    var controlT1H = .50;
    var controlT2H = .33;
    var controlT3H = .67;
    var controlT4H = .50;

    var controlT1V = .5;
    var controlT2V = .33;
    var controlT3V = .67;
    var controlT4V = .5;

    for(let r = 0; r < rows+1; r++) {
      let row = [];
      points.push(row);
      for(let c = 0; c < cols+1; c++) {
        let x = c*piece_width;
        let y = r*piece_height;
        if(r !== 0 && r !== rows) {
          y += crng(pointOffsetYMax);
        }

        if(c !== 0 && c !== cols) {
          x += crng(pointOffsetXMax);
        }

        row.push([x,y]);
      }
    }

    let horizontal_edge_dir = [];
    let horizontal_edges = [];
    for(let r = 0; r < rows+1; r++) {
      let row = [];
      let row_dir = [];
      horizontal_edges.push(row);
      horizontal_edge_dir.push(row_dir);

      for(let c = 0; c < cols; c++) {
        let pt1 = points[r][c];
        let pt2 = points[r][c+1];

        if(r === 0 || r === rows) {
          row.push([ pt1, pt2 ]);
          row_dir.push(0);
        } else {
          const up = 2*Math.floor(2*rng())-1;
          row_dir.push(up);

          row.push([ pt1, add(lerp(pt1,pt2,controlT1H), [ crng(controlPointOffsetXMax), crng(controlPointOffsetYMax) ]),
                          add(lerp(pt1,pt2,controlT2H), [ crng(controlPointOffsetXMax), up*.33*h+crng(controlPointOffsetYMax) ]),
                          add(lerp(pt1,pt2,controlT3H), [ crng(controlPointOffsetXMax), up*.33*h+crng(controlPointOffsetYMax) ]),
                          add(lerp(pt1,pt2,controlT4H), [ crng(controlPointOffsetXMax), crng(controlPointOffsetYMax) ]),
                          pt2 ]);

        }
      }
    }

    let vertical_edges = [];
    let vertical_edge_dir = [];
    for(let r = 0; r < rows; r++) {
      let row = [];
      let row_dir = [];
      vertical_edges.push(row);
      vertical_edge_dir.push(row_dir);
      for(let c = 0; c < cols+1; c++) {
        let pt1 = points[r][c];
        let pt2 = points[r+1][c];

        if(c === 0 || c === cols) {
          row.push([ pt1, pt2 ]);
          row_dir.push(0);
        } else {
          const left = 2*Math.floor(2*rng())-1;
          row_dir.push(left);
          row.push([ pt1, add(lerp(pt1,pt2,controlT1V), [ crng(controlPointOffsetYMax), crng(controlPointOffsetYMax) ]),
                          add(lerp(pt1,pt2,controlT2V), [ left*.33*h+crng(controlPointOffsetYMax), crng(controlPointOffsetYMax) ]),
                          add(lerp(pt1,pt2,controlT3V), [ left*.33*h+crng(controlPointOffsetYMax), crng(controlPointOffsetYMax) ]),
                          add(lerp(pt1,pt2,controlT4V), [ crng(controlPointOffsetYMax), crng(controlPointOffsetYMax) ]),
                          pt2 ]);

        }
      }
    }
    let puzzle_width = piece_width*cols;
    let puzzle_height = piece_height*rows;
//    let width = puzzle_width+strokeWidth+margin*2 + 10*cols+60;
//    let height = puzzle_height+strokeWidth+margin*2 + 80*rows;
    let width = 18*25.4;
    //let height = 6*25.4;
    let height = 4*25.4;
    let img_width = dpi/25.4*width;
    let img_height = dpi/25.4*height;

    let pieces = [];

    for(let r = 0; r < rows; r++) {
      for(let c = 0; c < cols; c++) {
//        if(!(r == 0 && c == 0)) continue;
        let pts = [];

        var edge1 = horizontal_edges[r][c];
        var edge2 = vertical_edges[r][c+1];
        var edge3 = horizontal_edges[r+1][c].slice().reverse();
        var edge4 = vertical_edges[r][c].slice().reverse();

        let dir1 = horizontal_edge_dir[r][c];
        let dir2 = vertical_edge_dir[r][c+1];
        let dir3 = horizontal_edge_dir[r+1][c];
        let dir4 = vertical_edge_dir[r][c];

        pts.push("M " + pt2str(edge1[0]));
        appendEdge(pts, edge1)
        appendEdge(pts, edge2)
        appendEdge(pts, edge3)
        appendEdge(pts, edge4)
        pts[pts.length-1] = "Z";

        let outline = pts.join(" ");
        let outline_model = makerjs.importer.fromSVGPathData(outline, { bezierAccuracy: .001 });

        const stick_height = 3.25*25.4;
        const stick_width = .375*25.4;

        var stick_model = {
          models: {
            stick: new makerjs.models.Oval(stick_width, stick_height),
//            circle: new makerjs.models.Oval(2*stick_width, 2*stick_width)
          }
        };
//        stick_model.models.circle.origin = [ -stick_width*.5, -stick_width*.5 ];
        stick_model.origin = [-stick_width*.5, -stick_width*.5];
        let rotation_options= {
          0: "top",
          90: "left",
          180: "bottom",
          270: "right"
        };
        if(r === 0) {
          delete rotation_options[0];
        } else if(r === rows-1) {
          delete rotation_options[180];
        }

        if(c === 0) {
          delete rotation_options[90];
        } else if(c === cols-1) {
          delete rotation_options[270];
        }

        let angles = Object.keys(rotation_options);
        let angle = parseFloat(angles[nrng(angles.length)]);

        makerjs.model.rotate(stick_model, angle);
//        stick_model.origin = [c*piece_width+piece_width*.5-stick_width*.5, -r*piece_height-piece_width*.5-stick_width*.5];
        const origin = [-stick_width*.5, -stick_width*.5];

        const side = rotation_options[angle];
        const overlap = 1;
        let offset = [0, 0];

        if(side === "top") {
          offset[0] += avgX(edge1);
          offset[1] -= maxY(edge1)+overlap;
        } else if(side === "bottom") {
          offset[0] += avgX(edge3);
          offset[1] -= minY(edge3)-overlap;
        } else if(side === "left") {
          offset[0] += maxX(edge4)+overlap;
          offset[1] -= avgY(edge4);
        } else if(side === "right") {
          offset[0] += minX(edge2)-overlap;
          offset[1] -= avgY(edge2);
        }

        origin[0] += offset[0];
        origin[1] += offset[1];

        stick_model.origin = origin;

        let outline_dup = clone(outline_model);
        makerjs.model.combineSubtraction(stick_model, outline_dup);

        const stick_vector = {
          models: {
            stick: stick_model,
            outline: outline_dup
          }
        };
//        stick_vector.origin = [0,0];

        stick_vector.origin = [ -offset[0], -offset[1] ];
        makerjs.model.rotate(stick_vector, -angle-90);

        const stick_simple_output = makerjs.exporter.toSVGPathData({ models: [ stick_vector ] }, false, [0,0]);
        const stick_adjusted = spo(stick_simple_output, kerf*.5, { bezierAccuracy: .001 });
        const outline_adjusted = spo(pts.join(" "), kerf*.5, { bezierAccuracy: .001 });
//        const stick_adjusted = stick_simple_output;
//        const outline_adjusted = pts.join(" ");

        const stick_adjusted_model = makerjs.importer.fromSVGPathData(stick_adjusted, { bezierAccuracy: .001 });
        const outline_adjusted_model = makerjs.importer.fromSVGPathData(outline_adjusted, { bezierAccuracy: .001 });

        const output = makerjs.exporter.toSVGPathData({ models: [ outline_adjusted_model ] }, false, [0,0]);
        const stick_output = makerjs.exporter.toSVGPathData({ models: [ stick_adjusted_model ] }, false, [0,0]);

        if(!outline) {
          console.log("Couldn't generate outline for " + r + ", " + c);
          pieces.push(<g key={r + "," + c} transform={"translate(" + (0*c) + ", " + (0*r) +")"}><path d={pts.join(" ")} fill="url(#mypattern)" strokeWidth={strokeWidth} stroke="black"/></g>)
        }
//              "translate(" + (puzzle_width+10*(cols-1)) + "," + ((stick_width+5)*c+(stick_width+5)*cols*r+margin) + ")"
//              "rotate(" + (angle+90)+ ", " + (offset[0]) + "," + (-offset[1]) + ")" +
//              " translate(" + (offset[0]) + ", " + (-offset[1]) + ")"
        pieces.push(
          <g key={r + "," + c}>
            <g transform={ "translate(" + (10*c) + "," + (10*r) + ")"}>
              { raster ? <path d={output} fill="url(#mypattern)"/> : null }
              { vector ? <path d={output} fill="none" strokeWidth={strokeWidth} stroke="black"/> : null }
            </g>
            <g transform={
              "translate(" + (puzzle_width+10*(cols-1)) + "," + ((stick_width+5)*c+(stick_width+5)*cols*r+margin) + ")"
            }>
              { raster ? <path d={stick_output} fill="url(#mypattern)"/> : null }
              { vector ? <path d={stick_output} fill="none" strokeWidth={strokeWidth} stroke="black"/> : null }
            </g>
          </g>);
      }
    }

    return (
      <svg width={"18in"} height={"4in"} viewBox={"0 0 " + width + " " + height} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        { raster ? 
        <defs>
          <pattern id="mypattern" width={puzzle_width} height={puzzle_height} patternUnits="userSpaceOnUse">
            <image x={0} y={0} width={puzzle_width} height={puzzle_height} xlinkHref={img}/>
          </pattern>
        </defs>
        : null }
        { image ? <image x={0} y={0} width={width} height={height} xlinkHref={image}/> : null }
        <g transform={"translate(" + (margin+strokeWidth*.5) + ", " + (margin+strokeWidth*.5) + ")"}>
          {pieces}
        </g>
      </svg>
    );
  }
}

export default PuzzleSVG;
