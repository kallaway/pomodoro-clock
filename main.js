// Have a variable that stores the full 25 minutes.
// Have a var that stores 5 minutes of rest.
// Buttons are only available for clicking when the timer is stopped.

// Maybe internally only deal with seconds? Then display when needed but don't conver them anywhere in the app?

// TODO: get rid of innerHTML
// TODO: alternate background for work/rest

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

// Find a quick way to calculate the number of seconds in a given
var work = 25;
var rest = 5;

// two similar functions??

function getTotalSeconds(minutes, seconds) {
  return minutes * 60 + seconds;
}

function getSecFromObj(timeObj) {
  return timeObj.min * 60 + timeObj.sec;
}

function getMinSec(seconds) {
  console.log(`SECONDS from getMinSec - ${seconds}`);
  var min = Math.floor(seconds / 60);
  var sec = seconds - min * 60;

  //careful because now min is a number, sec is a string
  if (sec < 10) {
    sec = "0" + sec;
  }

  console.log(`MIN from getMinSec - ${min}`);
  console.log(`SEC from getMinSec - ${sec}`);

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
  currMin: 0,
  currSec: 0,
  secondsLeft: 0,
  displayTime: function(timeObj) {
    var timeDisplayed = timeObj.min + " : " + timeObj.sec;
    display.innerHTML = timeDisplayed;  // change?
  },
  getIntoResetPotision: function() {
    var resetTime = getMinSec(this.getCorrectStartTime()); // change this
    console.log("RESET TIME IS: ");
    console.log(resetTime);
    this.displayTime(resetTime);

  },
  getCorrectStartTime: function() {
    // if there is currMin or currSec time available use that,
    if (timer.secondsLeft) {
      return timer.secondsLeft;
    } else {
      var workOrRest = timer.isWork ? timer.userWork : timer.userRest;
      return getTotalSeconds(workOrRest, 0);
    }
    // convert into seconds? or into the MinSec object and return to the function.
  },
  run: function(seconds) { // does it have to receive any arguments?
    timer.isRunning = true;

    // time to Start from in seconds.
    var startTimeSeconds = timer.getCorrectStartTime();
    console.log("CORRECT START TIME IN SECONDS IS: " + startTimeSeconds);
    var startTime = getMinSec(startTimeSeconds);
    console.log("START TIME INFO WE'RE CHECKING");
    console.log("Start Time MINS: " + startTime.min);
    console.log("Start Time SECS: " + startTime.sec);

    // var startTime = getMinSec(startTimeSeconds);
    // Check if mins and secs are already defined on the screen.
    // if (timer.currMin || timer.currSec) { // if either of these is defined
    //   // If yes, use those numbers,
    //   var totalCurrSeconds = getTotalSeconds(timer.currMin, timer.currSec);
    //   startTime = getMinSec(totalCurrSeconds);
    // } else {
    //   // If no, use the standard ones.
    //   startTime = getMinSec(seconds);
    // }
    var currentTime = startTime; // maybe this is not needed? (the startTime var)
    var timeDisplayed = "";
    var secondsLeft = startTimeSeconds;
    // var secondsLeft = getSecFromObj(currentTime);

    // or workTimer VS restTimer
    runningTimer = setInterval(function() {
      // stop the timer if the time has passed.
      if (secondsLeft === 0) {
        clearInterval(runningTimer); // this works, but then has to go to rest instead of just stopping
        // change to restMode
        timer.isWork = !timer.isWork;
        // if timer.isWork === false, then change the background color to the color of rest
      }
      // it doesn't work because currentTime gets an object in.

      // This block is to display the current time on the timer.
      currentTime = getMinSec(secondsLeft);
      timer.displayTime(currentTime);

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
    if (!timer.isRunning) {
      timer.userWork++;
      displayUserWork.innerHTML = timer.userWork;
      display.innerHTML = timer.userWork;
    }
  },
  decreaseWork: function() {
    if (!timer.isRunning) {
      timer.userWork--;
      displayUserWork.innerHTML = timer.userWork;
      display.innerHTML = timer.userWork;
    }
  },
  increaseRest: function() {
    if (!timer.isRunning) {
      timer.userRest++;
      displayUserRest.innerHTML = timer.userRest;
    }
  },
  decreaseRest: function() {
    if (!timer.isRunning) {
      timer.userRest--;
      displayUserRest.innerHTML = timer.userRest;
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
  }

  setTimeout(5000);

});

pauseBtn.addEventListener("click", function() {
  timer.pause();
});

resetBtn.addEventListener("click", function() {
  timer.reset();
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








//
