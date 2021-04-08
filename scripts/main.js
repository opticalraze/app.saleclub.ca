$(document).ready(function() {

  /* load page data */

  // global variable
  var data;
  const date = Math.floor(Date.now() / 1000); // current timestamp in seconds (is this UTC?)
  const nocache = '?nocache='+date;
  //let arrayRow; // not sure if let is better
  var arrayRow;
  var categories;
  var category = Cookies.get('category');

  $.get('https://saleclub.ca/data/sales.json'+nocache, function(d) {
    //data = JSON.parse(d); works on localhost

    // make json parse work on ghpages
    try { // localhost
        data = JSON.parse(d);
    }
    catch(err) { // ghpages
        data = JSON.stringify(d);
        data = JSON.parse(data);
    }

    //console.log(data);
    categories = data.categories;

    arrayRow = 0;
    data.dod.forEach(function(a) {
      //if (firstLoop) {
      if (arrayRow == 0) {
        $("#dod").append(`<div class="carousel-item active"><a href="${a.link}" target="_blank"><img class="d-block w-100" src="${a.mobile}" alt="${a.brand}"></a></div>`);
        $("#dodIndicators").append(`<li data-target="#carouselExampleIndicators" data-slide-to="${arrayRow}" class="active"></li>`);
        arrayRow++;
      } else {
        $("#dod").append(`<div class="carousel-item"><a href="${a.link}" target="_blank"><img class="d-block w-100" src="${a.mobile}" alt="${a.brand}"></a></div>`);
        $("#dodIndicators").append(`<li data-target="#carouselExampleIndicators" data-slide-to="${arrayRow}"></li>`);
        arrayRow++;
      }
    });

    arrayRow = 0;
    for (const [key, value] of Object.entries(categories)) {

      if (!category && arrayRow == 0) { // if user last category cookie not found set category to first
        category = key; // still need to check if category still exists in case if it would disapear but may just add a no sales available notice
      }

      $("#categories-dropdown").append(`<a class="dropdown-item capitalize change-category" href="#categories" data-value="${key}">${key}</a>`);
      if (category == key){

        $("#categories select").append(`<option selected value="${key}">${key}</option>`);
        $("#categories h3").html(key + " Deals");

        if(value.length){
          value.forEach(function(a) {
            if(a.expires == "" || a.expires>date){    // check if sale is expired
              const brandLogo = a.brand.toLowerCase().replace(/\s+/g, '');

              var expires = "";
              if (a.expires) expires = secondsToDhms(a.expires-date).split(',')[0] + " left";

              // possibly need to check here for specific category types to make ads look different depending on what they are

              $("#category").append(`<div class="card grow sale animate__animated animate__fadeIn"><a class="text-dark" href="${a.link}" target="_blank"><div class="card-img-top"><div class="img" style="background-image:url('${a.picture}')"></div></div><div class="card-body"><p class="card-text">${a.description}</p></div><img class="brand-logo" src="assets/affiliates/${brandLogo}.svg"><p class="label savings bg-danger text-white">${a.sale}</p><p class="label price bg-white"><span class="regular">${a.regular}</span>${a.current}</p><p class="label expire bg-white">${expires}</p></a></div>`);
            }
          });

        } else {
          $("#category").append(`<p class="no-sales">There are currently no ${key} sales.</p>`);
        }

      } else {
        $("#categories select").append(`<option value="${key}">${key}</option>`);
      }

      arrayRow++;

    }



  });


  /* handle category change */

  $("#categories select").change(function() {
    category = $(this).val(); // set category
    Cookies.set('category', category, { expires: 30 }); // set category cookie
    $("#categories h3").html(category + " Deals");
    $("#category").empty(); // empty div
    if (categories[category].length) {
      categories[category].forEach(function(a) {  // fill div with new category's items
        if(a.expires == "" || a.expires>date){    // check if sale is expired
          const brandLogo = a.brand.toLowerCase().replace(/\s+/g, '');

          // possibly need to check here for specific category types to make ads look different depending on what they are

          $("#category").append(`<div class="card grow sale animate__animated animate__fadeIn"><a class="text-dark" href="${a.link}" target="_blank"><div class="card-img-top"><div class="img" style="background-image:url('${a.picture}')"></div></div><div class="card-body"><p class="card-text">${a.description}</p></div><img class="brand-logo" src="assets/affiliates/${brandLogo}.svg"><p class="label savings bg-danger text-white">${a.sale}</p><p class="label price bg-white"><span class="regular">${a.regular}</span>${a.current}</p><p class="label expire bg-white">${a.expires}</p></a></div>`);
        }
      });
    } else {
     $("#category").append(`<p class="no-sales">There are currently no ${category} sales.</p>`);
   }
  });

  $(document).on('click', '.change-category', function(){
    category = $(this).data("value");
    Cookies.set('category', category, { expires: 30 }); // set category cookie
    $("#categories select").val(category);  // change category in the selection
    $("#categories h3").html(category + " Deals");
    $("#category").empty(); // empty div
    if (categories[category].length) {
      categories[category].forEach(function(a) {  // fill div with new category's items
        if(a.expires == "" || a.expires>date){    // check if sale is expired
          const brandLogo = a.brand.toLowerCase().replace(/\s+/g, '');

          // possibly need to check here for specific category types to make ads look different depending on what they are

          $("#category").append(`<div class="card grow sale animate__animated animate__fadeIn"><a class="text-dark" href="${a.link}" target="_blank"><div class="card-img-top"><div class="img" style="background-image:url('${a.picture}')"></div></div><div class="card-body"><p class="card-text">${a.description}</p></div><img class="brand-logo" src="assets/affiliates/${brandLogo}.svg"><p class="label savings bg-danger text-white">${a.sale}</p><p class="label price bg-white"><span class="regular">${a.regular}</span>${a.current}</p><p class="label expire bg-white">${a.expires}</p></a></div>`);
        }
      });
    } else {
     $("#category").append(`<p class="no-sales">There are currently no ${category} sales.</p>`);
   }
  });


  /*---------------------------*/



  /* handle popups */

  // about popup
    $("#about-popup").on('click', function(e){
      if (e.target !== this)
        return;
      else{
        $(this).hide();

        //$('body').addClass('bg-danger').removeClass('bg-white');
        //$('#statusbar').addClass('bg-danger').removeClass('bg-white');
        $('body').css('overflow', 'auto');    // enable scrolling
        $('body').css('position', 'unset');   // enable scrolling
      }
    });
    $("#show-about-popup").on("click", function() {
      $("#about-popup").show();

      //$('body').addClass('bg-white').removeClass('bg-danger');
      //$('#statusbar').addClass('bg-white').removeClass('bg-danger');
      $('body').css('overflow', 'hidden');  // disable scrolling
      $('body').css('position', 'fixed');   // disable scrolling
    });
    $("#close-about-popup").on('click', function(e){
      $('#about-popup').fadeOut(200);

      //$('body').addClass('bg-danger').removeClass('bg-white');
      //$('#statusbar').addClass('bg-danger').removeClass('bg-white');
      $('body').css('overflow', 'auto');    // enable scrolling
      $('body').css('position', 'unset');   // enable scrolling
    });


    // notice popup
      $("#notice-popup").on('click', function(e){
        if (e.target !== this)
          return;
        else{
          $(this).hide();

          //$('body').addClass('bg-danger').removeClass('bg-white');
          //$('#statusbar').addClass('bg-danger').removeClass('bg-white');
          $('body').css('overflow', 'auto');    // enable scrolling
          $('body').css('position', 'unset');   // enable scrolling
        }
      });
      $("#show-notice-popup").on("click", function() {
        $("#notice-popup").show();

        //$('body').addClass('bg-white').removeClass('bg-danger');
        //$('#statusbar').addClass('bg-white').removeClass('bg-danger');
        $('body').css('overflow', 'hidden');  // disable scrolling
        $('body').css('position', 'fixed');   // disable scrolling
      });
      $("#close-notice-popup").on('click', function(e){
        $('#notice-popup').fadeOut(200);

        //$('body').addClass('bg-danger').removeClass('bg-white');
        //$('#statusbar').addClass('bg-danger').removeClass('bg-white');
        $('body').css('overflow', 'auto');    // enable scrolling
        $('body').css('position', 'unset');   // enable scrolling
      });



      // contact popup
        $("#contact-popup").on('click', function(e){
          if (e.target !== this)
            return;
          else{
            $(this).hide();

            //$('body').addClass('bg-danger').removeClass('bg-white');
            //$('#statusbar').addClass('bg-danger').removeClass('bg-white');
            $('body').css('overflow', 'auto');    // enable scrolling
            $('body').css('position', 'unset');   // enable scrolling
          }
        });
        $("#show-contact-popup").on("click", function() {
          $("#contact-popup").show();

          //$('body').addClass('bg-white').removeClass('bg-danger');
          //$('#statusbar').addClass('bg-white').removeClass('bg-danger');
          $('body').css('overflow', 'hidden');  // disable scrolling
          $('body').css('position', 'fixed');   // disable scrolling
        });
        $("#close-contact-popup").on('click', function(e){
          $('#contact-popup').fadeOut(200);

          //$('body').addClass('bg-danger').removeClass('bg-white');
          //$('#statusbar').addClass('bg-danger').removeClass('bg-white');
          $('body').css('overflow', 'auto');    // enable scrolling
          $('body').css('position', 'unset');   // enable scrolling
        });



        // adjusting text sizes
        jQuery("H1").fitText();


        /* handle splash */
        const splash = document.querySelector('#splash');
        splash.addEventListener('animationend', () => {
          // do something
          $('#splash').removeClass('animate__jackInTheBox').addClass('done').delay(1000).queue(function(){
            $('#splash').addClass('animate__pulse animate__infinite');
          });


        });


});

function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600*24));
  var h = Math.floor(seconds % (3600*24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}


/* splash functions */
(function($){

  'use strict';
    $(window).on('load', function () {
        if ($(".splash").length > 0)
        {
          waitForElementToDisplay("#splash.done",function(){
            //console.log('u');
            $(".splash").fadeOut("slow");
            $('body').css('overflow','auto');
            //$('body').css('overflow','auto').addClass("bg-danger").removeClass("bg-white");
            //$('#topbar').css('z-index','2000');
          },200,10000);
        }
    });
})(jQuery)

function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}





/* prevent hash anchor tag jumping */
/* <![CDATA[ */
( function( $ ) {
   $( 'a[href="#"]' ).click( function(e) {
      e.preventDefault();
   } );
} )( jQuery );
/* ]]> */

/* extra style */

// disable right click
document.oncontextmenu = new Function("return false;");
