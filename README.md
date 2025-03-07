Simulation of a minigame in which you are presented with a 3 by 3 grid of the numbers 1-9 in a randomized order.
One number will be revealed at the start and the player gets to reveal 3 more spots.
After that the player needs to decide on a row/column/diagonal set of 3 numbers to lock in as their cross sum.
Based on this cross sum value the player receives a prize (weighted towards very high or very low cross sums).

The goal is to simulate this minigame as well as using math to try and find out the optimal way of solving it to have the highest chances of a big prize.

Update: 07-03

- done a couple of minor function cleanups and adjustments, checking for performance bottlenecks
- noticed a lot of unclean code and abuse of global variables which made it so that trying to change certain functions would leave the program in endless loops because certain changes needed to affect global variables, even though it was not intended that way
- came to a decision after trying to clean up the code:
  **Rewrite the program, using OOP**
  - ensures cleaner abstraction of functionality and information for each specific game session
  - only affecting class internal data, no global variables
  - lets me track and pass information of each playthrough easier
  - using the randomized array and starting point to create a game session ID makes it so any configuration can be tested and debugged (isolated from randomness)
  - collect all final information after a playthrough to analyze and display it 

Update: 25-02

- It is not possible to play through a set amount of configurations after each other
- Data from each playthrough is passed and later on fed into an array for a primitive data analysis
- Most recent simulation was running through 1000000 random configurations and yielded these results:
  ![image](https://github.com/user-attachments/assets/7c824904-462e-4ea1-9a83-dd4ebbaac26b)



Update: 24-02

- value assignment and choice of slot/set through the code is now fully based on calculating all possible options in a given set.
- logs have been cut down a lot, but can still be opened again to reveal the full details of all options the code keeps in mind when proceeding
- minor code cleanups, function explanations have been added

Update: 07-02

- The game is now fully playable with user input. 
- A primitive value assignment is given to possible slot-reveal options as well as the final set to lock in.
- The code is now capable of playing the game on its own, always picking the best reveal and set option based on the primitive value assignments.
