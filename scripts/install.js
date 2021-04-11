$(document).ready(function() {

  $("#install").click(function() {

    if (device == 'ios') {
      $("#install-popup img").removeClass("icon").addClass("demo");
      // <-- check ios version (navigator.userAgent)
      $("#install-popup img").attr("src","assets/install/ios12.gif");
      $("#install-popup h1").remove();
      $("#install-popup button").remove();

      alert(navigator.userAgent);
    }

  });

});
