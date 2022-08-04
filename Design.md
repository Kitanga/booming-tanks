# TankiShoot

A top down tank shooter prototype

## Gameplay

- Player
    - Player drives a tank that can switch between 3 modes
        - Red mode: fires 2 bullets next to each other and each does 10 damage
        - Blue mode: fires 3 bullets a la shotgun in top down games and each bullet does 20 damage
        - Green mode: fires 1 bullet straight ahead and does 25 damage
    - Controls
        - WASD for movement.
            - W/S for forward and backwards movement
            - A/D for turning left and right
        - T for switching mode
- Map
    - Size: 50x50 tile grid (tile is 34px in length)
    - Randomly generated walls and hays
        - item count:
            - Hays: 25
            - Walls: 50
    - No fancy stuff, just place the walls and hays around randomly
    - Hay has health (100hp)
    - Walls can't be destroyed
