// ColoredPoint.js (c) 2012 matsuda
// got some help from:
// Drawing images on canvas: https://codepen.io/fawority/pen/aVqWey 
// Layering canvas: https://stackoverflow.com/questions/3008635/html5-canvas-element-multiple-layers


// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';


let canvas;
let gl;
let a_Position;
let u_Size;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

let jester;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  
  
  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}


function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_FragColor
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_FragColor
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identity = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identity.elements);
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let saved = [];

let g_selectedAlpha = 1.0;
let g_globalXAngle = 0;
let g_globalYAngle = 0;
let g_globalZAngle = 0;
let g_zoomScale = 0.5;

let g_selectedColor=[1.0,0.0,0.0,g_selectedAlpha];
let g_selectedType= POINT;
let g_selectedSize = 5.0;
let g_selectedSegs = 10;

function addActionsForHtmlUI(){
  // Button events
  // document.getElementById('green').onclick = function() { 
  //   g_selectedColor = [0.0, 1.0, 0.0, g_selectedAlpha]; 
  //   updateSliders();
  // };
  // document.getElementById('red').onclick = function() {
  //   g_selectedColor = [1.0, 0.0, 0.0, g_selectedAlpha]; 
  //   updateSliders(); 
  // };
  // document.getElementById('clear').onclick = function() { 
  //     g_shapesList = []; 
  //     renderScene();
  //   };


  // document.getElementById('pointButton').onclick = function() { g_selectedType = POINT; }
  // document.getElementById('triButton').onclick = function() { g_selectedType = TRIANGLE; }
  // document.getElementById('cirButton').onclick = function() { g_selectedType = CIRCLE; }

  

  document.getElementById("xangleSlide").addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1){
      g_globalXAngle = this.value; 
      renderScene(); 
      //console.log("pp")
    }
  });

  document.getElementById("yangleSlide").addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1){
      g_globalYAngle = this.value; 
      renderScene(); 
      //console.log("pp")
    }
  });

  document.getElementById("zangleSlide").addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1){
      g_globalZAngle = this.value; 
      renderScene(); 
      //console.log("pp")
    }
  });

  document.getElementById("zoomSlide").addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1){
      g_zoomScale = this.value/50; 
      renderScene(); 
      //console.log("pp")
    }
  });
  
  document.getElementById("pelvisSlide").addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1){
      jester.rotateAppendage("pelvis", this.value, 'Z');
      renderScene();
      //jester.render();
      //console.log("pp")
    }
  });

  document.getElementById("uchestSlide").addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1){
      jester.rotateAppendage("uchest", this.value, 'Z');
      renderScene();
    }
  });

  document.getElementById("headSlide").addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1){
      jester.rotateAppendage("head", this.value, 'Z');
      renderScene();
    }
  });

  let appendages = ["uparm", "elbow", "foarm", "hand", "thigh", "knee", "calf", "foot"];
  let ax = ['X', 'Y', 'Z'];
  appendages.forEach((a) => {
    ax.forEach(x => {
      let lname = 'l'+a;
      let rname = 'r'+a;
      document.getElementById(lname+x+"Slide").addEventListener('mousemove', function(ev) {
        if (ev.buttons == 1){
          jester.rotateAppendage(lname, this.value, x);
          renderScene();
        }
      });
      document.getElementById(rname+x+"Slide").addEventListener('mousemove', function(ev) {
          if (ev.buttons == 1){
            jester.rotateAppendage(rname, this.value, x);
            renderScene();
          }
      });
    });
  })
  // document.getElementById("alphaSlide").addEventListener('mouseup', function() {
  //   g_selectedAlpha = this.value/100; 
  //   g_selectedColor[3] = g_selectedAlpha;
  // });
  // document.getElementById("segsSlide").addEventListener('mouseup', function() {g_selectedSegs = this.value; });

}

function updateSliders(){
  document.getElementById("redSlide").value = g_selectedColor[0]*100;
  document.getElementById("greenSlide").value = g_selectedColor[1]*100;
  document.getElementById("blueSlide").value = g_selectedColor[2]*100;
}

function main() {
  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI(); 

  // Register function (event handler) to be called on a mouse press
  // canvas.onmousedown = click;

  // canvas.onmousemove = function(ev) { if (ev.buttons == 1 && !houseMode && !susMode) click(ev); };
    
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  // enable alpha blending and blendfunctions
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  jester = new Jester();
  renderScene();
}


function convertToCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x, y];
}

// var g_shapesList = [];
  

function click(ev) {
  let [x, y] = convertToCoordinatesEventToGL(ev);

    addPoint(x, y);

  renderScene();
}

function randomizeColor(i, j){
  g_selectedColor[0] = Noise.perlin((g_selectedColor[0]+0.1)/0.9, 3.9*i, 3.9*j);
  g_selectedColor[1] = Noise.perlin(3.9*i, (g_selectedColor[1]+0.1)/0.9, 3.9*j);
  g_selectedColor[2] = Noise.perlin(3.9*i, 3.9*j, (g_selectedColor[2]+0.1)/0.9);
  
  updateSliders();
}

function addPoint(x, y, vertices=[]){
  // Create a new point
  let point;
  switch(g_selectedType){
    case POINT:
      point = new Point([x, y], g_selectedColor.slice(), g_selectedSize);
      break;
      
    case TRIANGLE:  
      point = new Triangle([x, y], g_selectedColor.slice(), g_selectedSize, vertices);
      break;

    case CIRCLE:
      point = new Circle([x, y], g_selectedColor.slice(), g_selectedSize, g_selectedSegs);
      break;

    default:
      point = new Point([x, y], g_selectedColor.slice(), g_selectedSize);
  }

  g_shapesList.push(point);
}

function push(){
  saved.push(g_selectedColor, g_selectedSize, g_selectedType, g_selectedSegs, g_selectedAlpha);
}

function pop(){
  g_selectedAlpha = saved.pop();
  g_selectedSegs = saved.pop();
  g_selectedType = saved.pop();
  g_selectedSize = saved.pop();
  g_selectedColor = saved.pop();
}

function renderScene(){
  var startTime = performance.now();
 
  var globalRotMat = new Matrix4()
  globalRotMat.rotate(g_globalXAngle, 1, 0, 0);
  globalRotMat.rotate(g_globalYAngle, 0, 1, 0);
  globalRotMat.rotate(g_globalZAngle, 0, 0, 1);
  globalRotMat.scale(g_zoomScale, g_zoomScale, g_zoomScale);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);


  const START=0.75;
  const RAD=1;
  for (let i = 0; i < 7; i++){
    let M1 = new Matrix4();
    M1.translate(-1.5, lerp(i, 0, 6, START, START-2*RAD), 0);
    M1.scale(0.3, 0.3, 0.3);
    drawCube([1,1,1,1], M1);
  }
  
  //jester.rotateAppendage("head", 45/36, 0, 0, 1);

  jester.render();
  
  // // drawCube([1, 0.7, 0.2, 1], M);

  // let p1 = new Prism(3);
  // p1.setSideLength(1);
  // //p1.render();

  // let p2 = new Prism(4, 1, [1, 0.1, 1, 1]);
  // p2.translate(0.2, 0, 0);
  
  // p2.rotate(70, 0, 0, 1);
  
  // p2.setSideLength(0.5);
  // p2.render();

  // let M_torso = new Matrix4();

  
  // //let M_torso = new Matrix4();
  // M_torso.translate(0, -0.4, 0);

  // let M_lchest = new Matrix4(M_torso);

  // M_torso.scale(0.5, 0.5, 0.5);
  // let p3 = new Prism(10, 1.0, [1, 0, 1, 1], M_torso);
  // p3.setMaxWidth(1);
  // p3.scaleFace("b", 2);
  // //p3.setHeight(1.7);
  // p3.render();


  // M_lchest.translate(0, 0.4, 0);
  // //M_lchest.rotate(45, 0, 0, 1);

  // let M_uchest = new Matrix4(M_lchest);

  // M_lchest.scale(0.5, -0.5, 0.5);
  // let p4 = new Pyramid(10, 1.0, [1, 0, 1, 1], M_lchest);
  // p4.setMaxWidth(1);
  // p4.scaleFace(1.2);
  // p4.render();
  

  // M_uchest.translate(0, 0.45, 0);

  // M_uchest.scale(0.5, 0.4, 0.5);
  // let p5 = new Prism(10, 1.0, [1, 0, 1, 1], M_uchest);
  // p5.setMaxWidth(1);
  // p5.scaleFace("b", 1.2);
  // p5.scaleFace("t", 0.5);
  // //p5.setHeight();
  // p5.render();
  

  //let p6 = new Prism(6);
  // var len = g_shapesList.length;
  // for(var i = 0; i < len; i++) {
  //   g_shapesList[i].render();
  // }
  //this.drawTriangle3D([-1.0, 0.0, 0.0,     -0.5, -1.0, 0.0,    0.0, 0.0, -1.0]);
  
  // var body = new Cube([1.0, 0.0, 0.0, 1.0]);
  // body.translate(-0.25, -0.1, 0.0);
  // // body.scale(0.5, 0.5, 0.5);
  // body.render();

  // var left = new Cube([1,1,0,1]);
  // left.scale(0.25, 0.25, 0.25);

  // drawCube([1,0,1,1],left.matrix);
  // left.rotate(45, 0, 0, 1);
  // drawCube([0,1,0,1],left.matrix);
  // left.translate(0.7, 0.7, 0.0);

  // left.render();

  var duration = performance.now() - startTime;
  sendTextToHTML(
                " ms: " + Math.floor(duration) + 
                " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmllm = document.getElementById(htmlID);
  if (!htmllm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmllm.innerHTML = text;
}