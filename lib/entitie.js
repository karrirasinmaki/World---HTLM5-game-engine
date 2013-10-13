  var Transformation = function() {
    this.transformation = {
      scaleHor: 1,
      skewHor: 0,
      skewVer: 0,
      scaleVer: 1,
      moveHor: 0,
      moveVer: 0
    }
  };

// ENTITIE
  var Entitie = function() {
    //Basic settings
    this.type = "deco";
    this.z = 0;
    this.dx = 0;
    this.dy = 0;
    this.origin = {x: 0, y: 0};

    this.transform = [1, 0, 0, 1, 0, 0];

    Object.defineProperties(this, {
      "left": { get: function() { return this.get("left"); } },
      "top": { get: function() { return this.get("top"); } },
      "right": { get: function() { return this.get("right"); } },
      "bottom": { get: function() { return this.get("bottom"); } },
      "center": { get: function() { return this.get("center"); } }
    });

    // Create entitie
    this.create = function() {
      for(var i in this.params) {
        this[i] = this.params[i];
      }

      var thisEntitie = this;
      this.image = new Image();
      this.image.onload = function() {
        thisEntitie.w = this.width;
        thisEntitie.h = this.height;

        if(thisEntitie.origin === "center") thisEntitie.origin = {x: thisEntitie.w/2, y: thisEntitie.h/2};
      };
      this.image.src = this.params.img;
    };
  };

  // Transformation
  Entitie.prototype.flipH = function() {
    var scaleH = this.transform[0] * -1;
    this.transform = [
      scaleH, this.transform[1],
      this.transform[2], this.transform[3],
      this.transform[4] - scaleH*this.w, this.transform[5]
    ];
  }

  // Call this every step
  Entitie.prototype.update = function() {
    this.lastX = this.x;
    this.lastY = this.y;
  };

  // Get corner position
  Entitie.prototype.getCPos = function(corner) {
    // Gets one corner's {x, y} position
    if(corner === "left top") return {x: this.x, y: this.y};
    if(corner === "right top") return {x: this.x + this.w, y: this.y};
    if(corner === "right bottom") return {x: this.x, y: this.y + this.h};
    if(corner === "left bottom") return {x: this.x + this.w, y: this.y + this.h};
  };

  Entitie.prototype.get = function(command) {
    if(command === "left") return {x: this.x, y: this.y + this.h/2}; //left
    if(command === "top") return {x: this.x + this.w/2, y: this.y}; //top
    if(command === "right") return {x: this.x + this.w, y: this.y + this.h/2}; //right
    if(command === "bottom") return {x: this.x + this.w/2, y: this.y + this.h}; //bottom
    if(command === "center") return {x: this.x + this.w/2, y: this.y + this.h/2}; //center

    if(command.indexOf("corner ") !== -1) return this.getCPos(command.replace("corner ", "") );
  };

  // Line from this entitie to other entitie
  Entitie.prototype.lineTo = function(entitie) {
    var ec = entitie.get("center");
    var tc = this.get("center");

    return this.lineFromPointToPoint(ec, tc);
  };

  // Line between two points
  Entitie.prototype.lineFromPointToPoint = function(pointA, pointB) {
    var dY = pointA.y - pointB.y;
    var dX = pointA.x - pointB.x;
    var angle = Math.atan2(dY, dX) * 180 / Math.PI;
    var length = Math.sqrt((pointA.x -= pointB.x) * pointA.x + (pointA.y -= pointB.y) * pointA.y);

    return {angle: angle, length: length};
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
    this.collisions = {x: 0, y: 0, top: false, right: false, bottom: false, left: false};
  }
  CollidableEntitie.prototype = new Entitie();

  // Checks if entitie collides with other entitie and returns object of collisions
  CollidableEntitie.prototype.collidesWith = function(entitie) {
    if(this === entitie || !entitie.collidable) return false;

    var top = this.top,
        right = this.right,
        bottom = this.bottom,
        left = this.left,
        center = this.center;

    var line = this.lineTo(entitie);
    var absDy = Math.abs(this.dy);
    var absDx = Math.abs(this.dx);

    /*if( bottom.y + this.dy > entitie.y && top.y + this.dy < entitie.y + entitie.h
      && right.x + this.dx > entitie.x && left.x + this.dx < entitie.x + entitie.w) {
        */
    /*
    if( line.length < this.this.w/2 + entitie.w/2 + absDx
        || line.length < this.h/2 + entitie.h/2 + absDy ) {
        */
    if( line.length < this.w/2 + entitie.w/2 + absDx
       || line.length < this.h/2 + entitie.h/2 + absDy ) {

      /*
      if(top >= entitie.y) this.collisions.top = true;
      if(right <= entitie.x) this.collisions.right = true;
      if(bottom >= entitie.y) this.collisions.bottom = true;
      if(left >= entitie.x + entitie.w) this.collisions.left = true;
      */

      /*
      if(angle >= 315 && angle <= 45) this.collisions.right = true;
      if(angle >= 45 && angle <= 135) this.collisions.bottom = true;
      if(angle >= 135 && angle <= 225) this.collisions.left = true;
      if(angle >= 225 && angle <= 315) this.collisions.top = true;
      */

      this.collisions = {x: 0, y: 0, top: false, right: false, bottom: false, left: false};

      if(this.lineFromPointToPoint(this.left, entitie.right).length < entitie.h*0.8 + absDy) {
        this.collisions.left = true;
        this.collisions.x = this.left.x - entitie.right.x;
      }
      if(this.lineFromPointToPoint(this.top, entitie.bottom).length < entitie.w*0.8 + absDx) {
        this.collisions.top = true;
        this.collisions.y = this.top.y - entitie.bottom.y;
      }
      if(this.lineFromPointToPoint(this.right, entitie.left).length < entitie.h*0.8 + absDy) {
        this.collisions.right = true;
        this.collisions.x = this.right.x - entitie.left.x;
      }
      if(this.lineFromPointToPoint(this.bottom, entitie.top).length < entitie.w*0.8 + absDx) {
        this.collisions.bottom = true;
        this.collisions.y = this.bottom.y - entitie.top.y;
      }

      return true;
    }
    return false;
  };
// END COLLIDABLE ENTITIE

// KINETIC ENTITIE
  var KineticEntitie = function() {
    this.basicPhysics = true;
    this.fu = 0.1;
    this.basicUpdate = Entitie.prototype.update;
  };
  KineticEntitie.prototype = new CollidableEntitie();
  KineticEntitie.prototype.update = function() {
    this.basicUpdate();
    this.dy += World.g[1];
    this.dx *= (1 - this.fu);

    if(this.collisions.left && this.dx < 0) this.dx *= -0.2;
    if(this.collisions.top && this.dy < 0) this.dy *= -0.2;
    if(this.collisions.right && this.dx > 0) this.dx *= -0.2;
    if(this.collisions.bottom && this.dy > 0) this.dy *= -0.2;

    if(Math.abs(this.dx) < 0.2 ) this.dx = 0;
    if(Math.abs(this.dy) < 0.2 ) this.dy = 0;

    this.x += this.dx;
    this.y += this.dy;
  };
// END KINETIC ENTITIE

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
  Player.prototype = new KineticEntitie();

  Player.prototype.move = function(x, y) {
    if(this.collisions.left && this.dx < 0) this.dx *= -0.2;
    if(this.collisions.top && this.dy < 0) this.dy *= -0.2;
    if(this.collisions.right && this.dx > 0) this.dx *= -0.2;
    if(this.collisions.bottom && this.dy > 0) this.dy *= -0.2;

    this.dx += x;
    this.dy += y;
  };
// END PLAYER

  var Kinetic = function(params) {
    this.type = "kinetic";
    this.params = params;
    this.create();
  };
  Kinetic.prototype = new KineticEntitie();







