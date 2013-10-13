// ENTITIE
  var Entitie = function() {
    var thisEntitie = this;

    //Basic settings
    this.type = "deco";
    this.z = 0;
    this.dx = 0;
    this.dy = 0;

    this.getCPos = function(corner) {
      // Gets one corner's {x, y} position
      if(corner === 0) return {x: this.x, y: this.y};
      if(corner === 1) return {x: this.x + this.w, y: this.y};
      if(corner === 2) return {x: this.x, y: this.y + this.h};
      if(corner === 3) return {x: this.x + this.w, y: this.y + this.h};
    };

    // Create entitie
    this.create = function() {
      for(var i in this.params) {
        this[i] = this.params[i];
      }

      this.image = new Image();
      this.image.onload = function() {
        thisEntitie.w = this.width;
        thisEntitie.h = this.height;
      };
      this.image.src = this.params.img;
    };
  };

  // Call this every step
  Entitie.prototype.update = function() {
    this.x += this.dx;
    this.y += this.dy;
    this.lastX = this.x;
    this.lastY = this.y;

    this.dx = 0; this.dy = 0;
  };

  var DecoEntitie = function(params) {
    this.params = params;
    this.create();
  };
  DecoEntitie.prototype = new Entitie();
// END ENTITIE

// COLLIDABLE ENTITIE
  var CollidableEntitie = function() {
    this.collidable = true;
    this.collision = false;
    this.collisions = {top: false, right: false, bottom: false, left: false};
  }
  CollidableEntitie.prototype = new Entitie();

  // Checks if entitie collides with other entitie and returns object of collisions
  CollidableEntitie.prototype.collidesWith = function(entitie) {
    if(this === entitie || !entitie.collidable) return false;
    var top = this.getCPos(1).y +this.dy,
        right = this.getCPos(1).x +this.dx,
        bottom = this.getCPos(2).y +this.dy,
        left = this.getCPos(0).x +this.dx;
    if( bottom >= entitie.y && top <= entitie.y + entitie.h
      && right >= entitie.x && left <= entitie.x + entitie.w) {

      this.collisions.top = (top >= entitie.y);
      this.collisions.right = (right <= entitie.x);
      this.collisions.bottom = (bottom <= entitie.y);
      this.collisions.left = (left >= entitie.x);
      this.dx = 0; this.dy = 0;
      return true;
    }
    return false;
  };
// END COLLIDABLE ENTITIE

// STATIC ENTITIE
  var StaticEntitie = function(params) {
    this.type = "static";
    this.params = params;
    this.create();
  };
  StaticEntitie.prototype = new CollidableEntitie();
// END STATIC ENTITIE

// PLAYER
  var Player = function(params) {
    this.type = "player";
    this.params = params;
    this.create();
  };
  Player.prototype = new CollidableEntitie();

  Player.prototype.move = function(x, y) {
    if(this.collisions.left || this.collisions.right) x = 0;
    if(this.collisions.top || this.collisions.bottom) y = 0;

    this.dx += x;
    this.dy += y;
  };
// END PLAYER
