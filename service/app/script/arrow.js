$(document).ready(function(){
    $("#navi").click(function(){
      $("#navi .fa-chevron-down").toggleClass("rtoate180");
      $("#navigation").stop().slideToggle(500);
    });
  });