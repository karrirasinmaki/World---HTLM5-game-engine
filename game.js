var player;
var canJump = false;
var lastShot = 0;
var ammos = [];

(function() {
  // Init the world
  World.init();
  World.set({
    g: [0, 0.91]
  });

  var v = "v",
      u = "u";
  World.map = {
    w: 30, h: 15, gridW: 32, gridH: 32, background: "img/bg.png",
    entities: {
      "1": {type: World.PLAYER, img: "img/dude.png", z: -1, origin: "center", callback: function(entitie) {player = entitie;} },
      "8": {type: World.STATIC, img: "img/block1.png"},
      "9": {type: World.STATIC, img: "img/wall.png"},
      "4": {type: World.KINETIC, img: "img/target.png"},
      "v": {type: World.DECO, img: "img/water.png"},
      "u": {type: World.STATIC, img: "img/cloud-middle.png"}
    },
    layers: [
        [
          9, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,9,
          9, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,9,
          9, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,9,
          9, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,9,
          9, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,9,
          9, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,9,
          9, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,9,
          9, , , , , , , , , , , , , , , , ,4, , , , , , , , , , , ,9,
          9, , , , , , , , , , , , , , ,u,u,u,u, , , , , , , , , , ,9,
          9, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,9,
          9, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,9,
          9, , , , , , , , , ,8,8,8, , , , , , , , , , , , , , , , ,9,
          9, , , , , , , , , , , , , , , , , , , , , , , , , , , , ,9,
          9, , ,1, , , , , , , , , , , , , , ,4, , , , , ,4, , , , ,9,
          8,8,8,8,8,8,8,8,8,8,v,v,v,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
        ]
          ]
  };
  World.createMap();

  // Expand game loop
  World.onstep = function() {
    var now = new Date().getTime();

    // Add player controls
    if(World.keys.up) {
      if(canJump) player.move(0, -15);
      canJump = false;
    }
    if(!World.keys.up) {
      if(player.collisions.bottom) canJump = true;
    }
    if(World.keys.down) {
      player.move(0, 2);
    }
    if(World.keys.left) {
      player.move(-1, 0);
      if(player.transform[0] > 0) player.flipH()
    }
    if(World.keys.right) {
      player.move(1, 0);
      if(player.transform[0] < 0) player.flipH()
    }
    if(World.keys[32]) { //shoot
      if(now - 200 > lastShot) {
        var s = player.transform[0];
        var amm = new Kinetic({img: "img/ammo.png", x: player.x + (s > 0 ? player.w : 0), y: player.y, dx: 16*s, fu: 0, id: now});
        ammos.push( amm );
        World.add( amm );
        lastShot = now;
      }
    }

    // Make viewpoert to follow player
    World.viewport.x = player.x - World.viewport.w/2;

    for(var i in ammos) {
      if(ammos[i].id + 1000 < now) {
        ammos[i].x = 99999999;
        ammos.splice(i, 1);
      }
    }
  };

  // Finally, start the world
  World.start();
})();








