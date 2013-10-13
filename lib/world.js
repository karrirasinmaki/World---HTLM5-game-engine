var World = {
  // Entitie types
  PLAYER: "player",
  KINETIC: "kinetic",
  STATIC: "statc",
  DECO: "deco", //just decoration, no collision

  // Basic vars
  canvas: undefined,
  c: undefined,
  map: undefined,
  w: 800, //width
  h: 600, //height
  g: [0,0], //gravity
  entities: [], //array that stores our game entities
  running: false, //if game is running
  keys: {}, //key events will be stored here

  viewport: {posx: 0, posy: 0, w: 800, h: 600,
              get x() { return this.posx; },
              set x(value) {
                // Block viewport to look outside of map
                var mapWidth = World.map.w * World.map.gridW;
                if(value + this.w > mapWidth) value = mapWidth - this.w;
                if(value < 0) value = 0;
                this.posx = Math.round(value);
              },
              get y() { return this.posy; },
              set y(value) {
                // Block viewport to look outside of map
                var mapHeight = World.map.h * World.map.gridH;
                if(value + this.h > mapHeight) value = mapHeight - this.h;
                if(value < 0) value = 0;
                this.posy = Math.round(value);
              }
            },

  sortByZ: function(a,b) {
    if(a.z === b.z) return a.id - b.id;
    return a.z - b.z;
  },

  // Initializing
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

  set: function(params) {
    for(var i in params) {
      World[i] = params[i];
    }
  },

  // This is our main game loop
  step: function() {

    // Calls onstep function if exists
    if(World.onstep) World.onstep();

    // Transform according viewport
    World.c.restore();
    World.c.save();
    World.c.translate(-World.viewport.x, -World.viewport.y);

    // Clear screen
    World.c.clearRect(0, 0, World.w, World.h);

    // Draw bg layer
    World.c.drawImage(World.bgLayer, 0, 0);

    // Loop thru game entities
    for(var i in World.entities) {
      var entitie = World.entities[i];

      // Update entitie
      entitie.update();

      // Check collision
      if(entitie.type === World.PLAYER || entitie.type === World.KINETIC) {
        entitie.collision = false;
        entitie.collisions.top = entitie.collisions.right = entitie.collisions.bottom = entitie.collisions.left = false;
        for(var j in World.entities) {
          var entitieWith = World.entities[j];
          if(entitie.collidesWith(entitieWith)) entitie.collision = true;
        }
      }

      // Transform entitie
      World.c.save();
      World.c.transform(
        entitie.transform[0], entitie.transform[1],
        entitie.transform[2], entitie.transform[3],
        entitie.transform[4] + entitie.x, entitie.transform[5] + entitie.y
      );

      // Draw entitie on canvas
      World.c.drawImage(entitie.image, 0, 0);
      World.c.restore();
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

  // Pauses world
  pause: function() {
    World.running = false;
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

    // Parse map layers
    for(var i in World.map.layers) parseMap(World.map.layers[i]);

    // Sort entities array according z-index
    World.entities.sort(World.sortByZ);

    // Map parsing function
    function parseMap(layer) {
      for(var i=0, x=0, y=0; i<layer.length; i++) {

        var block = layer[i],
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
            case World.KINETIC:
              entitie = new Kinetic(entitieData);
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








