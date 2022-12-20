// Dec 20, 2022 - Mostly working except for:
//TODO - Center the screen and make sure it is responsive
//TODO - Change the SetInterval code to requestFrameAnimation
//TODO - Write a modal window for the Game Over routine, including buttons
//TODO - Randomize ball movement at the start of each turn,
//TODO   right now, it can get stuck so that computer can't return the ball.
//TODO - Add sound effects

var canvas;
var canvasContext;
// This controls the starting ball speed
var ballSpeedX = 5;
var ballSpeedY = 5;

// Starting position of the paddles
var paddle1Y = 250;
var paddle2Y = 250;

var playerScore = 0;
var computerScore = 0;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const WINNING_SCORE = 3;
const BALL_SIZE = 12;
var gameOver = false;
	
function calculateMousePos(event){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = event.clientX - rect.left - root.scrollLeft;
	var mouseY = event.clientY - rect.top - root.scrollTop - (PADDLE_HEIGHT/2);
	return{
		x:mouseX,
		y:mouseY
	};	
}

// Function to restart the game when the mouse is clicked
function handleMouseClick(){
	playerScore = 0;
	computerScore = 0;
	gameOver = false;
}

window.onload = function() {
	//console.log("Hello!there...");
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	var framesPerSecond = 30;
	
	// Ball starts in center of the screen
	ballX = canvas.width/2;
	ballY = canvas.height/2;
	
	/* Example of an in-line function */
	setInterval(function() {
			drawEverything();
			moveEverything();
	},1000/framesPerSecond);	
	
	// Listen for mouse movement or click
	canvas.addEventListener('mousemove',
			function(event) {
				var mousePos = calculateMousePos(event);				
				paddle1Y = mousePos.y;	
			});
	canvas.addEventListener('mousedown', handleMouseClick);
}

// Reset the ball to the center of the canvas
function ballReset(){	
	ballX = canvas.width/2;
	ballY = canvas.height/2;
	if(playerScore == WINNING_SCORE || computerScore == WINNING_SCORE){				
		gameOver = true;		
	}
}
	
// Computer controls the right paddle
function computerMovement(){
	// Use the center of the paddle, not the top
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if( paddle2YCenter < ballY - 35){
		paddle2Y += 12;
	}
	else if (paddle2YCenter > ballY + 35){		
		paddle2Y -= 12;
	}	
}

function moveEverything(){
	// First, check to see if the game is over
	// Stop if the winning score has been reached
	if(gameOver){
		// Set up the scoring text
		canvasContext.font = "50px serif";
		canvasContext.fillText( computerScore, 600, 100);
		canvasContext.fillText( playerScore, 200, 100);
		return;	
	}
	
	// If still playing, move the right paddle
	computerMovement();
	
	//TODO Can this be randomized?	
	// This controls the starting angle of the ball
	ballX += ballSpeedX;
	ballY -= ballSpeedY;
	
	// Bounce off the right hand paddle or reset if missed
	if( ballX > canvas.width - PADDLE_WIDTH){
		if(ballY > paddle2Y &&
		   ballY < paddle2Y + PADDLE_HEIGHT){
				ballSpeedX = -ballSpeedX;

				// This code will vary the ball return depending on where on the paddle it hits.
				var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
				ballSpeedY = deltaY * 0.35;
		} else {
				playerScore++;
				ballReset();
		}	
	}
	
	// Bounce off the left paddle or reset if missed
	if( ballX < PADDLE_WIDTH){
		if(ballY > paddle1Y &&
		   ballY < paddle1Y + PADDLE_HEIGHT){
				ballSpeedX = -ballSpeedX;
			
				// This code will vary the ball return depending on where on the paddle it hits.
				var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
				ballSpeedY = deltaY * 0.35;
		} else {
				computerScore++;
				ballReset();
		}	
	}
	
	// Bounce off the bottom
	if( ballY > canvas.height - (BALL_SIZE/2)){
		ballSpeedY = -ballSpeedY;
	}
	// Bounce off the top
	if( ballY < BALL_SIZE/2){
		ballSpeedY = -ballSpeedY;		
	}
}
    
function drawEverything() {	
	// Draw the background
	drawRect(0, 0, canvas.width, canvas.height, 'blue');
	
	// Stop if the winning score has been reached
	if(gameOver){
		canvasContext.fillStyle = 'red';
		canvasContext.font = "50px serif";
		canvasContext.fillText( 'GAME OVER!', 250, 300);
		canvasContext.fillStyle = 'yellow';
		canvasContext.font = "20px serif";
		canvasContext.fillText( 'Click to play again.', 300, 550);		
		return;	
	}
	
	// Draw the paddle on the left side
	drawRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');	
	
	// Draw the paddle on the right side
	drawRect(canvas.width - (PADDLE_WIDTH), paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
	
	// Draw the net
	for( var i = 0;i<canvas.height; i+= 40){
		drawRect(canvas.width/2 - 1, i, 2, 20, 'white');
	}
	
	//Draw the ball	
	drawCircle(ballX, ballY, BALL_SIZE, 'green');
	
	// Set up the scoring text
	canvasContext.font = "50px serif";
	canvasContext.fillText( computerScore, 600, 100);
	canvasContext.fillText( playerScore, 200, 100);
	
}

// My function to draw the rectangles
function drawRect(topLeftX, topLeftY, width, height, color){
	canvasContext.fillStyle =color;
	canvasContext.fillRect(topLeftX,topLeftY, width, height);
}
// My function to draw a circle	
function drawCircle(centerX, centerY, radius, color){
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();	
}	