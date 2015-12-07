function Cell () {
  this.alive = Math.random() < 0.70;
  this.neighbors = 0; // live neighbors
};

function Game (size) {
  document.getElementById("grid").setAttribute("style", "width: " + size + "vw");
  this.size = size;
  this.grid = this.generateGrid(size);
  this.directions = [ [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1] ];
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

Game.prototype.render = function() {

  var gridDiv = document.getElementById("grid");
  while (gridDiv.hasChildNodes())
  gridDiv.removeChild(gridDiv.lastChild);

  for (var i = 0; i < this.size; i++) {
    var row = this.grid[i];
    // var rowString = [];
    var rowDiv = document.createElement("rowDiv");
    rowDiv.setAttribute("id", "row-" + i);
    rowDiv.setAttribute("class", "row");
    gridDiv.appendChild(rowDiv);

    for (var j = 0; j < this.size; j++) {
      var cell = row[j];

      var cellDiv = document.createElement("cellDiv");
        cellDiv.setAttribute("id", "cell-(" + i + "," + j + ")");
        cellDiv.setAttribute("class", "cell");

      if (cell.alive) {
        // rowString += "X|";
        cellDiv.setAttribute("alive", "true");
      } else {
        // rowString += " |";
        cellDiv.setAttribute("alive", "false");
      }
      rowDiv.appendChild(cellDiv);
    }
    // console.log(rowString);
  }
};



// if less than 2 neighbors, cell dies -- isUnderPopulated(x,y)
// if more than 3 neighbors, cell dies
// if dead, and exactly 3 neighbors, cell is reborn
// update neighbors for cells**

Game.prototype.isUnderPopulated = function(r,c) {
  var cell = this.grid[r][c];
  return cell.neighbors < 2;
};

Game.prototype.isOverPopulated = function(r,c) {
  var cell = this.grid[r][c];
  return cell.neighbors > 3;
};

Game.prototype.isResurrectable = function(r,c) {
  var cell = this.grid[r][c];
  return !cell.alive && cell.neighbors === 3;
};

Game.prototype.isInBounds = function(r,c) {
  return r >= 0 && r < this.size && c >= 0 && c < this.size;
};

Game.prototype.updateNeighborsForCell = function(r,c) {
  var cell = this.grid[r][c];
  var neighbors = 0;
  for (var i = 0; i < this.directions.length; i++) {
    var direction = this.directions[i];
    var dr = direction[0];
    var dc = direction[1];
    if (this.isInBounds(r + dr, c + dc)) {
      var neighbor = this.grid[r + dr][c + dc];
      if (neighbor.alive) {
        cell.neighbors++;
      }
    }
  }
};

Game.prototype.updateNeighbors = function() {
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      this.updateNeighborsForCell(i,j);
    }
  }
};

Game.prototype.updateStateForCell = function(r,c) {
  var cell = this.grid[r][c];
  if (this.isUnderPopulated(r,c) || this.isOverPopulated(r,c)) {
    cell.alive = false;
  } else if (this.isResurrectable(r,c)) {
    cell.alive = true;
  }
};

Game.prototype.updateStates = function() {
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      this.updateNeighborsForCell(i,j)
    }
  }
};



// var interval = setInterval(function () {
  var game = new Game(10);
  // process.stdin.write("\033[2J");
  // flow of methods
  game.render();
  game.updateNeighbors();
  game.updateStates();
  
// }, 1000);