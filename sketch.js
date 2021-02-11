// size of the side of a square
// can be changed here manually or by using the slider
var sideSize = 100;

// the color of the side of the pyramid when the light is directly above it
var centerColor = 128;

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
var cosCounter = 0;

// increments value of cosCounter by 0.00001 until it reaches 2pi
// resets value of cosCounter to 0 when 2pi is reached
function incrementCosCounter() {

  if ( cosCounter >= 2 * PI ) cosCounter = 0;
  else cosCounter += 0.0001;
}

// holds the coordinates of the center of a pyramid
// render draws the pyramid based on the center and the sideSize
// color is modified based on cosCounter or sliders depending on whether the animation is active or not
class Pyramid {
  constructor ( x, y ) {

    this.xCenter = x;
    this.yCenter = y; 
  }

  render() {
    // upper-left point
    var x1 = this.xCenter - sideSize / 2;
    var y1 = this.yCenter - sideSize / 2;

    // upper-right point
    var x2 = this.xCenter + sideSize / 2;
    var y2 = this.yCenter - sideSize / 2;

    // lower-right point
    var x3 = this.xCenter + sideSize / 2;
    var y3 = this.yCenter + sideSize / 2;

    // lower-left point
    var x4 = this.xCenter - sideSize / 2;
    var y4 = this.yCenter + sideSize / 2;

    // for determining the color of each triangle
    var xDistanceFromCenter = 0;
    var yDistanceFromCenter = 0;

    // if animation is not active, take value from slider
    if ( !doAmination ) {
      xDistanceFromCenter = width / 2 - xSlider.value(); // [-width/2,width/2]
      yDistanceFromCenter = height / 2 - ySlider.value(); // [-height/2,height/2]
    }
    // if animation is active use cos to change color
    else {
      xDistanceFromCenter = cos(cosCounter) * width / 2;
      incrementCosCounter();
    }

    // have to transform numbers[-width/2,width/2] to [-100,100]
    xDistanceFromCenter *= 100 / ( width / 2 );

    // have to transform numbers[-height/2,height/2] to [-100,100]
    yDistanceFromCenter *= 100 / ( height / 2 );

    // up triangle
    fill ( centerColor + yDistanceFromCenter );
    triangle ( x1, y1, x2, y2, this.xCenter, this.yCenter );
    
    // left triangle
    fill ( centerColor + xDistanceFromCenter );
    triangle ( x1, y1, x4, y4, this.xCenter, this.yCenter );
    
    // down triangle
    fill ( centerColor - yDistanceFromCenter);
    triangle ( x3, y3, x4, y4, this.xCenter, this.yCenter );
    
    // right triangle
    fill ( centerColor - xDistanceFromCenter);
    triangle ( x3, y3, x2, y2, this.xCenter, this.yCenter );
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

