World - HTLM5 game engine
=========================

World, a simple HTML5 game engine. Written in native JavaScript.


The enine is under developement.

Main features:
  1. Uses maps. Entities can be placed there.
  2. Different types of entities:
    + DecoEntity (just for decoration, can not be collided)
    + StaticEntity (for static objects, can be collided)
    + Player (can be moved, listens collisions)
  3. Key Events

====
Sample Javascript code, creates tiny map and paces building and player on it. Player can be controlled with arrow keys.
```javascript
var player;

(function() {
  // Init the world
  World.init();
  
  World.map = {
    w: 20, h: 20, gridW: 32, gridH: 32, background: "img/ground.png",
    entities: {
      "1": {type: World.PLAYER, img: "img/dude.png", callback: function(entitie) {player = entitie;} },
      "3": {img: "img/stairs-up.png", x: -1},
      "5": {img: "img/rooftop.png"},
      "8": {type: World.STATIC, img: "img/wall.png"}
    },
    map: 
        [
          8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
          8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
          8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
          8,0,0,0,0,0,8,5,5,5,5,8,0,0,0,0,0,0,0,8,
          8,0,0,0,0,0,8,5,5,5,5,8,0,0,0,0,0,0,0,8,
          8,0,0,0,0,0,8,8,8,5,5,8,0,0,0,0,0,0,0,8,
          8,0,0,0,0,0,0,0,8,5,5,8,0,0,0,0,0,0,0,8,
          8,0,0,0,0,0,0,0,8,5,5,8,0,0,0,0,0,0,0,8,
          8,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,8,
          8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
          8,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
          8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
          8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
          8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
          8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8
        ]
  };
  World.createMap();
  
  // Expand game loop
  World.onstep = function() {
    // Add player controls
    if(World.keys.up) {
      player.move(0, -3);
    }
    if(World.keys.down) {
      player.move(0, 3);
    }
    if(World.keys.left) {
      player.move(-3, 0);
    }
    if(World.keys.right) {
      player.move(3, 0);
    }
  };
  
  // Finally, start the world
  World.start();
})();
```
