function Game (height, width) {
  this.running = false;
  this.height = height;
  this.width = width;
  this.grid = this.generateGrid(height, width);
  this.directions = [ [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1] ];
  this.gridColor = "white";
};

function Cell () {
  this.changed = false;
  this.alive = false;
  this.neighbors = 0;
  this.color = "#ffffff";
  this.opacity = 0.1;
};

Cell.prototype.toggleAlive = function(override) {
  this.opacity = 0.1;
  if (override===undefined) {
    if (this.alive===true) {
      this.alive = false;
      this.changed = true;
    } else {
      this.alive = true;
      this.changed = true;
    }
  } else {
    if (this.alive!==override) {
      this.changed = true;
      this.alive = override;
    } else if (this.alive==override) {
      this.changed = false;
      this.alive = override;
    }  
  }
};

Cell.prototype.buildDna = function(r,g,b) {
  this.color = '#';
  this.color +=r;
  this.color +=g;
  this.color +=b;
};

Game.prototype.getNeighborsDna = function(cell, neighborArr) {
  if (neighborArr.length===3) {
    for (var i = 0; i < neighborArr.length; i++) {
      var neighborColor = neighborArr[i].color;
      if (i===0) {
        var red = neighborArr[i].color[1] + neighborArr[i].color[2];
      }
      if (i===1) {
        var green = neighborArr[i].color[3] + neighborArr[i].color[4];
      }
      if (i===2) {
        var blue = neighborArr[i].color[5] + neighborArr[i].color[6];
      }
    }
    cell.buildDna(red,green,blue);
  }
};

Game.prototype.generateGrid = function(height, width) {
  var grid = [];
  for (var i = 0; i < height; i++) {
    var row = [];
    for (var j = 0; j < width; j++) {
      row.push(new Cell());
    }
    grid.push(row);
  }
  return grid;
};

Game.prototype.getCoord = function(cellDivId) {
  var integers = cellDivId.match(/[0-9 , \.]+/g);

  var coords = integers[0].split(',').map(function(item) {
    return parseInt(item, 10);
  });
  return coords;
};

Game.prototype.initializeDisplay = function() {
  var color_input = document.getElementById('color_input');
  var pickerDiv = document.getElementById('pickerDiv');
  var gridColorDiv = document.getElementById('gridColor');

  pickerDiv.addEventListener("click", function(){
    color_input.click()
    this.setAttribute("style", "visibility:visible; background-color:" + color_input.value);
  }, false);

  var game = this;
  gridColorDiv.addEventListener("click", function(){
    if (game.gridColor==="black") {
      game.gridColor = "white";
    } else if (game.gridColor==="white") {
      game.gridColor = "black";
    } 
    console.log(game.gridColor);
    // this.setAttribute("style", "visibility:visible; background-color:" + game.gridColor);
  }, false);

  var gridDiv = document.getElementById("grid");
  while (gridDiv.hasChildNodes())
  gridDiv.removeChild(gridDiv.lastChild);

  for (var i = 0; i < this.height; i++) {
    var row = this.grid[i];
    var rowDiv = document.createElement("div");
    rowDiv.setAttribute("class", "row");
    rowDiv.setAttribute("id", "row-" + i);
    gridDiv.appendChild(rowDiv);

    for (var j = 0; j < this.width; j++) {
      var cell = row[j];

      var cellDiv = document.createElement("div");
        cellDiv.setAttribute("class", "cell");
        cellDiv.setAttribute("id", i + "," + j);

      if (cell.alive) {
        cellDiv.setAttribute("style", "background-color:" + cell.color)
        // I'm setting attributes everytime regardless of if it is already correct
      }
      rowDiv.appendChild(cellDiv);

      cellDiv.addEventListener("click", function(){
        var pickColor = document.getElementById("color_input").value;
        var coords = game.getCoord(this.getAttribute('id'));
        var cell = game.grid[coords[0]][coords[1]];
        cell.color = pickColor;
        cell.toggleAlive();
        if (cell.alive) {
          this.setAttribute("style", "background-color:" + cell.color)
        } else {
          this.setAttribute("style", "background-color:white");
        }
        
      });
    }
  }
};

Game.prototype.reRender = function() {

  for (var i = 0; i < this.height; i++) {
    var row = this.grid[i];

    for (var j = 0; j < this.width; j++) {
      var cell = row[j];
      cell.opacity = cell.opacity + 0.1;
      if (cell.changed) {
        var cellDiv = document.getElementById(i + "," + j);
        if (cell.alive) {
          cellDiv.setAttribute("style", "background-color:" + cell.color + "; opacity:" + cell.opacity);
        } else {
          cellDiv.setAttribute("style", "background-color: white;")
        }
      } else {
        cell.changed = false;
      }
    }
  }
};

Game.prototype.twoNeighbors = function(r,c) {
  var cell = this.grid[r][c];
  return cell.neighbors < 2;
};

Game.prototype.moreThanThreeNeighbors = function(r,c) {
  var cell = this.grid[r][c];
  return cell.neighbors > 3;
};

Game.prototype.threeNeighbors = function(r,c) {
  var cell = this.grid[r][c];
  return !cell.alive && cell.neighbors === 3;
};

Game.prototype.isInBounds = function(r,c) {
  return r >= 0 && r < this.height && c >= 0 && c < this.width;
};

Game.prototype.updateNeighborsForCell = function(r,c) {
  var cell = this.grid[r][c];
  var threeLiveNeighbors = [];
  cell.neighbors = 0;
  for (var i = 0; i < this.directions.length; i++) {
    var direction = this.directions[i];
    var dr = direction[0];
    var dc = direction[1];
    if (this.isInBounds(r + dr, c + dc)) {
      var neighbor = this.grid[r + dr][c + dc];
      if (neighbor.alive) {
        cell.neighbors++;
        // this is building the array for dna inheritance
        threeLiveNeighbors.push(neighbor);
        // - - - - -  - - - -  -
      }
    }
  }
  game.getNeighborsDna(cell, threeLiveNeighbors);
};

Game.prototype.updateNeighbors = function() {
  for (var i = 0; i < this.height; i++) {
    for (var j = 0; j < this.width; j++) {
      this.updateNeighborsForCell(i,j);
    }
  }
};

Game.prototype.updateCell = function(r,c) {
  var cell = this.grid[r][c];
  if (this.twoNeighbors(r,c) || this.moreThanThreeNeighbors(r,c)) {
    cell.toggleAlive(false); // passing a parameter overrides the toggle
  } else if (this.threeNeighbors(r,c)) {
    cell.toggleAlive(true); // passing a parameter overrides the toggle
  }
};

Game.prototype.updateAllCells = function() {
  for (var i = 0; i < this.height; i++) {
    for (var j = 0; j < this.width; j++) {
      this.updateCell(i,j)
    }
  }
};

Game.prototype.pauseOrPlay = function() {
  var pauseOrPlay = document.getElementById("pauseOrPlay");
  if (!this.running) {
    pauseOrPlay.innerHTML = "Pause"
    this.running = true;
    game.startLoop();
  } else {
    pauseOrPlay.innerHTML = "Play"
    clearInterval(loop);
    this.running = false;
  }
  
};

Game.prototype.clear = function() {
  // incase the game was cleared while running
  var pauseOrPlay = document.getElementById("pauseOrPlay");
  pauseOrPlay.innerHTML = "Play"
  this.running = false;

  game = new Game(this.height, this.width);
  game.initializeDisplay();
  game.startLoop();
};

Game.prototype.startLoop = function() {
  var speed = parseInt(document.getElementById("speed").value);

  loop = setInterval(function () {
    if(game.running) {
      game.reRender();
      game.updateNeighbors();
      game.updateAllCells();
    }
  }, speed)
  
};

Game.prototype.changeSpeed = function() {
  var speed = parseInt(document.getElementById("speed").value);
  clearInterval(loop);
  game.startLoop();
};

Game.prototype.watcher = function () {
  watcherLoop = setInterval(function () {

    // watches for color input changes and updates the pickerDiv
    var color_input = document.getElementById('color_input');
    var pickerDiv = document.getElementById('pickerDiv');
    pickerDiv.setAttribute("style", "visibility:visible; background-color:" + color_input.value);

    // 
    var gridColorDiv = document.getElementById('gridColor');
    // gridColorDiv.setAttribute("style", "visibility:visible; background-color:" + game.gridColor);
  }, 500)
  
};

// Game.prototype.toggleGridColor = function() {
//   if (this.gridColor==="black") {
//     this.gridColor = "white";
//   } else {
//     this.gridColor = "black";
//   }
// };

function initiateGridSize() {
  var height = document.getElementById("height").value;
  var width = document.getElementById("width").value;
  // hides grid size selection
  var controlsDiv = document.getElementById("controls");
  var gridSizeDiv = document.getElementById("grid_size");
  controlsDiv.removeChild(gridSizeDiv);
  // shows game controls
  var buttonDivs = document.getElementsByClassName("button");
  for (var i = 0; i < buttonDivs.length; i++) {
    buttonDivs[i].setAttribute("style", "visibility:visible;");
  }

  var gridDiv = document.getElementById("grid");
  gridDiv.setAttribute("style", "visibility:visible;");


  game = new Game(height, width);

  game.initializeDisplay();
  
  game.startLoop();

  game.watcher();
};