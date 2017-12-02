import React, { Component } from 'react';
import seedrandom from 'seedrandom';
import makerjs from 'makerjs';
import clone from 'clone';

import img from './Logo3x3.svg';

const pt2str = ([x,y]) => (x +" " + y);
const lerp = (pt1,pt2,t) => ([pt1[0]*(1-t)+pt2[0]*t, pt1[1]*(1-t)+pt2[1]*t]);
const add = (pt1,pt2) => ([pt1[0]+pt2[0], pt1[1]+pt2[1]]);

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

class PuzzleSVGBasic extends Component {
  render() {
    const {
      seed,
      piece_width,
      piece_height,
      strokeWidth,
      margin,
      cols,
      rows
    } = this.props;

    const rng = seedrandom(seed);
    const crng = (m) => (m*(rng()-.5));

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

    let horizontal_edges = [];
    for(let r = 0; r < rows+1; r++) {
      let row = [];
      horizontal_edges.push(row);
      for(let c = 0; c < cols; c++) {
        let pt1 = points[r][c];
        let pt2 = points[r][c+1];

        if(r === 0 || r === rows) {
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

    let vertical_edges = [];
    for(let r = 0; r < rows; r++) {
      let row = [];
      vertical_edges.push(row);
      for(let c = 0; c < cols+1; c++) {
        let pt1 = points[r][c];
        let pt2 = points[r+1][c];

        if(c === 0 || c === cols) {
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
    let puzzle_width = piece_width*cols;
    let puzzle_height = piece_height*rows;
    let width = puzzle_width+strokeWidth+margin*2 + 10*cols+60;
    let height = puzzle_height+strokeWidth+margin*2 + 60*rows;
    //let width = 18*25.4;
    //let height = 6*25.4;
   // let height = 10*25.4;

    let pieces = [];

    for(let r = 0; r < rows; r++) {
      for(let c = 0; c < cols; c++) {
//        if(!(r == 0 && c == 0)) continue;
        let pts = [];

        var edge1 = horizontal_edges[r][c];
        var edge2 = vertical_edges[r][c+1];
        var edge3 = horizontal_edges[r+1][c].slice().reverse();
        var edge4 = vertical_edges[r][c].slice().reverse();

        pts.push("M " + pt2str(edge1[0]));
        appendEdge(pts, edge1)
        appendEdge(pts, edge2)
        appendEdge(pts, edge3)
        appendEdge(pts, edge4)
        pts[pts.length-1] = "Z";

        let outline = pts.join(" ");
        let outline_model = makerjs.importer.fromSVGPathData(outline, { bezierAccuracy: .001 });

        const stick_height = 2.875*25.4;
        const stick_width = .375*25.4;

        const attachment_width = .7;
        const attachment_height = 13;
        const attachment_spacing = 1;
        var stick_model = {
          models: {
            stick: new makerjs.models.Oval(stick_width, stick_height),
          }
        };

        var attachment_model = {
          models: {
            attachment_left: new makerjs.models.Rectangle(attachment_width, attachment_height),
            attachment_right: new makerjs.models.Rectangle(attachment_width, attachment_height)
          }
        };

        attachment_model.models.attachment_left.origin = [ attachment_spacing, stick_height-stick_width*.5 ];
        attachment_model.models.attachment_right.origin = [ stick_width-attachment_width-attachment_spacing, stick_height-stick_width*.5 ];

        makerjs.model.rotate(stick_model, -45);
        makerjs.model.rotate(attachment_model, -45);

//        const corner = nrng(4);
        const corner = 0;
        switch(corner) {
          case 0: // lower left
            stick_model.origin = [-.5-.25*Math.sqrt(2)*stick_width-.5*Math.sqrt(2)*stick_height+edge4[0][0],-.5+.25*Math.sqrt(2)*stick_width-.5*Math.sqrt(2)*stick_height-edge4[0][1]];
            break;
          case 1: // lower right
            makerjs.model.rotate(stick_model, 90);
            makerjs.model.rotate(attachment_model, 90);
            stick_model.origin = [.5-.25*Math.sqrt(2)*stick_width+.5*Math.sqrt(2)*stick_height+edge3[0][0],-.5-.25*Math.sqrt(2)*stick_width-.5*Math.sqrt(2)*stick_height-edge3[0][1]];
            break;
          case 2: // upper right
            makerjs.model.rotate(stick_model, 180);
            makerjs.model.rotate(attachment_model, 180);
            stick_model.origin = [.5+.25*Math.sqrt(2)*stick_width+.5*Math.sqrt(2)*stick_height+edge2[0][0],.5-.25*Math.sqrt(2)*stick_width+.5*Math.sqrt(2)*stick_height-edge2[0][1]];
            break;
          default: // upper left
            makerjs.model.rotate(stick_model, -90);
            makerjs.model.rotate(attachment_model, -90);
            stick_model.origin = [-.5+.25*Math.sqrt(2)*stick_width-.5*Math.sqrt(2)*stick_height+edge1[0][0],.5+.25*Math.sqrt(2)*stick_width+.5*Math.sqrt(2)*stick_height-edge1[0][1]];
            break;
        }

        attachment_model.origin = clone(stick_model.origin);

        let outline_output = makerjs.exporter.toSVGPathData(outline_model, false, [0, 0]);

        makerjs.model.combineUnion(outline_model, attachment_model);
        makerjs.model.combineUnion({ models: [ outline_model, attachment_model] }, stick_model);

        let output = makerjs.exporter.toSVGPathData({ models: [ attachment_model, outline_model, stick_model ] }, false, [0,0]);

        if(!outline) {
          console.log("Couldn't generate outline for " + r + ", " + c);
          pieces.push(<g key={r + "," + c} transform={"translate(" + (0*c) + ", " + (0*r) +")"}><path d={pts.join(" ")} fill="url(#mypattern)" strokeWidth={strokeWidth} stroke="black"/></g>)
        }

        pieces.push(
          <g key={r + "," + c}>
            <g transform={"translate(" + (c*10+60) + "," + r*60 + ")"}>
              <path d={outline_output} fill="url(#mypattern)"/>
              <path d={output} fill="none" strokeWidth={strokeWidth} stroke="black"/>
            </g>
          </g>);
      }
    }

    return (
      <svg width="100%" viewBox={"0 0 " + width + " " + height} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mypattern" width={puzzle_width} height={puzzle_height} patternUnits="userSpaceOnUse">
            <image x={0} y={0} width={puzzle_width} height={puzzle_height} xlinkHref={img}/>
          </pattern>
        </defs>
        <g transform={"translate(" + (margin+strokeWidth*.5) + ", " + (margin+strokeWidth*.5) + ")"}>
          {pieces}
        </g>
      </svg>
    );
  }
}

export default PuzzleSVGBasic;
