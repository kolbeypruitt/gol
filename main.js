function Cell () {
  this.alive = Math.random() < 0.7;
  this.neighbors = 0; // live neighbors
};

function Conway (size) {
  this.size = size;
  this.grid = this.generateGrid(size);
  this.directions = [ [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1] ];
};

Conway.prototype.generateGrid = function(size) {
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

Conway.prototype.show = function() {
  console.log("\033[2J");
  for (var i = 0; i < this.size; i++) {
    var row = this.grid[i];
    var rowString = [];
    for (var j = 0; j < this.size; j++) {
      var cell = row[j];
      if (cell.alive) {
        rowString += "X|";
      } else {
        rowString += " |"
      }
    }
    console.log(rowString);
  }
};

// if less than 2 neighbors, cell dies -- isUnderPopulated(x,y)
// if more than 3 neighbors, cell dies
// if dead, and exactly 3 neighbors, cell is reborn
// update neighbors for cells**


// update neighbors for cells**

Conway.prototype.isUnderPopulated = function(r,c) {
  var cell = this.grid[c][r];
  return cell.neighbors < 2;
};

Conway.prototype.isOverPopulated = function(r,c) {
  var cell = this.grid[c][r];
  return cell.neighbors > 3;
};

Conway.prototype.isResurrectable = function(r,c) {
  var cell = this.grid[c][r];
  return !cell.alive && cell.neighbors === 3;
};

Conway.prototype.updateNeighborsForCell = function(r,c) {
  var cell = this.grid[c][r];
  for (var i = 0; i < this.directions.length; i++) {
    var direction = this.directions[i]
  }
};
// var conway = new Conway(40);
// conway.show();