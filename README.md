# Conway's Game Of Life


#### The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead. Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

## Rules

##### 1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
##### 2. Any live cell with two or three live neighbours lives on to the next generation.
##### 3. Any live cell with more than three live neighbours dies, as if by over-population.
##### 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.


![gol example](https://upload.wikimedia.org/wikipedia/commons/e/e5/Gospers_glider_gun.gif)

[Click here](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
for more info about John Conway and his Game of Life

##### This implimentation takes Conway's basic rules a step further by making newborn cells inherit their color based on the taking an R, G, and B color value from each of its 3 neighbors. The newborns also start out with 10% opacity which increases 10% each turn until it reaches 100% or dies.
