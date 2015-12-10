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

function Game (size) {
  this.running = false;
  this.size = size;
  this.grid = this.generateGrid(size);
  this.directions = [ [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1] ];
};

Game.prototype.generateGrid = function(size) {
  var grid = [];
  for (var i = 0; i < size; i++) {
    var row = [];
    for (var j = 0; j < size; j++) {
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

  var gridDiv = document.getElementById("grid");
  while (gridDiv.hasChildNodes())
  gridDiv.removeChild(gridDiv.lastChild);

  for (var i = 0; i < this.size; i++) {
    var row = this.grid[i];
    var rowDiv = document.createElement("div");
    rowDiv.setAttribute("id", "row-" + i);
    rowDiv.setAttribute("class", "row");
    gridDiv.appendChild(rowDiv);

    for (var j = 0; j < this.size; j++) {
      var cell = row[j];

      var cellDiv = document.createElement("div");
        cellDiv.setAttribute("id", i + "," + j);
        cellDiv.setAttribute("class", "cell");

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

  for (var i = 0; i < this.size; i++) {
    var row = this.grid[i];

    for (var j = 0; j < this.size; j++) {
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

// if less than 2 neighbors, cell dies -- twoNeighbors(x,y)
// if more than 3 neighbors, cell dies
// if dead, and exactly 3 neighbors, cell is reborn
// update neighbors for cells**

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
  return r >= 0 && r < this.size && c >= 0 && c < this.size;
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
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
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
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      this.updateCell(i,j)
    }
  }
};

Game.prototype.start = function() {
  this.running = true;
  game.startLoop();
};

Game.prototype.pause = function() {
  this.running = false;
  clearInterval(loop);
};

Game.prototype.clear = function() {
  game = new Game(50);
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

window.onload = function() {

  // game = new Game(50);

  // game.initializeDisplay();
  
  // game.startLoop();

  
};

function initiateGridSize() {
  var height = document.getElementById("height").value;
  var width = document.getElementById("width").value;
  // hides grid size selection
  var controlsDiv = document.getElementById("controls");
  var gridSizeDiv = document.getElementById("grid_size");
  controlsDiv.removeChild(gridSizeDiv);
  // shows game controls
  var buttonDivs = document.getElementsByClassName("button");
  console.log(buttonDivs);
  for (var i = 0; i < buttonDivs.length; i++) {
    buttonDivs[i].setAttribute("style", "visibility:visible;");
  }
  console.log(height + "---" + width)

  /// need to figure out how to make this take 2 parameters
  // then get grid cells to look right
  game = new Game(50);
};