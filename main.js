function Cell () {
  this.alive = false;
  this.neighbors = 0;
};

function Game (size) {
  this.running = false;
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

Game.prototype.mapGrid = function(size) {
  var row = [];
  for (var i = 0; i < size; i++) {
    row.push(new Cell());
  }
  var grid = row.map(function(cell) {
  return cell;
})
};

Game.prototype.getCoord = function(cellDivId) {
  var integers = cellDivId.match(/[0-9 , \.]+/g);

  var coords = integers[0].split(',').map(function(item) {
    return parseInt(item, 10);
  });
  return coords;
};

Game.prototype.render = function() {

  var gridDiv = document.getElementById("grid");
  while (gridDiv.hasChildNodes())
  gridDiv.removeChild(gridDiv.lastChild);

  for (var i = 0; i < this.size; i++) {
    var row = this.grid[i];
    var rowDiv = document.createElement("rowDiv");
    rowDiv.setAttribute("id", "row-" + i);
    rowDiv.setAttribute("class", "row");
    gridDiv.appendChild(rowDiv);

    for (var j = 0; j < this.size; j++) {
      var cell = row[j];

      var cellDiv = document.createElement("cellDiv");
        cellDiv.setAttribute("id", i + "," + j);
        cellDiv.setAttribute("class", "cell");

      if (cell.alive) {
        cellDiv.setAttribute("alive", "true");
        cellDiv.setAttribute("style", "background-color: red;")
      }
      rowDiv.appendChild(cellDiv);

      cellDiv.addEventListener("click", function(){
        var coords = game.getCoord(this.getAttribute('id'));
        var cell = game.grid[coords[0]][coords[1]];
        cell.alive = true;
        this.setAttribute("style", "background-color:red");
      });
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

Game.prototype.updateCell = function(r,c) {
  var cell = this.grid[r][c];
  if (this.twoNeighbors(r,c) || this.moreThanThreeNeighbors(r,c)) {
    cell.alive = false;
  } else if (this.threeNeighbors(r,c)) {
    cell.alive = true;
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
  console.log('game running');
};

Game.prototype.pause = function() {
  this.running = false;
  console.log('game paused');
};

Game.prototype.clear = function() {
  game = new Game(80);
  game.render();
};

window.onload = function() {

  game = new Game(80);

  game.render();

  var interval = setInterval(function () {
    
    if(game.running) {
      
      game.updateNeighbors();
      game.updateAllCells();
      game.render();

    }

  }, 50);

};