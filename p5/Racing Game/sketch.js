// Game state constants
const LOADING = 0;
const MAIN_MENU = 1;
const PLAY = 2;
const HIGH_SCORE = 3;

var currentState = LOADING;
let playerSprite;
let personImages = new Array(4);

let officialSprite;
let officialImages = new Array(8);

let pitCrewSprite;
let pitCrewImages = new Array(3);
//let playerGameScoreBoard;

// Cars
var wecPorsche;
var wecAudi;
var wecMcdonalds;

var carCrashed;
var carRepaired;
var font;
var driverSpeed = 8;
var opposition = [];
var raceTrack = [];
var carsOvertaken = 0;
var carRepairLives = 3;

function preload() {
    
    // Menu Sprites
    personImages[0] = loadImage('images/person1.png');
    personImages[1] = loadImage('images/person2.png');
    personImages[2] = loadImage('images/person3.png');
    personImages[3] = loadImage('images/person4.png');
    
    officialImages[0] = loadImage('images/official1.png');
    officialImages[1] = loadImage('images/official2.png');
    officialImages[2] = loadImage('images/official3.png');
    officialImages[3] = loadImage('images/official4.png');
    officialImages[4] = loadImage('images/official5.png');
    officialImages[5] = loadImage('images/official6.png');
    officialImages[6] = loadImage('images/official7.png');
    officialImages[7] = loadImage('images/official8.png');
    
    pitCrewImages[0] = loadImage('images/pitcrew1.png');
    pitCrewImages[1] = loadImage('images/pitcrew2.png');
    pitCrewImages[2] = loadImage('images/pitcrew3.png');
    
    // Car Images
    wecPorsche = loadImage('images/Porsche.png');
    wecMcdonalds = loadImage('images/wecMcdonalds.png');
    wecAudi = loadImage('images/wecAudi.png');
    carCrashed = loadImage('images/boom.png');
    carRepaired = loadImage('images/CarRepair.png');
    tyres = loadImage('images/tyres.png');
    font = loadFont('Rabbit-Hole.ttf');
    //playerGameScoreBoard = loadJSON('data.json');
}


function setup() {
    createCanvas(1200, 800);
    
    playerSprite = createSprite(0, 400, 50, 50);
    playerSprite.addAnimation('run', personImages[0], personImages[1], personImages[2], personImages[3]);
    playerSprite.setVelocity(1,0);
    
    officialSprite = createSprite(0, 150, 50, 50);
    officialSprite.addAnimation('run', officialImages[0], officialImages[1], officialImages[2], officialImages[3], officialImages[4], officialImages[5], officialImages[6], officialImages[7]);
    officialSprite.setVelocity(1,0);
    
    pitCrewSprite = createSprite(0, 700, 50, 50);
    pitCrewSprite.addAnimation('run', pitCrewImages[0], pitCrewImages[1], pitCrewImages[2]);
    pitCrewSprite.setVelocity(1,0);

    raceTrack.push(new raceTracks());
    opposition.push(new Opposition());

    driver = new Driver();
    
  //  print(playerGameScoreBoard.name);
    //noLoop();
}

function draw() {
    background(100);
    if (currentState == LOADING){
        drawLoadingScreen();
    }
    else if (currentState == MAIN_MENU){
        drawMainMenuScreen();
    }
    else if (currentState == PLAY){
        drawPlayScreen();
    }
    else if (currentState == HIGH_SCORE){
        drawHighScore();
    }    
    
    // Progress to Main Menu after 2s 
    if (frameCount == 120){
        currentState = MAIN_MENU;
    }
    
}

/*
 * Draw the loading screen
 */
function drawLoadingScreen(){
    fill('pink');
    ellipse(200, 200, 100, 100);
    fill('white');
    text('Loading...', 300, 200);
}

/*
 * Draw the main menu screen
 */
function drawMainMenuScreen(){
    fill('lightgreen');
    rect(150, 150, 100, 100);
    fill('white');
    text('Main Menu. Click to play.', 300, 200);
    pitCrewSprite.velocity.x = (mouseX - pitCrewSprite.position.x) * 0.2;
    pitCrewSprite.velocity.y = (mouseY - pitCrewSprite.position.y) * 0.2;
    drawSprites();
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    playerSprite.setSpeed(1.5, 0);
  }
  else if (keyCode == DOWN_ARROW) {
    playerSprite.setSpeed(1.5, 90);
  }
  else if (keyCode == LEFT_ARROW) {
    playerSprite.setSpeed(1.5, 180);
  }
  else if (keyCode == UP_ARROW) {
    playerSprite.setSpeed(1.5, 270);
  }
  else if (key == ' ') {
    playerSprite.setSpeed(0, 0);
  }
  return false;
}

/*
 * Implement the game logic
 */
function drawPlayScreen(){
    
    background(56, 56, 56);

    if (frameCount % 15 === 0) {
        raceTrack.push(new raceTracks());
    }

    for (var i = raceTrack.length - 1; i >= 0; i--) {
        raceTrack[i].show();
        raceTrack[i].update();

        if (raceTrack[i].offscreen()) {
            raceTrack.splice(i, 1);
        }
    }

    if (frameCount % 100 === 0) {
        opposition.push(new Opposition());
    }

    // Opposition Show Up
    for (var i = opposition.length - 1; i >= 0; i--) {
        //console.log(opposition[i].flag);
        opposition[i].show();
        opposition[i].update();

        if (opposition[i].overtakenBy(driver) && opposition[i].isOvertakenBy === false) {
            if (opposition[i].flag == 1) {
                carsOvertaken += 1;
                opposition[i].isOvertakenBy = true;
            }
        }
        // Opposition collide with driver, get destroyed
        if (opposition[i].hits(driver)) {
            opposition[i].boom();
            opposition.splice(i, 1);

            // Collision Repair Life Lost
            carsOvertaken = (carsOvertaken >= 0) ? (carsOvertaken - 3) : 0;
            carRepairLives--;
        }
        else if (opposition[i].offscreen()) {
            opposition.splice(i, 1);
        }
    }

    console.log(carRepairLives);
    // Driver Shown
    driver.show();

    // Mouse Controls
    if (keyIsDown(LEFT_ARROW)) {
        driver.turnLeft();
    }
    if (keyIsDown(RIGHT_ARROW)) {
        driver.turnRight();
    }
    if (keyIsDown(UP_ARROW)) {
        driver.turnLeft();
    }
    if (keyIsDown(DOWN_ARROW)) {
        driver.turnRight();
    }



    // Driver Stats
    textSize(40);
    textFont(font);
    textAlign(LEFT);
    fill(255);
    text('Cars Overtaken In Race: ' + carsOvertaken, 30, 60);

    for (var i = 0; i < carRepairLives; i++) {
        image(carRepaired, 30 + (i * 70), height - 60);
    }

    textSize(40);
    textFont(font);
    textStyle(BOLD);
    textAlign(LEFT);
    fill(255);
    text('Repair Lives:', 30, 725);
    
    // Game Over
    if (carRepairLives === 0) {
        noLoop();

        textSize(60);
        textFont(font);
        textStyle(BOLD);
        textAlign(CENTER);
        fill(255);
        text('YOU CRASHED! GAME OVER.', width / 2, height / 2);
        
        // Line Shape
        stroke(255);
        line(320, 420, 900, 420);
        
        //Ellipse Shape
        fill(0);
        ellipse(270, 390, 55, 55);
        
        fill(0);
        ellipse(950, 390, 55, 55);
    }
}

function drawHighScore(){
   
}



/*
 * Mouse click triggers the transition between the menu and play screens.
 */
   
// Mouse Movement

function mouseMoved() {
    var currentMousePos = pmouseX;
    if (currentMousePos < mouseX) {
        driver.turnRight();
    }
    if (currentMousePos > mouseX) {
        driver.turnLeft();
    }    
    
}


function mouseClicked(){
    if (currentState == MAIN_MENU){
        currentState = PLAY;
    } else if (currentState == PLAY){
    }
}
