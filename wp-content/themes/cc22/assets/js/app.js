// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
	// On-page links
	if (
	  location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
	  && 
	  location.hostname == this.hostname
	) {
	  // Figure out element to scroll to
	  var target = $(this.hash);
	  target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
	  // Does a scroll target exist?
	  if (target.length) {
		// Only prevent default if animation is actually gonna happen
		event.preventDefault();
		$('html, body').animate({
		  scrollTop: target.offset().top
		}, 1000, function() {
		  // Callback after animation
		  // Must change focus!
		  var $target = $(target);
		  $target.focus();
		  if ($target.is(":focus")) { // Checking if the target was focused
			return false;
		  } else {
			$target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
			$target.focus(); // Set focus again
		  };
		});
	  }
	}
});

function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

$(window).scroll(function () {
    $('.footer-logo').each(function () {
        if (isScrolledIntoView(this) === true) {
            $(".header-logo").addClass('footer-visible');
		  } else {
		     $(".header-logo").removeClass('footer-visible');
		  }
    });
});

var lazyLoadInstance = new LazyLoad({
});

var myElement = document.querySelector(".scrollhide");
	var headroom = new Headroom(myElement, {
		"tolerance": 15
	});
headroom.init();

$( function() {
	$( ".accordion" ).accordion({
	collapsible: "true",	
	active: false,
	heightStyle: "content",
	}
	);
} );