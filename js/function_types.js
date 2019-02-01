var result;

// Regular (Named) function :
function dividedRegular() {
  result = 3 / 4;
  console.log("Regular function in JS: 3 divided by 4 is:", result);
}

dividedRegular();

// Anonymous function:
var dividedAnonymous = function () {
  result = 3 / 4;
  console.log("Anonymous function in JS: 3 divided by 4 is:", result);
}

dividedAnonymous();

// Immediately invoked function expression. It runs as soon as browser finds it:
(function () {
  result = 3 / 4;
  console.log("Immediately invoked function in JS: 3 divided by 4 is:", result);
}())