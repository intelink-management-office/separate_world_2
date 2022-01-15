"use strict";

var assetsPathUrsula = 'https://copenhagencontemporary.org/wp-content/themes/CC20_artworks/ursula/'; //Set the path to assets folder

function setUsulasArtwork() {
  console.log('setting ursula');
  var artwork_ursula_file = 'src/dark.php';

  if ($('body').hasClass('is_sunrise')) {
    artwork_ursula_file = 'src/light.php';
  }

  $('<iframe />').addClass('no_inception'); // Create an iframe element

  $('<iframe />', {
    name: 'ursula_iframe_' + artwork_ursula_file,
    id: 'frame1',
    class: 'no_inception',
    src: assetsPathUrsula + artwork_ursula_file
  }).appendTo('body').on('load', function () {
    $('body').addClass('playing_ursula');
  });
}
"use strict";

var exVideoScreenWidth = 1920;
var exVideoScreenHeight = 1080;
var exWebFrameRect = {
  x: 643.0,
  y: 435.0,
  width: 634.0,
  height: 401.0
};
var assetsPath = 'https://copenhagencontemporary.org/wp-content/themes/CC20_artworks/exonemo/assets'; //Set the path to assets folder

var ex_mode = 'SUNRISE'; // Which video you play? 'SUNRISE' or 'SUNSET'
//var assetsPath = './assets';

var exBGImageURL = {
  sunrise: assetsPath + '/RISE_BG.jpg',
  sunset: assetsPath + '/SET_BG.jpg',
  sunriseMob: assetsPath + '/MOB_RISE_BG.jpg',
  sunsetMob: assetsPath + '/MOB_SET_BG.jpg'
};
var exVideoURL = {
  sunrise: assetsPath + '/SUNRISE.mp4',
  sunset: assetsPath + '/SUNSET.mp4',
  sunriseMob: assetsPath + '/MOBRISE.mp4',
  sunsetMob: assetsPath + '/MOBSET.mp4'
};
var exInitZoomRatio = 1;
var exFinalZoomRetio = 1;
var exCount = 0;
var exIncrements;
var exBgOffsetX, exBgOffsetY;
var exMovFileName;
var exVideoSource;
var exVideoObject;
var exVideoEnded = false;
var exVideoWillEnd = false;
var exEasing;
var exLoopId; //var ex_mode = "SUNRISE";

var exIsMob = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

if (!exIsMob) {
  exIsMob = /iPhone|iPad|iPod/i.test(navigator.platform);
}

$(document).ready(function () {
  /*
  setTimeout(function(){
    ex_start();
  }, 5000);
  */
});

function ex_createVideoObject() {
  if (exIsMob && window.innerWidth < window.innerHeight) {
    exVideoScreenWidth = 1080;
    exVideoScreenHeight = 1920;
    exWebFrameRect = {
      x: 357.0,
      y: 786.0,
      width: 382.0,
      height: 705.0
    };

    if (ex_mode == 'SUNRISE') {
      exMovFileName = exVideoURL.sunriseMob;
    } else {
      exMovFileName = exVideoURL.sunsetMob;
    }
  } else {
    // Desktop
    if (ex_mode == 'SUNRISE') {
      exMovFileName = exVideoURL.sunrise;
    } else {
      exMovFileName = exVideoURL.sunset;
    }
  }

  // console.log(ex_mode); // Create Video Object

  exVideoSource = document.createElement('source');
  exVideoSource.src = exMovFileName;
  exVideoSource.type = 'video/mp4';
  exVideoObject = document.createElement('video');
  exVideoObject.setAttribute('width', exVideoScreenWidth);
  exVideoObject.setAttribute('height', exVideoScreenHeight);
  exVideoObject.setAttribute('id', 'ex_video');
  exVideoObject.setAttribute('muted', 'muted');
  exVideoObject.muted = 'muted';
  exVideoObject.setAttribute('playsinline', 'playsinline');
  exVideoObject.setAttribute('autoplay', 'true');
  exVideoObject.setAttribute('preload', 'auto');
  exVideoObject.appendChild(exVideoSource);
  exVideoObject.setAttribute('style', 'position:relative; z-index: -1; background-color:black;');
}

function ex_start(ex_mode_param) {
  ex_mode = ex_mode_param;
  ex_createVideoObject();
  ex_init(); // Mobile: Stop Click event to prevent user jump to other page for 10 sec.

  if (exIsMob) {
    //console.log('Stop Event');
    var stopEvent = function stopEvent(e) {
      e.stopImmediatePropagation();
      setTimeout(function () {
        //console.log('Cancel Stopping Event');
        $(window).off('click', stopEvent);
      }, 10000);
      return false;
    };

    $(window).on('click', stopEvent);
  }

  exVideoObject.play();
  $('#ex_video').on('ended', function () {
    exVideoEnded = true;
    setTimeout(function () {
      setUsulasArtwork();
    }, 5000); //location.reload();
  });
  exEasing = bezier(0.21, 0.64, 0.55, 0.80);
  var video_op_count = 0;
  var voTimer = setInterval(function () {
    video_op_count += 0.05;
    $('#ex_video').css('opacity', video_op_count);

    if (video_op_count > 1) {
      video_op_count = 0;
      $('#ex_video').css('opacity', 1);
      clearInterval(voTimer);
    }
  }, 50);
  exIncrements = 0.003;
  exLoopId = window.requestAnimationFrame(ex_zoom);
}

function ex_init() {
  var scrollY = window.pageYOffset;
  $('body').wrap('<div id="ex_wrap" style="position:absolute; margin: 0px; overflow:auto; background-color: white;"></div>');
  $('#ex_wrap').wrap('<div id="ex_bg" style="position:fixed; overflow: hidden; background-color:black; margin: 0px;"></div>');
  $('#ex_bg').wrap('<div id="ex_bbg" style="position:fixed; width:100%; height:100%; background-color:black;"></div>');
  $('#ex_bg').append(exVideoObject);

  if (!exIsMob) {
    var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

    if (!isSafari) {
      $('#ex_wrap').css('-webkit-box-reflect', 'below 50px -webkit-gradient(linear, right top, right bottom, from(transparent), color-stop(40%, transparent), to(rgba(255, 255, 255, 0.08))');
    }
  }

  if (exIsMob) {
    if (ex_mode == "SUNRISE") {
      $('#ex_video').css('background-image', 'url(' + exBGImageURL.sunriseMob + ')');
    } else {
      $('#ex_video').css('background-image', 'url(' + exBGImageURL.sunsetMob + ')');
    }
  } else {
    if (ex_mode == "SUNRISE") {
      $('#ex_video').css('background-image', 'url(' + exBGImageURL.sunrise + ')');
    } else {
      $('#ex_video').css('background-image', 'url(' + exBGImageURL.sunset + ')');
    }
  }

  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  exInitZoomRatio = screenWidth / exWebFrameRect.width;
  exInitZoomRatio = Math.floor(exInitZoomRatio * 100) / 100;
  exFinalZoomRetio = screenWidth / exVideoScreenWidth;
  $('#ex_bg').css({
    width: exVideoScreenWidth + 'px',
    height: exVideoScreenHeight + 'px'
  });
  $('#ex_wrap').css({
    left: exWebFrameRect.x + 'px',
    top: exWebFrameRect.y + 'px',
    width: exWebFrameRect.width * exInitZoomRatio + 'px',
    height: exWebFrameRect.height * exInitZoomRatio + 'px',
    transformOrigin: 'top left',
    transform: 'scale(' + 1 / exInitZoomRatio + ')'
  });
  $('#ex_wrap').scrollTop(scrollY);
  exBgOffsetX = -exWebFrameRect.x;
  exBgOffsetY = -exWebFrameRect.y;
  var bgWidth = exVideoScreenWidth * exInitZoomRatio;
  var bgHeight = exVideoScreenHeight * exInitZoomRatio;
  $('#ex_bg').css({
    transformOrigin: 'top left',
    transform: 'scale(' + exInitZoomRatio + ') translate(' + exBgOffsetX + 'px, ' + exBgOffsetY + 'px)'
  });
}

var ex_zoom = function ex_zoom() {
  var diff = exFinalZoomRetio - exInitZoomRatio;
  var ease = exCount;
  var newZoom = exInitZoomRatio + diff * ease;
  newZoom = Math.floor(newZoom * 1000) / 1000;
  var easeRev = exEasing(1 - ease);
  var zoomOutVideoHeight = exVideoScreenHeight * exFinalZoomRetio;
  var lastBGHeight = (window.innerHeight - zoomOutVideoHeight) / (2 * exFinalZoomRetio);
  var newOffsetX = exBgOffsetX * easeRev;
  var newOffsetY = exBgOffsetY * easeRev + lastBGHeight * ease; //if (exIncrements>0) {

  $('#ex_bg').css({
    transform: 'scale(' + newZoom + ') translate(' + newOffsetX + 'px, ' + newOffsetY + 'px)'
  }); //}

  $('#ex_wrap').css({
    filter: 'blur(' + exCount + 'px)',
    opacity: 1.0 - exCount / 10.0
  });

  if (exIncrements < 0) {
    if (exCount < 0.3) {
      var whiteOutOp = exCount * 3 - 0.1;
    }

    $('#ex_video').css({
      opacity: whiteOutOp
    });
    $('#ex_wrap').css('-webkit-box-reflect', 'none');
  }

  exCount += exIncrements;

  if (exCount > 1.0) {
    if (exIncrements != 0) {}

    exIncrements = 0;
    exCount = 1;
  } else if (exCount < 0) {
    exCount = 0;
    exIncrements = 0;
    setTimeout(function () {
      //location.reload();
      window.cancelAnimationFrame(exLoopId);
      var scrollY = $('#ex_wrap').scrollTop();
      $('#ex_bg').unwrap();
      $('#ex_wrap').unwrap();
      $('body').unwrap();
      $('#ex_bbg').fadeOut();
      $('#ex_bg').fadeOut();
      $('#ex_wrap').fadeOut();
      $('#ex_video').fadeOut();
      window.scrollTo(0, scrollY);
    }, 100);
  }
  /*
  if (exVideoEnded) {
    exIncrements = -0.05;
    exVideoEnded = false;
  } else {
    console.log('Video Playing:' + exVideoObject.currentTime + '/' + exVideoObject.duration);
  }
  */


  if (!exVideoWillEnd) {
    if (exVideoObject.duration > 20 && exVideoObject.currentTime + 3 > exVideoObject.duration) {
      exIncrements = -0.007;
      exVideoWillEnd = true;
      $('#ex_bg').css('background-color', 'white');
    }
  }

  exLoopId = window.requestAnimationFrame(ex_zoom);
};

var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;
var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
var float32ArraySupported = typeof Float32Array === 'function';

function A(aA1, aA2) {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1;
}

function B(aA1, aA2) {
  return 3.0 * aA2 - 6.0 * aA1;
}

function C(aA1) {
  return 3.0 * aA1;
} // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.


function calcBezier(aT, aA1, aA2) {
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
} // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.


function getSlope(aT, aA1, aA2) {
  return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
}

function binarySubdivide(aX, aA, aB, mX1, mX2) {
  var currentX,
      currentT,
      i = 0;

  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;

    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

  return currentT;
}

function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
  for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
    var currentSlope = getSlope(aGuessT, mX1, mX2);

    if (currentSlope === 0.0) {
      return aGuessT;
    }

    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }

  return aGuessT;
}

function LinearEasing(x) {
  return x;
}

function bezier(mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  } // Precompute samples table


  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX(aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }

    --currentSample; // Interpolate to provide an initial guess for t

    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;
    var initialSlope = getSlope(guessForT, mX1, mX2);

    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing(x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }

    if (x === 1) {
      return 1;
    }

    return calcBezier(getTForX(x), mY1, mY2);
  };
}

;
"use strict";

/* ------------------------------------*\
    VARIABLE DECLARATION
\*------------------------------------*/
var sunrise = {
  all: 0,
  hour: 0,
  minute: 0
};
var sunset = {
  all: 0,
  hour: 0,
  minute: 0
};
;
var is_sunrise = false;
var is_sunset = false;
$(window).on('load', function () {
  /*------------------------------------*\
         CALL TO FUNCTIONS
     \*------------------------------------*/
  if (isHome()) {
    setupHome();
  } else {//e
  }
});
/*------------------------------------*\
GENERAL
\*------------------------------------*/

function setupHome() {
  getStatusOfDay(); // setUsulasArtwork();
} //check if its sunrise, sunset or any other


function getStatusOfDay() {
  var query = window.location.search.substring(1);

  if (query === 'q=no_inception') {
    console.log('Dont do inception');
    return;
  } else {
  }

  var $ACCESS_KEY = '84dfeb2671be7778edee145d6d962933';
  var $LOCATION = 'Kobenhavn'; // no spaces allowed; use %20 for spaces; must be consistent with weatherstack.com documentation

  var $UNITS = 'm'; // m = metric, f = fahrenheit, s = scientific

  var todayDate = new Date().toISOString().slice(0, 10);
  var $weather_data_endpoint = 'https://api.weatherstack.com/historical?access_key=84dfeb2671be7778edee145d6d962933&query=Kobenhavn&units=m&historical_date=' + todayDate;
  var response_data;
  $.ajax({
    url: $weather_data_endpoint,
    // The name of the callback parameter, as specified by the YQL service
    jsonp: "callback",
    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",
    // Work with the response
    success: function success(response) {
      setStatusOfDay(response.historical[todayDate].astro);
    }
  });
}

function setStatusOfDay(astro){
	sunrise['all'] = astro['sunrise'].slice(0,5);
	sunrise['hour'] = astro['sunrise'].slice(0,2);
	sunrise['minute'] = astro['sunrise'].slice(3,5);

	sunset['all'] = astro['sunset'].slice(0,5);
	sunset['hour'] = astro['sunset'].slice(0,2);
	sunset['minute'] = astro['sunset'].slice(3,5);

	console.log("Today's sunrise in CPH will be at: "+ sunrise['hour']+':'+sunrise['minute']+' am.');
	console.log("Today's sunset in CPH will be at: "+ sunset['hour']+':'+sunset['minute']+' pm.');

	var d = new Date().toLocaleString("es-ES", {timeZone: "Europe/Paris"})

	var todayDate = new Date().toLocaleString("es-ES", {timeZone: "Europe/Paris"})
	var todayHours = todayDate.slice(11,13);


	var ampm = 'am';
	if( todayHours > 11){
		ampm = 'pm';
		todayHours = todayHours - 12;
	}
  	var todayMinutes = todayDate.slice(14,16);
	// console.log(todayDate);
	// console.log(todayHours);
	// console.log(todayMinutes);
	console.log("Your current time is: "+ todayHours+':'+todayMinutes+' ' +ampm);

	if(ampm === 'am'){
		if(parseInt(sunrise['hour']) == parseInt(todayHours)){
			if((parseInt(todayMinutes) >= parseInt(sunrise['minute'])) && (parseInt(todayMinutes) <= parseInt(sunrise['minute'])+ 5  )){
				ex_start('SUNRISE');
				$('body').addClass('is_sunrise');
				is_sunrise = true;
			}
		}
	}else if( ampm === 'pm'){
		if(parseInt(sunset['hour']) == parseInt(todayHours)){

			if((parseInt(todayMinutes) >= parseInt(sunset['minute'])) && (parseInt(todayMinutes) <= parseInt(sunset['minute'])+ 5  )){
				ex_start('SUNSET');
				$('body').addClass('is_sunset');
				is_sunset = true;
			}
		}
	}
}
/*------------------------------------*\
jQuery Events
\*------------------------------------*/


$(window).on('scroll', function () {});
/*------------------------------------*\
Page checker
\*------------------------------------*/

function isHome() {
  if ($('body').hasClass('home')) {
    return true;
  }

  return false;
}
//# sourceMappingURL=footer-bundle.js.map
