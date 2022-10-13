// ColoredPoint.js (c) 2012 matsuda
// got some help from:
// Drawing images on canvas: https://codepen.io/fawority/pen/aVqWey 
// Layering canvas: https://stackoverflow.com/questions/3008635/html5-canvas-element-multiple-layers


// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let houseMode = false;
let susMode = false;
let rainbowMode = false;


let canvas;
let gl;
let a_Position;
let u_Size;
let u_FragColor;

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

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }


  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
}

let g_selectedHouseHeight = 0.5;
let g_selectedHouseWidth = 0.5;

let saved = [];

let g_selectedAlpha = 1.0;
let g_selectedColor=[1.0,0.0,0.0,g_selectedAlpha];
let g_selectedSize = 5.0;
let g_selectedType = POINT;
let g_selectedSegs = 10;

function addActionsForHtmlUI(){
  // Button events
  document.getElementById('green').onclick = function() { 
    g_selectedColor = [0.0, 1.0, 0.0, g_selectedAlpha]; 
    updateSliders();
    rainbowMode = false; 
    sendTextToHTML("Randomize Color: Off", "rainMode");
  };
  document.getElementById('red').onclick = function() {
    g_selectedColor = [1.0, 0.0, 0.0, g_selectedAlpha]; 
    updateSliders(); 
    rainbowMode = false; 
    sendTextToHTML("Randomize Color: Off", "rainMode");
  };
  document.getElementById('clear').onclick = function() { 
      g_shapesList = []; 
      renderAllShapes();
    };


  document.getElementById('pointButton').onclick = function() { g_selectedType = POINT; }
  document.getElementById('triButton').onclick = function() { g_selectedType = TRIANGLE; }
  document.getElementById('cirButton').onclick = function() { g_selectedType = CIRCLE; }

  
  document.getElementById('houseButton').onclick = function() { 
    houseMode = !houseMode;
    susMode = false;
    if (houseMode){
      sendTextToHTML("house" , "mode");
      sendTextToHTML("House Width: ", "widthmode");
    } else {
      sendTextToHTML("draw", "mode");
    }

    
  }
  document.getElementById("hWidthSlide").addEventListener('mouseup', function() {g_selectedHouseWidth = this.value/10; });
  document.getElementById("hHeightSlide").addEventListener('mouseup', function() {g_selectedHouseHeight = this.value/10; });
  
  document.getElementById('dinoButton').onclick = function() { drawDinosaur(); }
  document.getElementById('susButton').onclick = function() { 
    susMode = !susMode;
    houseMode = false;
    if (susMode){
      sendTextToHTML("SUS" , "mode");
      sendTextToHTML("Sus level: ", "widthmode");
    } else {
      sendTextToHTML("draw", "mode");
    }
  }
  document.getElementById('rainButton').onclick = function() { 
    rainbowMode = !rainbowMode; 
    sendTextToHTML((rainbowMode) ? "Randomize Color: On" : "Randomize Color: Off", "rainMode");
  }
  
  document.getElementById("redSlide").addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; });
  document.getElementById("greenSlide").addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; });
  document.getElementById("blueSlide").addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; });
  document.getElementById("sizeSlide").addEventListener('mouseup', function() {g_selectedSize = this.value; });
  document.getElementById("alphaSlide").addEventListener('mouseup', function() {
    g_selectedAlpha = this.value/100; 
    g_selectedColor[3] = g_selectedAlpha;
  });
  document.getElementById("segsSlide").addEventListener('mouseup', function() {g_selectedSegs = this.value; });

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
  canvas.onmousedown = click;

  canvas.onmousemove = function(ev) { if (ev.buttons == 1 && !houseMode && !susMode) click(ev); };
    
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // enable alpha blending and blendfunctions
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //drawAmogus(0,0,0.5,0.75);
  
  renderAllShapes();
}


function convertToCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x, y];
}

var g_shapesList = [];
  
// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function click(ev) {
  let [x, y] = convertToCoordinatesEventToGL(ev);
  if (rainbowMode)
    randomizeColor(x, y);
  if (houseMode)
    drawHouse(x, y, g_selectedHouseWidth, g_selectedHouseHeight);
  else if (susMode){
    drawAmogus(x, y, g_selectedHouseWidth, g_selectedHouseHeight);
  } else{
    addPoint(x, y);
  }

  renderAllShapes();
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

function renderAllShapes(){
  var startTime = performance.now();
 
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
  var duration = performance.now() - startTime;
  sendTextToHTML("numdot:" + len + 
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


function drawDinosaur(){
  push();
  // Body
  g_selectedType = TRIANGLE;
  g_selectedSize = 1;
  g_selectedColor = [0.5, 0.5, 0.9, 1.0];

  // Body
  addPoint(0, 0, [-0.5 , -0.5 , -0.2 ,  0.25, -0.2 , -0.5 ]);
  addPoint(0, 0, [-0.15, -0.5 , -0.15,  0.25,  0.15,  0.25]);
  addPoint(0, 0, [-0.1 , -0.5 ,  0.04, -0.15,  0.2 , -0.5 ]);


  // Legs
  g_selectedColor = [0.0, 1.0, 0.0, 1.0];
  addPoint(0, 0, [-0.3 , -0.8 , -0.3 , -0.55, -0.2 , -0.55]);
  addPoint(0, 0, [ 0.05, -0.8 ,  0.05, -0.55,  0.15, -0.55]);
  g_selectedColor = [0.0, 0.5, 0.5, 1.0];
  addPoint(0, 0, [ 0.1 , -0.8 ,  0.15, -0.65,  0.2 , -0.8 ]);
  addPoint(0, 0, [-0.25, -0.8 , -0.2 , -0.65, -0.15, -0.8 ]);

  // Feet
  g_selectedColor = [1.0, 1.0, 0.0, 1.0];
  addPoint(0, 0, [-0.3 , -0.85, -0.25, -0.85, -0.3 , -0.95]);
  addPoint(0, 0, [-0.25, -0.85, -0.2 , -0.85, -0.2 , -0.95]);
  addPoint(0, 0, [-0.2 , -0.85, -0.15, -0.85, -0.1 , -0.95]);

  addPoint(0, 0, [ 0.1 , -0.85,  0.05, -0.85,  0.1 , -0.95]);
  addPoint(0, 0, [ 0.1 , -0.85,  0.15, -0.85,  0.2 , -0.95]);
  addPoint(0, 0, [ 0.15, -0.85,  0.2 , -0.85,  0.3 , -0.95]);

  // Tail
  g_selectedColor = [0.0, 0.5, 0.5, 1.0];
  addPoint(0, 0, [-0.52, -0.55, -0.77, -0.77, -0.4 , -0.55]);
  addPoint(0, 0, [-0.95 , -0.55, -0.8 , -0.73, -0.75, -0.68]);
  

  // Head
  g_selectedColor = [0.0, 1.0, 0.5, 1.0];
  addPoint(0, 0, [ 0.15,  0.7 , -0.15,  0.3 ,  0.15,  0.3 ]);
  
  g_selectedColor = [0.0, 0.5, 0.5, 1.0];
  addPoint(0, 0, [ 0.2 ,  0.7 ,  0.4 ,  0.7 ,  0.2 ,  0.3 ]);
  g_selectedColor = [0.0, 1, 0.5, 1.0];
  addPoint(0, 0, [ 0.46,  0.7 ,  0.7 ,  0.5 ,  0.35,  0.5 ]);
  addPoint(0, 0, [ 0.25,  0.3 ,  0.33,  0.45,  0.55,  0.3 ]);

  // Hands
  g_selectedColor = [1.0, 0.5, 0.0, 1.0];
  addPoint(0, 0, [ 0.08,  -0.05,  0.14,  0.05,  0.35,  0.1 ]);
  g_selectedColor = [1.0, 0.7, 0.0, 1.0];
  addPoint(0, 0, [ 0.28,   0.02,  0.38,  0.07,  0.42, -0.1 ]);

  // g_selectedSize = 4;
  // for (let j = -1; j < 1; j += 0.1){
  //   drawSegment(-1, j, 1, j, false);
  //   drawSegment(j, -1, j, 1, false);
  
  // }
  pop();

  renderAllShapes();
}

function drawHouse(xi, yi, w, h){
  let x = xi - w/2;
  let y = yi - h/2;
  // let w = 0.8;
  // let h = 0.8;
  Noise.shuffleP();
  
  // walls
  drawSegment(x+0.1*w, y,       x+0.9*w, y      );
  drawSegment(x+0.9*w, y,       x+0.9*w, y+h*0.6);
  drawSegment(x+w,     y+h*0.6, x,       y+h*0.6);
  drawSegment(x+0.1*w, y+h*0.6, x+0.1*w, y      );

  // roof
  drawSegment(x      , y+h*0.6, x+0.5*w, y+h    );
  drawSegment(x+0.5*w, y+h    , x+w    , y+h*0.6);
  
  // door
  drawSegment(x+0.4*w, y      , x+0.4*w , y+h*0.4);
  drawSegment(x+0.6*w, y      , x+0.6*w , y+h*0.4);
  drawSegment(x+0.4*w, y+h*0.4, x+0.6*w , y+h*0.4);

  renderAllShapes();
}

const DEF_SUS_SIZE = 0.5;
function drawAmogus(xi, yi, w, hi){
  let x = xi;
  let y = yi;
  // let w = 0.6;
  let h = 1.25*w;
  let p = (w/DEF_SUS_SIZE < 1.1) ? w/DEF_SUS_SIZE : 1.1;

  Noise.shuffleP();

  // head???
  let [beginx, beginy, currx, curry] = drawArc(x, y, w*0.5, 30, 180, false, true, true, 3.9, 0.1*p);
  
  // // draw backpack
  let [ , , tmpx, tmpy] = drawArc(currx, curry-0.2*w, 0.2*w, 90, 180, true, false, true, 0.2*p);
  [ , , tmpx, tmpy] = drawSegment(tmpx, tmpy, tmpx, tmpy-h*0.2, true, true, 0.02, 0.3*p);
  [ , , tmpx, tmpy] = drawArc(currx, tmpy, 0.2*w, 180, 270, true, false, true, 0.1*p);

  // // legs
  [, , currx, curry] = drawSegment(currx, curry, currx, tmpy, true, true, 0.07, 0.2*p);
  [, , currx, curry] = drawSegment(currx, curry, currx, curry-h*0.1, true, true, 0.02, 0.5*p);
  [, , currx, curry] = drawArc(currx+0.1*w, curry, 0.1*w, 180, 360, false, true, 0.6, 0.2*p);
  [, , currx, curry] = drawSegment(currx, curry, currx, curry+h*0.1, true, true, 0.02, 0.5*p);
  [, , currx, curry] = drawSegment(currx, curry, currx+0.6*w, curry, true, true, 3.9, 0.05*p);
  [, , currx, curry] = drawSegment(currx, curry, currx, curry-h*0.1,  true, true, 0.02, 0.5*p);
  [, , currx, curry] = drawArc(currx+0.1*w, curry, 0.1*w, 180, 360, false, true, 0.6, 0.2*p);
  [, , currx, curry] = drawSegment(currx, curry, currx, curry+h*0.1, true, true, 0.02, 0.5*p);
  
  // // Body???
  [, , currx, curry] = drawSegment(currx, curry, currx, beginy-0.4*w, true, true, 0.02, 0.5*p);
  

  // // mask
  [beginx, , currx, curry] = drawArc(currx-0.05*w, curry+0.2*w, 0.2*w, 270, 462, true, false, 3.9, 0.2*p);
  [, , currx, curry] = drawSegment(currx+0.05*w, curry, currx-0.5*w, curry, true, true, 0.07, 0.5*p);
  [, , currx, curry] = drawArc(currx, curry-0.2*w, 0.2*w, 90, 270, true, false, 3.9, 0.2*p);
  [, , currx, curry] = drawSegment(currx, curry, beginx, curry, true, true, 0.07, 0.5*p);
  
  renderAllShapes();
}