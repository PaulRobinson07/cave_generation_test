//basic implementation of celluar automata to showcase cave generation
//based off of this article: https://www.jeremykun.com/2012/07/29/the-cellular-automaton-method-for-cave-generation/

//gets the element to render the caves
const canvas = document.getElementById("sim");
const ctx = canvas.getContext("2d");

//drawing contraints
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//world contraints
const world_height = 100;

//sets the tile size relative to the screen height 
tile_size = Math.round(canvas.height/world_height)-1;

world_width = Math.round(canvas.width/tile_size)-1;

//makes a empty array to store the world on the current frame
world= Array.from({ length: world_width}, () => Array(world_height).fill(0));

//makes a empty array to store the world on the next frame
swap_world= Array.from({ length: world_width}, () => Array(world_height).fill(0));

//function that makes a randomly generated world
function make_world() {
	for (let i=0;i<world_width;i++) {
		for (let j=0;j<world_height;j++) {
			world[i][j] = Math.round(Math.random());
		}
	}
}

//function responsible for applying cellular automata rules
function check_neighbors(cell_x, cell_y) {
	//checks if the cell checks will be outside the array
	if (cell_x-1<0 || cell_x+1 >= world_width ||	cell_y-1<0 || cell_y+1 >= world_height) {
		return;
	}
	//gets the number of neighboring cells
	let neighbors_n = 0;
	for (let a = 0; a < 3; a++) {
		for (let b = 0; b < 3; b++) {
			if (world[cell_x-1+b][cell_y-1+a] == 1) {
				neighbors_n++;
			}
		}
	}
	//if above 5 cells are alive near it, the cell becomes alive when dead
	if (neighbors_n>5 && world[cell_x][cell_y] == 0) {
		swap_world[cell_x][cell_y] = 1;
		return;
	}
	//if more than 3 cells are alive the cell remains alive
	if (neighbors_n>3 && world[cell_x][cell_y] == 1) {
		swap_world[cell_x][cell_y] = 1;
		return;
	}
	//if less than that it dies
	else {
		swap_world[cell_x][cell_y] = 0;
		return;
	}
}

//iterates through all the cells to apply the celluar automata
function update_world() {
	draw_world();
	console.log(world);
	for (let i=0;i<world_width;i++) {
		for (let j=0;j<world_height;j++) {
			check_neighbors(i, j);
		}
	}
	world = swap_world;
}

//general function for rendering the caves
function draw_world() {
	//makes the black background to clear screen from last frame
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	//iterates through every tile and renders every single one
	for (let i=0;i<world_width;i++) {
		for (let j=0;j<world_height;j++) {
			if (world[i][j] == 1) {
				ctx.fillStyle = "blue";
				ctx.fillRect(i*tile_size,j*tile_size,tile_size,tile_size);
			}
		}
	}
}

//makes a random world for the first iteration of world gen
make_world();

//updates the world every n frames
setInterval(update_world,250);

//detects if the window is resized and changes variables for proper drawing on the next frame
window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	tile_size = Math.round(canvas.height/world_height)-1;
	world_width = Math.round(canvas.width/tile_size)-1;

	//makes a empty array to store the world on the current frame
	world= Array.from({ length: world_width}, () => Array(world_height).fill(0));

	//makes a empty array to store the world on the next frame
	swap_world= Array.from({ length: world_width}, () => Array(world_height).fill(0));
	make_world();
});
