// TODO: get rid of innerHTML
// TODO: On pause, the timer also updates with the default value
// TODO: Make sure relax mode is working as well
// TODO: Decrease the vertical space between the session/break lengths and the numbers
// TODO: Where is the -2 minutes coming from
// TODO: Maybe create a fullReset function
// TODO: Make it so that when I change the time on buttons increaseRest or decreaseRest, the clock is updated with the correct thing
// TODO: What if I make it possible only to change work when rest is running, and change rest if work is running
// TODO: Annie's Help - Improve Colors

// For the Future: Have init() function. maybe I do have it already.

var restColor = '#E2C10B';
var workColor = '#00ADB5';

var display = document.getElementById('timer-display');
var displayStatus = document.getElementById('status');
var startBtn = document.getElementById('button-start');
var pauseBtn = document.getElementById('button-pause');
var resetBtn = document.getElementById('button-reset');
var moreWorkBtn = document.getElementById('more-work');
var lessWorkBtn = document.getElementById('less-work');
var moreRestBtn = document.getElementById('more-rest');
var lessRestBtn = document.getElementById('less-rest');
var displayUserWork = document.getElementById('user-work-display');
var displayUserRest = document.getElementById('user-rest-display');

var canvas = document.getElementById('pomodoro-display-canvas');
var ctx = canvas.getContext('2d');

var devicePixelRatio = window.devicePixelRatio || 1,
    backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                         ctx.mozBackingStorePixelRatio ||
                         ctx.msBackingStorePixelRatio ||
                         ctx.oBackingStorePixelRatio ||
                         ctx.backingStorePixelRatio || 1;

var ratio = devicePixelRatio / backingStoreRatio;

if (typeof auto === 'undefined') {
        auto = true;
    }

if (auto && devicePixelRatio !== backingStoreRatio) {
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;

  canvas.width = canvasWidth * ratio;
  canvas.height = canvasHeight * ratio;
  canvas.style.width = canvasWidth + 'px';
  canvas.style.height = canvasHeight + 'px';

  ctx.scale(ratio, ratio);
}

var progressArc,
    canvasWidth = 400,
    canvasHeight = 400,
    centerX = 200,
    centerY = 200;

// Find a quick way to calculate the number of seconds in a given
var work = 25;
var rest = 5;

function getTotalSeconds(minutes, seconds) {
  return minutes * 60 + seconds;
}

function getSecFromObj(timeObj) {
  return timeObj.min * 60 + timeObj.sec;
}

function getMinSec(seconds) {
  // console.log(`SECONDS from getMinSec - ${seconds}`);
  var min = Math.floor(seconds / 60);
  var sec = seconds - min * 60;

  //careful because now min is a number, sec is a string
  if (sec < 10) {
    sec = "0" + sec;
  }

  // console.log(`MIN from getMinSec - ${min}`);
  // console.log(`SEC from getMinSec - ${sec}`);

  return {
    min: min,
    sec: sec
  }
}

var runningTimer;
var timer = {
  isRunning: false,
  initWork: 25,
  initRest: 5,
  userWork: 25,
  userRest: 5,
  isWork: true,
  // currMin: 0,
  // currSec: 0,
  // currTimeObj: {
  //   min: 0,
  //   sec: 0
  // },
  secondsLeft: 0,
  displayTime: function(timeObj) {
    var timeDisplayed = timeObj.min + " : " + timeObj.sec;
  },
  getIntoResetPotision: function() {
    var resetTime = getMinSec(this.getCorrectStartTime());
    this.displayTime(resetTime);
  },
  getCorrectStartTime: function() {
    if (timer.secondsLeft) {
      return timer.secondsLeft;
    } else {
      var workOrRest = timer.isWork ? timer.userWork : timer.userRest;
      return getTotalSeconds(workOrRest, 0);
    }
    // convert into seconds? or into the MinSec object and return to the function.
  },
  run: function(seconds) {
    timer.isRunning = true;

    // time to Start from in seconds.
    var startTimeSeconds = timer.getCorrectStartTime();
    // console.log("CORRECT START TIME IN SECONDS IS: " + startTimeSeconds);
    var startTime = getMinSec(startTimeSeconds);
    // console.log("START TIME INFO WE'RE CHECKING");
    // console.log("Start Time MINS: " + startTime.min);
    // console.log("Start Time SECS: " + startTime.sec);

    var currentTime = startTime;
    var timeDisplayed = "";
    var secondsLeft = startTimeSeconds;
    // var secondsLeft = getSecFromObj(currentTime);

    runningTimer = setInterval(function() {
      // stop the timer if the time has passed.
      if (secondsLeft === 0) {
        clearInterval(runningTimer); // this works, but then has to go to rest instead of just stopping
        // change to restMode
        timer.isWork = !timer.isWork;
        timer.run();
      }

      // This block is to display the current time on the timer.
      currentTime = getMinSec(secondsLeft);
      timer.displayTime(currentTime);

      updateCanvas(secondsLeft, currentTime);
      secondsLeft -= 1;
      // Testing
      timer.secondsLeft = secondsLeft;
    }, 1000);

  },
  pause: function() {
    // if clicked once, stops the timer,
    timer.isRunning = false;
    clearInterval(runningTimer);
    // if clicked twice, continues running it
  },
  reset: function() {
    timer.isRunning = false;
    clearInterval(runningTimer);
    timer.secondsLeft = 0;
    timer.getIntoResetPotision();
  },
  getMinSec: function(mins) {
    return 5; // TEMP
  },
  increaseWork: function() {
    timer.userWork++;
    displayUserWork.innerHTML = timer.userWork;
    if (timer.isWork) {
      timer.reset();
      updateCanvas();
    }
  },
  decreaseWork: function() {
    // if (!timer.isRunning) {
      timer.userWork--;
      if (timer.userWork <= 0) {
        timer.userWork = 1;
      }
      displayUserWork.innerHTML = timer.userWork;

    // NEW IF
    if (timer.isWork) {
      timer.reset();
      updateCanvas();
    }

  },
  increaseRest: function() {
      timer.userRest++;
      displayUserRest.innerHTML = timer.userRest;

    if (!timer.isWork) { // do I need timer.isRunning here?
      timer.reset();
      updateCanvas();
    }
  },
  decreaseRest: function() {
      timer.userRest--;
      if (timer.userRest <= 0) {
        timer.userRest = 1;
      }
      displayUserRest.innerHTML = timer.userRest; // change to innerText?

    if (!timer.isWork) {
      timer.reset();
      updateCanvas();
    }

  }
}

// Attach Event Listeners to Buttons
startBtn.addEventListener("click", function() {
  // Read
  // Have a function to read the current mins and seconds.
  // Check if the timer is already running. if so either block the button, or start over every time it is pressed
  if (!timer.isRunning) {
    timer.run(25); // HERE SOME CHECK AS TO WHAT TIME SHOULD IT GET FED
    // Here also update the canvas with the right length of the arc and the time.
  }
  setTimeout(5000); // do I need this?
});

pauseBtn.addEventListener("click", function() {
  timer.pause();
});

resetBtn.addEventListener("click", function() {
  timer.reset();
  updateCanvas(); // check
});

// work buttons
moreWorkBtn.addEventListener("click", function() {
  timer.increaseWork();
});

lessWorkBtn.addEventListener("click", function() {
  timer.decreaseWork();
});

// rest buttons
moreRestBtn.addEventListener("click", function() {
  timer.increaseRest();
});

lessRestBtn.addEventListener("click", function() {
  timer.decreaseRest();
});

canvas.addEventListener("click", function() {
  if (timer.isRunning) {
    timer.pause();
  } else {
    timer.run(timer.userWork);
  }
});

// Working with canvas

function drawCanvas() {
  // draw the circle
  var circle = new Path2D();
  ctx.fillStyle = "#EEEEEE";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#EEEEEE";

  // arc(x, y, radius, startAngle, endAngle, anticlockwise)
  circle.arc(canvasWidth/2, canvasHeight/2, 150, 0, Math.PI*2, true); // Outer circle
  ctx.stroke(circle);
  // console.log('the draw function gets called');

  ctx.font = "48px PT Mono";
  if (timer.isWork) {
    ctx.fillText("Focus", centerX, 120);
  } else {
    ctx.fillStyle = restColor;
    ctx.fillText("RELAX", centerX, 120);
  }

  // on top of the circle put the type of activity
  // add time in the center?
}

function initCanvas() {
  var circle = new Path2D();
  ctx.textAlign = 'center';
  ctx.fillStyle = "#EEEEEE";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#EEEEEE";
  // ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

  //ctx.beginPath();
  circle.arc(canvasWidth / 2, canvasHeight / 2,150, 0, Math.PI*2, true); // Outer circle
  ctx.stroke(circle);
  // console.log('the draw function gets called');

  ctx.font = "48px PT Mono";
  if (timer.isWork) {
    ctx.fillText("Focus", centerX, 120);
  } else {
    ctx.fillText("RELAX!", centerX, 120);
  }

  ctx.font = "72px PT Mono";
  ctx.fillText(timer.initWork, centerX, centerY + 30);
}

function updateCanvas(secondsLeft, timeObj) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCanvas();
  // full circle is 2 PI.
  if (timer.isWork) {
    var secondsOverall = timer.userWork * 60;
    ctx.fillStyle = workColor;
    ctx.strokeStyle = workColor;
  } else {
    var secondsOverall = timer.userRest * 60;
    ctx.fillStyle = restColor;
    ctx.strokeStyle = restColor;
  }
  // // console.log("SECONDS LEFT WHEN UPDATING CANVAS: " + secondsLeft);
  // // console.log("SECONDS OVERALL WHEN UPDATING CANVAS: " + secondsOverall);

  var secondsPassed = secondsOverall - secondsLeft;
  var percentageToDisplay = secondsPassed / secondsOverall;
  // what is the current number of Seconds overall
  var arcPartToShow = Math.PI * 2 * percentageToDisplay; // since we are showing what's done not what's left

  // console.log("percentageToDisplay: " + percentageToDisplay);
  if (!timer.isWork) {
    // console.log("The timer has just changed to RELAX");
  }
  // console.log("Arc part to show: " + arcPartToShow);

  ctx.lineWidth = 10;

  progressArc = new Path2D(); // check below

  if (arcPartToShow == 2 * Math.PI) {
    arcPartToShow = 0.001;
  }
  progressArc.arc(canvasWidth / 2, canvasHeight / 2, 150, -Math.PI/2, arcPartToShow - Math.PI/2, false);
  ctx.stroke(progressArc);

  // show time
  var timeDisplayedOnCanvas;
  if (timer.isRunning) {
    timeDisplayedOnCanvas = timeObj.min + ":" + timeObj.sec;
  } else {
    if (timer.isWork) {
      timeDisplayedOnCanvas = timer.userWork;
    } else {
      timeDisplayedOnCanvas = timer.userRest;
    }
  }

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.font = "72px PT Mono";
  ctx.fillText(timeDisplayedOnCanvas, centerX, centerY + 30); // change 30 to halfHeight of the time

  //
}

// then with time fill it with the right amount of color

function init() {
  initCanvas();
}


document.addEventListener("DOMContentLoaded", function(event) {
  init();
});




//
