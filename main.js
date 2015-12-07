function Cell () {
  this.alive = false;
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
        cellDiv.setAttribute("style", "background-color: red;")
      } else {
        // rowString += " |";
        // cellDiv.setAttribute("alive", "false");
        // cellDiv.setAttribute("style", "background-color: blue;")
      }
      rowDiv.appendChild(cellDiv);

      cellDiv.addEventListener("click", function(){
        this.alive = true;
        this.setAttribute("style", "background-color:red");
      });
    }
    // console.log(rowString);
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
  cell.neighbors = 0;
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
  if (this.twoNeighbors(r,c) || this.moreThanThreeNeighbors(r,c)) {
    cell.alive = false;
  } else if (this.threeNeighbors(r,c)) {
    cell.alive = true;
  }
};

Game.prototype.updateStates = function() {
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      this.updateStateForCell(i,j)
    }
  }
};

var game = new Game(50);

var interval = setInterval(function () {
  // process.stdin.write("\033[2J");
  // flow of methods
  game.render();
  game.updateNeighbors();
  game.updateStates();
  
}, 5000);



// I need to add a Game.tick() fn that invokes updates and render
// viewModel.tick = function () {
//   grid.step();
//   viewModel.update();
// };