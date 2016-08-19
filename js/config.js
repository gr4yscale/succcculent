var config = exports

// how much to offset when we test for a new unused position in the iterative and very unoptimized function for finding a place to put the plants
// decrease this number too much and we exceed the call stack limit...
config.randomPositionTestOffset = 0.5
