Simulation of a minigame in which you are presented with a 3 by 3 grid of the numbers 1-9 in a randomized order.
One number will be revealed at the start and the player gets to reveal 3 more spots.
After that the player needs to decide on a row/column/diagonal set of 3 numbers to lock in as their cross sum.
Based on this cross sum value the player receives a prize (weighted towards very high or very low cross sums).

The goal is to simulate this minigame as well as using math to try and find out the optimal way of solving it to have the highest chances of a big prize.

Update: 07-02

- The game is now fully playable with user input. 

- A primitive value assignment is given to possible slot-reveal options as well as the final set to lock in.
- - The code is now capable to play the game itself, always picking the best reveal and set option based on the primitive value assignments.
