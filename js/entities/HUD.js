/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({
  init: function () {
    // call the constructor
    this._super(me.Container, "init", [
      50,
      50,
      me.game.viewport.width - 300,
      50,
    ]);
    this.anchorPoint.set(0, 0);

    // persistent across level change
    this.isPersistent = true;

    // make sure we use screen coordinates
    this.floating = true;

    // give a name
    this.name = "HUD";

    // add our child score object at the top right corner
    this.addChild(new game.HUD.ScoreItem(10, 15));

    // add our child score object at the top left corner
    this.addChild(new game.HUD.LifeItem(this.width, 0));
  },
});

/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
  /**
   * constructor
   */
  init: function (x, y) {
    // call the parent constructor
    // (size does not matter here)
    this._super(me.Renderable, "init", [x, y]);

    // create the font object
    // const font = (this.font = new me.BitmapFont(
    //   me.loader.getBinary("PressStart2P"),
    //   me.loader.getImage("PressStart2P")
    // ));
    this.color = new me.Color(0, 0, 0);
    this.font = new me.Text(0, 0, {
      font: "Arial",
      size: 32,
      fillStyle: this.color,
    });
    this.font.fillStyle = this.color;
    // font alignment to right, bottom
    // this.font.textAlign = "right";
    // this.font.textBaseline = "bottom";

    // local copy of the global score
    this.score = -1;
  },

  /**
   * update function
   */
  update: function () {
    // we don't do anything fancy here, so just
    // return true if the score has been updated
    if (this.score !== game.data.score) {
      this.score = game.data.score;
      return true;
    }
    return false;
  },

  /**
   * draw the score
   */
  draw: function (context) {
    // Set background container
    context.setColor("#fff");
    context.fillRect(0, 0, 200, 60);

    // this.pos.x, this.pos.y are the relative position from the screen right bottom
    this.font.draw(
      context,
      "\u0020" + "Pis-teet:" + "\u0020" + game.data.score,
      this.pos.x,
      this.pos.y
    );
  },
});

/**
 * a basic HUD item to display score
 */
game.HUD.LifeItem = me.Renderable.extend({
  /**
   * constructor
   */
  init: function (x, y) {
    // call the parent constructor
    // (size does not matter here)
    this._super(me.Renderable, "init", [x, y]);

    // local copy of the global life
    this.life = -1;

    console.log("console: ", game.data);
  },

  /**
   * update function
   */
  update: function () {
    // we don't do anything fancy here, so just
    // return true if the life has been updated
    if (this.life !== game.data.life) {
      this.life = game.data.life;
      return true;
    }
    return false;
  },

  /**
   * draw the score
   */
  draw: function (renderer) {
    // Draw life

    for (let index = 0; index < game.data.life; index++) {
      renderer.drawImage(
        me.loader.getImage("elama"),
        this.pos.x + index * 50,
        20
      );
    }
  },
});
