	function setup() {
	  createCanvas(1200, 800);
	  headDivHScore = createDiv('High score'); 
	  headDivHScore.position(50, 50);
    headDivHScore.class('heading');

    headDivName = createDiv('Name'); 
	  headDivName.position(150, 50);
    headDivName.class('heading');

    headDivScore = createDiv('Score');
    headDivScore.position(200, 50);
    headDivScore.class('heading');
      
    headDivTime = createDiv('Time'); 
	  headDivTime.position(250, 50);
    headDivTime.class('heading');

	  aTag = createA('index.html', 'back to Game');
	  aTag.position(550, height/2 + 50);
	  aTag.class('btn btn-primary');

	  loadJSON("scores.json", drawData);
	}

	function drawData(data) {
		var startY = 60;
		var startX = 70;

		for (var i=0; i<data.highscores.length; i++) {
		  startY += 30;
		  startX = 60;
		  valDivHScore = createDiv(data.highscores[i].highscore); 
		  valDivHScore.position(startX, startY);
      valDivHScore.class('val');

		  valDivName= createDiv(data.highscores[i].name); 
		  valDivName.position(startX + 90, startY);
      valDivName.class('val');

		  valDivScore = createDiv(data.highscores[i].score); 
		  valDivScore.position(startX + 150, startY);
      valDivScore.class('val');

		  valDivTime = createDiv(data.highscores[i].time); 
		  valDivTime.position(startX + 200, startY);
      valDivTime.class('val');	      

		  console.log(data.highscores[i]);
		}
	}	