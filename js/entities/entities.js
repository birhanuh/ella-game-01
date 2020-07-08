/**
 * a player entity
 */
game.PlayerEntity = me.Entity.extend({
  /**
   * constructor
   */
  init: function (x, y, settings) {
    // call the constructor
    this._super(me.Entity, "init", [x, y, settings]);

    // max walking & jumping speed
    this.body.setMaxVelocity(3, 15);
    this.body.setFriction(0.4, 0);

    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

    // ensure the player is updated even when outside of the viewport
    this.alwaysUpdate = true;

    // set a renderable
    this.renderable = game.texture.createAnimationFromName([
      "monkey1",
      "monkey2",
      "monkey3",
      "monkey4",
      "monkey5",
      "monkey6",
      "monkey7",
    ]);

    // define a basic walking animation (using all frames)
    this.renderable.addAnimation("walk", [
      "monkey1",
      "monkey2",
      "monkey3",
      "monkey4",
      "monkey5",
      "monkey6",
      "monkey7",
    ]);
    this.renderable.addAnimation("stand", ["monkey1"]);

    // define a basic walking animation (using all frames)
    // this.renderable.addAnimation("walk", [0, 1, 2, 3, 4, 5, 6, 7]);

    // define a standing animation (using the first frame)
    // this.renderable.addAnimation("stand", [0]);

    // set the standing animation as default
    this.renderable.setCurrentAnimation("stand");
  },

  /**
   * update the entity
   */
  update: function (dt) {
    if (me.input.isKeyPressed("left")) {
      // flip the sprite on horizontal axis
      this.renderable.flipX(true);
      // update the default force
      this.body.force.x = -this.body.maxVel.x;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("walk")) {
        this.renderable.setCurrentAnimation("walk");
      }
    } else if (me.input.isKeyPressed("right")) {
      // unflip the sprite
      this.renderable.flipX(false);
      // update the entity velocity
      this.body.force.x = this.body.maxVel.x;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("walk")) {
        this.renderable.setCurrentAnimation("walk");
      }
    } else {
      this.body.force.x = 0;
      // change to the standing animation
      this.renderable.setCurrentAnimation("stand");
    }

    if (me.input.isKeyPressed("jump")) {
      if (!this.body.jumping && !this.body.falling) {
        // set current vel to the maximum defined value
        // gravity will then do the rest
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;

        // set the jumping flag
        this.body.jumping = true;

        // play some audio
        me.audio.play("jump");
      }
    } else {
      this.body.force.y = 0;
    }

    // apply physics to the body (this moves the entity)
    this.body.update(dt);

    // handle collisions against other shapes
    me.collision.check(this);

    // If object in not in viewport it probably has died
    if (!this.inViewport) {
      // fade the camera to white upon dying, reload the level, and then fade out back
      me.game.viewport.fadeIn("#fff", 150, function () {
        me.audio.play("die", false);
        me.levelDirector.reloadLevel();
        me.game.viewport.fadeOut("#fff", 150);
        me.audio.pause("die");
      });
    }

    // return true if we moved or if the renderable was updated
    return (
      this._super(me.Entity, "update", [dt]) ||
      this.body.vel.x !== 0 ||
      this.body.vel.y !== 0
    );
  },

  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision: function (response, other) {
    switch (response.b.body.collisionType) {
      case me.collision.types.WORLD_SHAPE:
        // Simulate a platform object
        if (other.type === "platform") {
          if (
            this.body.falling &&
            !me.input.isKeyPressed("down") &&
            // Shortest overlap would move the player upward
            response.overlapV.y > 0 &&
            // The velocity is reasonably fast enough to have penetrated to the overlap depth
            ~~this.body.vel.y >= ~~response.overlapV.y
          ) {
            // Disable collision on the x axis
            response.overlapV.x = 0;

            // Repond to the platform (it is solid)
            return true;
          }

          // Do not respond to the platform (pass through)
          return false;
        }
        break;

      case me.collision.types.ENEMY_OBJECT:
        if (response.overlapV.y > 0 && !this.body.jumping) {
          // bounce (force jump)
          this.body.falling = false;
          this.body.vel.y = -this.body.maxVel.y * me.timer.tick;

          // set the jumping flag
          this.body.jumping = true;

          me.audio.play("stomp");
        } else {
          // let's flicker in case we touched an enemy
          this.renderable.flicker(750);
        }

      // Fall through

      default:
        // Do not respond to other objects (e.g. coins)
        return false;
    }

    // Make the object solid
    return true;
  },
});

/**
 * a Coin entity
 */
game.CoinEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    console.log("CoinEntity settings", settings);
    delete settings.image;
    // call the parent constructor
    this._super(me.CollectableEntity, "init", [x, y, settings]);

    // set a renderable
    this.renderable = game.texture.createAnimationFromName([
      "coin1",
      "coin2",
      "coin3",
      "coin4",
      "coin5",
      "coin6",
    ]);

    // this.coin = new me.Sprite(this.pos.x, this.pos.y, {
    //   image: game.texture,
    //   region: "coin1",
    //   width: 32,
    //   height: 32,
    //   framewidth: 32,
    //   frameheight: 32,
    //   alpha: 0.25,
    //   anchorPoint: new me.Vector2d(0, 0),
    // });

    // me.game.world.addChild(this.coin, 4);
    console.log("CoinEntity image", this);

    this.body = new me.Body(this);
    this.body.addShape(new me.Rect(16, 16, this.width, this.height));
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision: function (response, other) {
    // do something when collected

    // play a "coin collected" sound
    me.audio.play("cling");

    // give some score
    game.data.score += 250;

    // make sure it cannot be collected "again"
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);

    // remove it
    me.game.world.removeChild(this);
    // me.game.world.removeChild(this.coin);
  },
});

/**
 * Bird enemy entity
 */
game.BirdEnemyEntity = me.Entity.extend({
  /**
   * constructor
   */
  init: function (x, y, settings) {
    // save the area size defined in Tiled
    var width = settings.width || settings.framewidth;

    // adjust the setting size to the sprite one
    settings.width = settings.framewidth;
    settings.height = settings.frameheight;

    // redefine the default shape (used to define path) with a shape matching the renderable
    settings.shapes[0] = new me.Rect(
      0,
      0,
      settings.framewidth,
      settings.frameheight
    );

    // call the super constructor
    this._super(me.Entity, "init", [x, y, settings]);

    // set start/end position based on the initial area size
    x = this.pos.x;
    this.startX = x;
    this.endX = x + width - settings.framewidth;
    this.pos.x = x + width - settings.framewidth;

    // apply gravity setting if specified
    this.body.gravity.y =
      typeof settings.gravity !== "undefined"
        ? settings.gravity
        : me.sys.gravity;

    this.walkLeft = false;

    // body walking & flying speed
    this.body.force.set(settings.velX || 1, settings.velY || 0);
    this.body.setMaxVelocity(settings.velX || 1, settings.velY || 0);

    // set a "enemyObject" type
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;

    // don't update the entities when out of the viewport
    this.alwaysUpdate = false;

    // a specific flag to recognize these enemies
    this.isMovingEnemy = true;

    // set a renderable
    this.renderable = game.texture.createAnimationFromName([
      "fly_normal",
      "fly_fly",
      "fly_dead",
    ]);

    // custom animation speed ?
    if (settings.animationspeed) {
      this.renderable.animationspeed = settings.animationspeed;
    }

    // walking animatin
    this.renderable.addAnimation("walk", ["fly_normal", "fly_fly"]);
    // dead animatin
    this.renderable.addAnimation("dead", ["fly_dead"]);

    // set default one
    this.renderable.setCurrentAnimation("walk");

    // set the renderable position to bottom center
    this.anchorPoint.set(0.5, 1.0);
  },
  /**
   * manage the enemy movement
   */
  update: function (dt) {
    if (this.alive) {
      if (this.walkLeft && this.pos.x <= this.startX) {
        this.body.force.x = Math.abs(this.body.force.x);
        this.walkLeft = false;
        this.renderable.flipX(true);
      } else if (!this.walkLeft && this.pos.x >= this.endX) {
        this.body.force.x = -Math.abs(this.body.force.x);
        this.walkLeft = true;
        this.renderable.flipX(false);
      }

      // check & update movement
      this.body.update(dt);
    }

    // return true if we moved of if flickering
    return (
      this._super(me.Entity, "update", [dt]) ||
      this.body.vel.x !== 0 ||
      this.body.vel.y !== 0
    );
  },

  /**
   * collision handle
   */
  onCollision: function (response) {
    if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
      // res.y >0 means touched by something on the bottom
      // which mean at top position for this one
      if (this.alive && response.overlapV.y > 0) {
        // make it dead
        this.alive = false;
        //avoid further collision and delete it
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        // set dead animation
        this.renderable.setCurrentAnimation("dead");
        // make it flicker and call destroy once timer finished
        var self = this;
        this.renderable.flicker(750, function () {
          me.game.world.removeChild(self);
        });
        // dead sfx
        me.audio.play("die", false);
        // give some score
        game.data.score += 150;
      } else {
        console.log("BirdEnemyEntity collision: ", this);
        console.log("Response: ", response);
      }

      return false;
    }

    return true;
  },
});

/**
 * Slime enemy entity
 */
game.SlimeEnemyEntity = me.Entity.extend({
  /**
   * constructor
   */
  init: function (x, y, settings) {
    // save the area size defined in Tiled
    var width = settings.width || settings.framewidth;

    // adjust the setting size to the sprite one
    settings.width = settings.framewidth;
    settings.height = settings.frameheight;

    // redefine the default shape (used to define path) with a shape matching the renderable
    settings.shapes[0] = new me.Rect(
      0,
      0,
      settings.framewidth,
      settings.frameheight
    );

    // call the super constructor
    this._super(me.Entity, "init", [x, y, settings]);

    // set start/end position based on the initial area size
    x = this.pos.x;
    this.startX = x;
    this.endX = x + width - settings.framewidth;
    this.pos.x = x + width - settings.framewidth;

    // apply gravity setting if specified
    this.body.gravity.y =
      typeof settings.gravity !== "undefined"
        ? settings.gravity
        : me.sys.gravity;

    this.walkLeft = false;

    // body walking & flying speed
    this.body.force.set(settings.velX || 1, settings.velY || 0);
    this.body.setMaxVelocity(settings.velX || 1, settings.velY || 0);

    // set a "enemyObject" type
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;

    // don't update the entities when out of the viewport
    this.alwaysUpdate = false;

    // a specific flag to recognize these enemies
    this.isMovingEnemy = true;

    // set a renderable
    this.renderable = game.texture.createAnimationFromName([
      "slime_normal",
      "slime_walk",
      "slime_dead",
    ]);

    // custom animation speed ?
    if (settings.animationspeed) {
      this.renderable.animationspeed = settings.animationspeed;
    }

    // walking animatin
    this.renderable.addAnimation("walk", ["slime_normal", "slime_walk"]);
    // dead animatin
    this.renderable.addAnimation("dead", ["slime_dead"]);

    // set default one
    this.renderable.setCurrentAnimation("walk");

    // set the renderable position to bottom center
    this.anchorPoint.set(0.5, 1.0);
  },
  /**
   * manage the enemy movement
   */
  update: function (dt) {
    if (this.alive) {
      if (this.walkLeft && this.pos.x <= this.startX) {
        this.body.force.x = Math.abs(this.body.force.x);
        this.walkLeft = false;
        this.renderable.flipX(true);
      } else if (!this.walkLeft && this.pos.x >= this.endX) {
        this.body.force.x = -Math.abs(this.body.force.x);
        this.walkLeft = true;
        this.renderable.flipX(false);
      }

      // check & update movement
      this.body.update(dt);
    }

    // return true if we moved of if flickering
    return (
      this._super(me.Entity, "update", [dt]) ||
      this.body.vel.x !== 0 ||
      this.body.vel.y !== 0
    );
  },

  /**
   * collision handle
   */
  onCollision: function (response) {
    if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
      // res.y >0 means touched by something on the bottom
      // which mean at top position for this one
      if (this.alive && response.overlapV.y > 0) {
        // make it dead
        this.alive = false;
        //avoid further collision and delete it
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        // set dead animation
        this.renderable.setCurrentAnimation("dead");
        // make it flicker and call destroy once timer finished
        var self = this;
        this.renderable.flicker(750, function () {
          me.game.world.removeChild(self);
        });
        // dead sfx
        me.audio.play("die", false);
        // give some score
        game.data.score += 150;
      } else {
        console.log("SlimeEnemyEntity collision: ", this);
        console.log("Response: ", response);
      }

      return false;
    }
    return true;
  },
});

/**
 * an enemy Entity
 */
game.EnemyEntity = me.Sprite.extend({
  init: function (x, y, settings) {
    // save the area size as defined in Tiled
    var width = settings.width;

    // define this here instead of tiled
    settings.image = "wheelie_right";

    // adjust the size setting information to match the sprite size
    // so that the entity object is created with the right size
    settings.framewidth = settings.width = 64;
    settings.frameheight = settings.height = 64;

    // call the parent constructor
    this._super(me.Sprite, "init", [x, y, settings]);

    // add a physic body
    this.body = new me.Body(this);
    // add a default collision shape
    this.body.addShape(new me.Rect(0, 0, this.width, this.height));
    // configure max speed and friction
    this.body.setMaxVelocity(4, 6);
    this.body.setFriction(0.4, 0);
    // enable physic collision (off by default for basic me.Renderable)
    this.isKinematic = false;

    // set start/end position based on the initial area size
    x = this.pos.x;
    this.startX = x;
    this.pos.x = this.endX = x + width - this.width;
    //this.pos.x  = x + width - this.width;

    // to remember which side we were walking
    this.walkLeft = false;

    // make it "alive"
    this.alive = true;
  },

  // manage the enemy movement
  update: function (dt) {
    if (this.alive) {
      if (this.walkLeft && this.pos.x <= this.startX) {
        this.walkLeft = false;
        this.body.force.x = this.body.maxVel.x;
      } else if (!this.walkLeft && this.pos.x >= this.endX) {
        this.walkLeft = true;
        this.body.force.x = -this.body.maxVel.x;
      }

      this.flipX(this.walkLeft);
    } else {
      this.body.force.x = 0;
    }
    // check & update movement
    this.body.update(dt);

    // handle collisions against other shapes
    me.collision.check(this);

    // return true if we moved or if the renderable was updated
    return (
      this._super(me.Sprite, "update", [dt]) ||
      this.body.vel.x !== 0 ||
      this.body.vel.y !== 0
    );
  },

  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision: function (response, other) {
    if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
      // res.y >0 means touched by something on the bottom
      // which mean at top position for this one
      if (this.alive && response.overlapV.y > 0 && response.a.body.falling) {
        this.renderable.flicker(750);
      }
      return false;
    }
    // Make all other objects solid
    return true;
  },
});
