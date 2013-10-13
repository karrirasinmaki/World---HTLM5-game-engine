var World = {
  // Entitie types
  PLAYER: "player",
  STATIC: "statc",
  DECO: "deco", //just decoration, no collision

  // Basic vars
  canvas: undefined,
  c: undefined,
  map: undefined,
  w: 800, //width
  h: 600, //height
  g: 9, //gravity
  entities: [], //array that stores our game entities
  running: false, //if game is running
  keys: {}, //key events will be stored here

  sortByZ: function(a,b) {
    if(a.z === b.z) return a.id - b.id;
    return a.z - b.z;
  },

  init: function(callback) {
    // Create canvas and add it to body
    World.canvas = document.createElement("canvas");
    World.canvas.width = World.w;
    World.canvas.height = World.h;
    document.body.appendChild(World.canvas);

    // Get context
    World.c = World.canvas.getContext("2d");

    // Start listening key events
    World.listenKeys();
  },

  step: function() {
    // This is our main game loop

    // Calls onstep function if exists
    if(World.onstep) World.onstep();

    // Clear screen
    World.c.clearRect(0, 0, World.w, World.h);
    World.c.drawImage(World.bgLayer, 0, 0);

    // Loop thru game entities
    for(var i in World.entities) {
      var entitie = World.entities[i];

      // Check collision
      if(entitie.type === World.PLAYER) {
        entitie.collision = false;
        entitie.collisions.top = entitie.collisions.right = entitie.collisions.bottom = entitie.collisions.left = false;
        for(var j in World.entities) {
          var entitieWith = World.entities[j];
          if(entitie.collidesWith(entitieWith)) entitie.collision = true;
        }
      }

      // Update entitie
      entitie.update();

      // Draw entitie on canvas
      World.c.drawImage(entitie.image, entitie.x, entitie.y);
    }

    // Request next step
    if(World.running) {
      window.requestAnimationFrame(World.step);
    }
  },

  // Starts world
  start: function() {
    World.running = true;
    World.step();
  },

  // Adds entitie to entities array
  add: function(entitie) {
    World.entities.push(entitie);
  },

  // Listens keys
  listenKeys: function() {
    function setKey(e) {
      e.preventDefault();
      if(e.type === "keydown" || e.type === "keyup") {
        World.keys[e.keyIdentifier.toLowerCase()] = (e.type === "keydown");
        World.keys[e.keyCode] = (e.type === "keydown");
      }
    };
    addEventListener("keydown", setKey, false);
    addEventListener("keyup", setKey, false);
  },

  // Creates map
  createMap: function() {
    // Init vars
    var mapW = World.map.w,
        mapH = World.map.h,
        gridW = World.map.gridW,
        gridH = World.map.gridH;

    // Create backgroud
    World.bgLayer = document.createElement("canvas");
    World.bgLayer.width = mapW * gridW;
    World.bgLayer.height = mapH * gridH;
    var bgctx = World.bgLayer.getContext("2d");
    var bg = new Image();
        bg.onload = function() {
          for(var y=0; y<mapH; y++) {
            for(var x=0; x<mapW; x++) {
              bgctx.drawImage(bg, x * gridW, y * gridH);
            }
          }
        };
        bg.src = World.map.background;

    // Parse map
    parseMap();

    // Sort entities array according z-index
    World.entities.sort(World.sortByZ);

    // Map parsing function
    function parseMap() {
      for(var i=0, x=0, y=0; i<World.map.map.length; i++) {

        var block = World.map.map[i],
            posX = x * gridW,
            posY = y * gridH;

        // Map entities
        var entitieData = World.map.entities[""+block];
        if(entitieData) {
          var entitie;
          entitieData.x = posX;
          entitieData.y = posY;
          entitieData.id = new Date().getTime() + i;
          switch(entitieData.type) {
            case World.PLAYER:
              entitie = new Player(entitieData);
              break;
            case World.STATIC:
              entitie = new StaticEntitie(entitieData);
              break;
            default:
              entitie = new DecoEntitie(entitieData);
              break;
          }
          World.add( entitie );
          if(entitieData.callback) entitieData.callback(entitie);
        }

        // Keep track x and y pos of map
        x++;
        if(x > mapW-1) {
          x = 0;
          y++;
        }
      }
    }
  }
};
