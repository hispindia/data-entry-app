/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 * 
 */

"use strict";

	
	var totalSteps = $(".steps li").length;

$(".submit").on("click", function(){
  return false; 
});

$(".steps li:nth-of-type(1)").addClass("active");
$(".myContainer .stepperform:nth-of-type(1)").addClass("active");

$(".stepperform").on("click", ".next", function() { 
  $(".steps li").eq($(this).parents(".stepperform").index() + 1).addClass("active"); 
  $(this).parents(".stepperform").removeClass("active").next().addClass("active fadeInLeft");   
});

$(".stepperform").on("click", ".back", function() {  
  $(".steps li").eq($(this).parents(".stepperform").index() - totalSteps).removeClass("active"); 
  $(this).parents(".stepperform").removeClass("active fadeInLeft").prev().addClass("active fadeInLeft"); 
});


/*=========================================================
*     If you won't to make steps clickable, Please comment below code 
=================================================================*/
$(".steps li").on("click", function() {
  var stepVal = $(this).find("span").text();
  $(this).prevAll().addClass("active");
  $(this).addClass("active");
  $(this).nextAll().removeClass("active");
  $(".myContainer .form-container2").removeClass("active fadeInLeft");  
  $(".myContainer .form-container2:nth-of-type("+ stepVal +")").addClass("active fadeInLeft");     
});