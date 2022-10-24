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

// 0 nothing, 1 run 2 something else if i have time
// Crazy Meter
let g_animation = 0;



let ax = ['X', 'Y', 'Z'];
let appendages = ["uuparm",  "foarm", "hand", "thigh",  "calf", "foot"];
  
function addActionsForHtmlUI(){
  // document.getElementById("xangleSlide").addEventListener('mousemove', function(ev) {
  //   if (ev.buttons == 1){
  //     g_globalXAngle = this.value; 
  //     renderScene(); 
  //     //console.log("pp")
  //   }
  // });

  // document.getElementById("yangleSlide").addEventListener('mousemove', function(ev) {
  //   if (ev.buttons == 1){
  //     g_globalYAngle = this.value; 
  //     renderScene(); 
  //     //console.log("pp")
  //   }
  // });

  // document.getElementById("zangleSlide").addEventListener('mousemove', function(ev) {
  //   if (ev.buttons == 1){
  //     g_globalZAngle = this.value; 
  //     renderScene(); 
  //     //console.log("pp")
  //   }
  // });

  document.getElementById("zoomSlide").addEventListener('mousemove', function(ev) {
    if (ev.buttons == 1){
      g_zoomScale = this.value/50; 
      renderScene(); 
      //console.log("pp")
    }
  });
  

  document.getElementById("runButton").onclick = function(ev){
    console.log("hello")
    sendTextToHTML("Anim: Run", "anim");
    g_animation = 1;
    jester.runStart();
  }

  document.getElementById("stopButton").onclick = function(ev){
    sendTextToHTML("Anim: None", "anim");
    g_animation = 0;
  }

  ax.forEach(x => {
    let element = document.getElementById("head"+x+"Slide");
    if (element != null)
      element.addEventListener('mousemove', function(ev) {
        if (ev.buttons == 1){
          jester.rotateAppendage("head", this.value, x);
          //renderScene();
        }
      });
  });

  ax.forEach(x => {
    let element = document.getElementById("pelvis"+x+"Slide");
    if (element != null)
      element.addEventListener('mousemove', function(ev) {
        if (ev.buttons == 1){
          jester.rotateAppendage("pelvis", this.value, x);
          //renderScene();
        }
      });
  });

  ax.forEach(x => {
    let element = document.getElementById("lchest"+x+"Slide");
    if (element != null)
      element.addEventListener('mousemove', function(ev) {
        if (ev.buttons == 1){
          jester.rotateAppendage("lchest", this.value, x);
          //renderScene();
        }
      });
  });

  // ax.forEach(x => {
  //   document.getElementById("head"+x+"Slide").addEventListener('mousemove', function(ev) {
  //     if (ev.buttons == 1){
  //       jester.rotateAppendage("head", this.value, x);
  //       renderScene();
  //     }
  //   });
  // });

  appendages.forEach((a) => {
    ax.forEach(x => {
      let lname = 'l'+a;
      let rname = 'r'+a;
      let element = document.getElementById(lname+x+"Slide")
      if (element != null)
        element.addEventListener('mousemove', function(ev) {
          if (ev.buttons == 1){
            jester.rotateAppendage(lname, this.value, x);
            //renderScene();
          }
        });
      element = document.getElementById(rname+x+"Slide");
      if (element != null)
        element.addEventListener('mousemove', function(ev) {
            if (ev.buttons == 1){
              if (x != 'X') 
                jester.rotateAppendage(rname, -this.value, x);
              else 
                jester.rotateAppendage(rname, this.value, x);
              //renderScene();
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
//  document.getElementById("headSlide");

  for (let s in jester.body){
    ax.forEach(x => {

      let element = document.getElementById(s+x+"Slide");
      if (element != null)
        element.value = jester.body[s][x];
    });
  }
}

function main() {
  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI(); 

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;

  canvas.onmousemove = function(ev) { if (ev.buttons == 1) drag(ev); };
    
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  // enable alpha blending and blendfunctions
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  jester = new Jester();
  requestAnimationFrame(tick);
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
let px = 0;
let py = 0;

function click(ev){
  [px, py] = convertToCoordinatesEventToGL(ev);
}

function drag(ev) {
  let [x, y] = convertToCoordinatesEventToGL(ev);
  //console.log(x, y);
  let dy = y-py;
  let dx = px-x;

  g_globalXAngle +=dy;
  g_globalYAngle +=dx;

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
  const NUM_S = 5;
  for (let i = 0; i < NUM_S; i++){
    let M1 = new Matrix4();
    M1.translate(-1.5, lerp(i, 0, NUM_S-1, START, START-2*RAD), 0);
    M1.scale(0.45, 0.45, 0.45);
    drawCube([1,1,1,1], M1);
  }
  //console.log(g_animation);
  //jester.rotateAppendage("head", 45/36, 0, 0, 1);

  jester.render();
  //updateSliders();

  var duration = performance.now() - startTime;
  sendTextToHTML(
                " ms: " + Math.floor(duration) + 
                " fps: " + Math.floor(10000/duration), "numdot");
}


let g_startTime=performance.now()/1000.0;
let g_seconds=performance.now()/1000.0-g_startTime;

function tick(){
  //console.log(performance.now());
  if (g_animation > 0)g_seconds=performance.now()/1000.0-g_startTime;
  switch(g_animation){
    case 1:
      jester.runAnimation();
      break;
  }
  renderScene();
  requestAnimationFrame(tick);
}

function sendTextToHTML(text, htmlID){
  var htmllm = document.getElementById(htmlID);
  if (!htmllm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmllm.innerHTML = text;
}