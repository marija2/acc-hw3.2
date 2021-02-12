// size of the side of a square
// can be changed here manually or by using the slider
var sideSize = 100;

// slider that allows for adjusting the size of the squares
var sizeSlider;
// slider that allows for moving the light across the x axis
var xSlider;
// slider that allows for moving the light across the y axis
var ySlider;

// checked whether the animation should be in progress or sliders are being used
var doAmination = true;

// holds all the pyramids visible on the screen
var pyramids = [];

// used to change color during the animation
var xCosCounter = 0;
var yCosCounter = 3.14 / 2;

// increments value of cosCounter by 0.00001 until it reaches 2pi
// resets value of cosCounter to 0 when 2pi is reached
function incrementCosCounters() {

  if ( xCosCounter >= 2 * PI ) xCosCounter = 0;
  else xCosCounter += 0.0001;

  if ( yCosCounter >= 2 * PI ) yCosCounter = 0;
  else yCosCounter += 0.0001;
}

// holds the coordinates of the center of a pyramid
// render draws the pyramid based on the center and the sideSize
// color is modified based on cosCounter or sliders depending on whether the animation is active or not
class Pyramid {
  constructor ( x, y ) {

    this.xCenter = x;
    this.yCenter = y; 

    this.red = random(200);
    this.green = random(200);
    this.blue = random(200);

    // upper-left point
    this.ulPt = [ x - sideSize / 2, y - sideSize / 2 ];

    // upper-right point
    this.urPt = [ x + sideSize / 2, y - sideSize / 2 ];

    // lower-right point
    this.lrPt = [ x + sideSize / 2, y + sideSize / 2 ];

    // lower-left point
    this.llPt = [ x - sideSize / 2, y + sideSize / 2 ];
  }

  render() {

    // for determining the color of each triangle
    var xShade = 0;
    var yShade = 0;

    // if animation is not active, take value from slider
    if ( !doAmination ) {

      xShade = width / 2 - xSlider.value(); // [-width/2,width/2]
      // have to transform numbers[-width/2,width/2] to [-100,100]
      xShade *= 100 / ( width / 2 );

      yShade = height / 2 - ySlider.value(); // [-height/2,height/2]
       // have to transform numbers[-height/2,height/2] to [-100,100]
      yShade *= 100 / ( height / 2 );
    }
    // if animation is active use cos to change color
    else {
      xShade = cos(xCosCounter) * 100;
      yShade = cos(yCosCounter) * 100;
      incrementCosCounters();
    }

    // up triangle
    fill ( this.red + yShade, this.green + yShade, this.blue + yShade );
    triangle ( this.ulPt[0], this.ulPt[1], this.urPt[0], this.urPt[1], this.xCenter, this.yCenter );
    
    // left triangle
    fill ( this.red + xShade, this.green + xShade, this.blue + xShade );
    triangle ( this.ulPt[0], this.ulPt[1], this.llPt[0], this.llPt[1], this.xCenter, this.yCenter );
    
    // down triangle
    fill ( this.red - yShade, this.green - yShade, this.blue - yShade );
    triangle ( this.lrPt[0], this.lrPt[1], this.llPt[0], this.llPt[1], this.xCenter, this.yCenter );
    
    // right triangle
    fill ( this.red - xShade, this.green - xShade, this.blue - xShade );
    triangle ( this.lrPt[0], this.lrPt[1], this.urPt[0], this.urPt[1], this.xCenter, this.yCenter );
  }
}


function preload() {

  var btn = select("#btn");
  // call startStopAnim when button is pressed
  btn.mousePressed(startStopAnim);
}

// if animation was previosly active, stops animation and displays sliders
// otherwise, starts animation and removes sliders
function startStopAnim() {

  if ( doAmination ) {

    xSlider = createSlider ( 0, width, 0 );
    xSlider.addClass("xySlider");
    xSlider.position ( 60, 200 );

    var d = createDiv();
    d.addClass('verticalSliderHolder');
    d.position(30, 180);
    ySlider = createSlider(0, height, height / 2 );
    ySlider.addClass("xySlider");
    d.child(ySlider); 

    btn.innerHTML = 'I want to go back to the animation';
  }

  else {

    xSlider.remove();
    ySlider.remove();
    btn.innerHTML = 'I want to stop the lightshow and adjust light on my own';
  }

  doAmination = !doAmination;

}

// creates the pyramids which will be seen on the screen
// puts them into an array
function fillArray () {

  for ( var i = 0; i < width; i += sideSize ) {

    for ( var j = 0; j < height; j += sideSize ) {

      pyramids.push ( new Pyramid ( i + sideSize/2, j + sideSize/2 ) );
    }
  }

}

function setup () {

  var animationHolder = createCanvas ( 1000, 1000 );
  animationHolder.style ( 'margin', '60px' );

  sizeSlider = createSlider ( 20, width / 2, sideSize);
  sizeSlider.position ( 350, 80 );
  sizeSlider.addClass('sizeSlider');

  // call updateSize when value in sizeSlider is modified
  sizeSlider.input ( updateSize );

  fillArray();
}

// updates the value of sideSize, removes all old pyramids from the array
// calls fillArray to add pyramids of new size to the array
function updateSize() {

  sideSize = sizeSlider.value();

  while ( pyramids.length ) pyramids.pop();

  fillArray();

}

// calls render for all pyramids 
function draw () {

  background ( 220 );

  for ( var i = 0; i < pyramids.length; ++i ) {
    pyramids[i].render();
  }

}

