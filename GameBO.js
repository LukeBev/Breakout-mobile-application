/*jslint node: true, browser: true */
"use strict";

function GameBO() {

    var canvas = document.getElementById("canvas"),
        topdiv = document.getElementById("thetopdiv"),
        main = document.getElementById("theMain"),
        scoring = 0,
        
        ballR = 4,
        ballX, ballY,
        ballVX = -6, ballVY = -6,
        
        paddleWidth, paddleHeight,
        paddleX, paddleY, 
        paddleVX,
        paddleMoveLeft = 0, paddleMoveRight = 0,
        interval,
        
        blocks = [],
        blockStatus = [],
        
        x, y, z, roll,
        xold, yold, zold, sharp,
        
        frameRate = 34,
        canvasPaint = function () {
        // A function to paint the content of our drawing to the canvas
            
            fitCanvas(main, topdiv, canvas);
       
       
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "black";
            ctx.beginPath();       
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fill();

            ctx.closePath();
       
            drawBall();
            drawBlocks();
            drawPaddle();
            
            setBlockStatus();
            
            paddleMove();
            ballMove();
        };
        
    this.init = function(){
        createBlock();        
    };
    function createBall(){
        var ctx = canvas.getContext("2d");
           
           
            ctx.fillStyle = "orange";
            ctx.lineWidth = 5;
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.arc(ballX,ballY,ballR,0,Math.PI*2,true);
            ctx.stroke();
            ctx.fill();

            ctx.closePath();
            
    }
    function drawBall(){
         var ctx = canvas.getContext("2d");
            ctx.fillStyle = "blue";
            
            ctx.lineWidth = 3;
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.arc(ballX,ballY,ballR,0,Math.PI*2,true); 
            ctx.fill();
            ctx.stroke();

            ctx.closePath();
    }
    function drawPaddle() {

        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
        ctx.fill();
        ctx.closePath();
    }
    
    function paddleMove() {
        updatePaddleDirection();
        if (paddleX <= 8) {
            paddleMoveLeft = 0;
        }
        if (paddleMoveLeft > 0) {
            paddleX -= 8;
          }
         
        
        if ((paddleX + paddleWidth) >= canvas.width -8) {
            paddleMoveRight = 0;
        }
        if (paddleMoveRight > 0) {
            paddleX += 8;
        }

    }
        
    function updatePaddleDirection() {
        if(window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', function(event) {
            var x = event.accelerationIncludingGravity.x / 9.80665,
                y = event.accelerationIncludingGravity.y / 9.80665,
                z = event.accelerationIncludingGravity.z / 9.80665,
                roll  = Math.atan(-x/Math.sqrt(y*y + z*z))  * 180 / Math.PI;
             
        if (roll > 4) {  
            if (paddleX >= 0 & (paddleX + paddleWidth) <= canvas.width) {
                paddleMoveRight = 0;
                paddleMoveLeft = 1;
            }
        }
        if (roll < -4) { 
            if (paddleX >= 0 & (paddleX + paddleWidth) <= canvas.width) {
                paddleMoveLeft = 0;
                paddleMoveRight = 1;
            }
        }           
            });
        }
    }

    function AddBlock(xpos, ypos) {
            var block = {
                width: canvas.width / 19.5,
                height: canvas.height / 30,
                x: xpos,
                y: ypos,
                value: 1
            };
            blocks.push(block);
    }
    
    function createBlock() {
        
        var maxRows = 4,
            i, 
            j,
            getXpos = 0,
            getYpos = 0;
        
        for(i = 0; i < maxRows; i++)
        {            
            getXpos = 0;            
            for (j = 0; j < 19; j++) {
                                
                AddBlock(getXpos, getYpos);
                blockStatus.push(true);
                getXpos += canvas.width/19;
            } 
            getYpos += canvas.height/29.75;
                   }
    }
    
    function drawBlocks(){
        
        for (var i = 0; i < blocks.length; i++){
            if (blocks[i].value > 0){
                
                var ctx = canvas.getContext("2d");
                if (i >= 0 & i < 19){
                ctx.fillStyle = "orange";
                 }
                else if (i > 18 & i < 38){
                ctx.fillStyle = "blue";
                 }
                else if (i > 37 & i < 57){
                ctx.fillStyle = "red";
                 }
                else {
                ctx.fillStyle = "green";
                
                 }
                ctx.beginPath();
                ctx.fillRect(blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    function ballMove() {
        updateBallDirection();        
        
        ballX += ballVX;
        ballY += ballVY;
    }
        
    function updateBallDirection() {
        // Checking collisions
        
        // Wall collisions
        // Right wall
        if (ballX >= canvas.width - ballR) {
            ballX = canvas.width - ballR;
            ballVX *= -1;
        }  
        
        // Left wall
        if (ballX <= 0 + ballR) {
            ballVX *= -1;
        } 
        
        // Bottom wall
        if (ballY >= canvas.height - ballR) {            
            clearInterval(interval);
        } 
        
        // Top Wall
        if (ballY <= 0 + ballR) {
            ballVY *= -1;
        } 
        
        // Paddle collisions
        // Top of paddle
        if (((ballY + ballR) >= paddleY) & ((ballY - ballR) <= (paddleY + paddleHeight)) &  
                    ((ballX - ballR) >= paddleX) & (ballX + ballR) <= (paddleX + paddleWidth)) {
            ballVY *= -1;
        }
        
        // Left of paddle
        if (((ballX + ballR) >= paddleX) & ((ballX - ballR) <= (paddleX + paddleWidth)) &
                    ((ballY - ballR) >= paddleY) & (ballY + ballR) <= (paddleY + paddleHeight)) {
            ballVX *= -1;
        }
        
        // Right of paddle 
            if ((ballX - ballR) <= (paddleX + paddleWidth) & ((ballX + ballR) >= paddleX) &
                    ((ballY - ballR) >= paddleY) & (ballY + ballR) <= (paddleY + paddleHeight)){
            ballVX *= -1;
                
            }
        
        // Block collisions
        var hitY = false,
            hitX = false;
        for (var i=0; i<blocks.length; i++){
            var block = blocks[i];
            
            // Bottom of blocks
            if ((ballY - ballR) <= (block.y + block.height) & ((ballY + ballR) >= block.y) &
                    ((ballX - ballR) >= block.x) & (ballX + ballR) <= (block.x + block.width)){
                hitY = true;                
                blockStatus[i] = false;                             
            }  
                       
            // Top of blocks
            if (((ballY + ballR) >= block.y) & ((ballY - ballR) <= (block.y + block.height)) &  
                    ((ballX - ballR) >= block.x) & (ballX + ballR) <= (block.x + block.width)){
               hitY = true;                
               blockStatus[i] = false;
            }
            
            // Left of blocks 
            if (((ballX + ballR) >= block.x) & ((ballX - ballR) <= (block.x + block.width)) &
                    ((ballY - ballR) >= block.y) & (ballY + ballR) <= (block.y + block.height)){
               hitX = true;                
               blockStatus[i] = false;                
            }
             
            // Right of blocks 
            if ((ballX - ballR) <= (block.x + block.width) & ((ballX + ballR) >= block.x) &
                    ((ballY - ballR) >= block.y) & (ballY + ballR) <= (block.y + block.height)){
               hitX = true;                
               blockStatus[i] = false;                
            }
        }
        if (hitY) ballVY *= -1;
        if (hitX) ballVX *= -1;
    }  
    
    function setBlockStatus() {
        for (var i = 0; i < blockStatus.length; i++) {
            if (blockStatus[i] === false){
                blocks[i] = 0;
                scoring += 1;
                document.getElementById("score").innerHTML = scoring;
            }
        }
    }
    
    function fitCanvas(main, top, canvas) {
        // Set the canvas's height and width to full screen
        canvas.width  = main.offsetWidth;
        canvas.height = main.offsetHeight - top.offsetHeight;
    }

window.addEventListener("keydown", function (evt) {        
        if (evt.keyCode===37){//left arrow
            if (paddleX > 0) {
            paddleX -= 10;
        }
    } else if (evt.keyCode===39){//right arrow
            if (paddleX + paddleWidth < canvas.width){
            paddleX += 10;
        }
       }
    });
    
    interval = setInterval(canvasPaint, frameRate);
    fitCanvas(main, topdiv, canvas);
    
    ballX = canvas.width/2,
    ballY = canvas.height/2,
    
    paddleWidth = canvas.width / 6,
    paddleHeight = canvas.height / 40,
    paddleX = canvas.width / 2 - paddleWidth / 2,  
    paddleY = canvas.height - canvas.height / 10,
   
    window.addEventListener("load", canvasPaint);
    
}



var GameBO = new GameBO();
GameBO.init();
window.addEventListener("load", GameBO.canvasPaint, false);