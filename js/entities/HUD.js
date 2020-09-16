/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({
  init: function () {
    // call the constructor
    this._super(me.Container, "init", [
      20,
      20,
      me.game.viewport.width - 180,
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
    this.addChild(new game.HUD.LifeItem(this.width, 15));

    // add our child credit object at the bottom right corner
    this.addChild(
      new game.HUD.CreditItem(
        me.game.viewport.width / 2 - 125,
        me.game.viewport.height - 110
      )
    );

    this.addChild(
      new game.ControlButton(80, me.game.viewport.height - 80, {
        image: game.texture,
        region: "up",
        type: "up",
        width: 80,
        height: 80,
        framewidth: 80,
        frameheight: 80,
      }),
      1
    );

    this.addChild(
      new game.ControlButton(
        me.game.viewport.width - 80,
        me.game.viewport.height - 80,
        {
          image: game.texture,
          region: "right",
          type: "right",
          width: 80,
          height: 80,
          framewidth: 80,
          frameheight: 80,
        }
      ),
      1
    );

    this.addChild(
      new game.ControlButton(
        me.game.viewport.width - 200,
        me.game.viewport.height - 80,
        {
          image: game.texture,
          region: "left",
          type: "left",
          width: 80,
          height: 80,
          framewidth: 80,
          frameheight: 80,
        }
      ),
      1
    );
  },
});

/**
 * Score HUD item to display score
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
    this.font = new me.BitmapText(0, 0, {
      fontData: me.loader.getBinary("PressStart2P"),
      font: me.loader.getImage("PressStart2P"),
    });
    // this.tint = new me.Color(0, 0, 0, 0.8);

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
    // this.pos.x, this.pos.y are the relative position from the screen right bottom
    this.font.draw(
      context,
      "Pis-teet:" + "\u0020" + game.data.score,
      this.pos.x,
      this.pos.y
    );
  },
});

/**
 * Life HUD item to display score
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

    // Set life icon
    const lifeIcon = new me.Sprite(0, 0, {
      image: game.texture,
      region: "elama",
    });
    this.lifeIcon = lifeIcon;
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
        this.pos.y
      );
    }

    // for (let index = 0; index < game.data.lives; index++) {
    //   (this.lifeIcon.pos.x = this.pos.x + index * 50),
    //     (this.lifeIcon.pos.y = this.pos.y);
    //   this.lifeIcon.draw(renderer, 0, 0);
    // }
  },
});

/**
 * Credit HUD item to display credit
 */
game.HUD.CreditItem = me.Renderable.extend({
  /**
   * constructor
   */
  init: function (x, y) {
    // call the parent constructor
    // (size does not matter here)
    this._super(me.Renderable, "init", [x, y]);

    // create the font object
    this.font = new me.BitmapText(0, 0, {
      fontData: me.loader.getBinary("OpenSansLight"),
      font: me.loader.getImage("OpenSansLight"),
      size: 0.6,
      textBaseline: "middle",
    });
    this.tint = new me.Color(0, 0, 0);

    // font alignment to right, bottom
    // this.font.textAlign = "right";
    // this.font.textBaseline = "bottom";
  },

  /**
   * draw the score
   */
  draw: function (context) {
    // Set background container
    context.setColor("#fff");
    context.fillRect(this.pos.x, this.pos.y, 250, 55);

    // this.pos.x, this.pos.y are the relative position from the screen right bottom
    this.font.draw(
      context,
      "Developers:" + "\u0020" + "Ella & Birhanu",
      this.pos.x + 10,
      this.pos.y + 20
    );
  },
});
