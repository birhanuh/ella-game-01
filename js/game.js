/* Game namespace */
var game = {
  // an object where to store game information
  data: {
    // score
    score: 0,
    // score
    life: 3,
  },

  // Run on page load.
  onload: function () {
    // Initialize the video.
    if (
      !me.video.init(1024, 512, {
        wrapper: "screen",
        renderer: me.video.AUTO,
        scale: "auto",
        scaleMethod: "flex",
        doubleBuffering: true,
      })
    ) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // set and load all resources.
    // (this will also automatically switch to the loading screen)
    me.loader.preload(game.resources, this.loaded.bind(this));
  },

  // Run on game resources loaded.
  loaded: function () {
    me.debug.renderHitBox = true;

    // set the "Play/Ingame" Screen Object
    me.state.set(me.state.MENU, new game.TitleScreen());

    me.state.set(me.state.GAME_OVER, new game.RestartScreen());

    // set the "Play/Ingame" Screen Object
    me.state.set(me.state.PLAY, new game.PlayScreen());

    // set a global fading transition for the screen
    me.state.transition("fade", "#FFFFFF", 250);

    // register our player entity in the object pool
    // me.pool.register("mainPlayer", game.PlayerEntity);
    // me.pool.register("CoinEntity", game.CoinEntity);
    // me.pool.register("EnemyEntity", game.EnemyEntity);

    me.pool.register("player", game.PlayerEntity);
    me.pool.register("coin", game.CoinEntity);
    me.pool.register("fly", game.FlyEnemyEntity);
    me.pool.register("slime", game.SlimeEnemyEntity);
    me.pool.register("dimond", game.DimondEntity);

    // enable the keyboard
    me.input.bindKey(me.input.KEY.LEFT, "left");
    me.input.bindKey(me.input.KEY.RIGHT, "right");
    // map X, Up Arrow and Space for jump
    me.input.bindKey(me.input.KEY.X, "jump", true);
    me.input.bindKey(me.input.KEY.UP, "jump", true);
    me.input.bindKey(me.input.KEY.SPACE, "jump", true);

    // create a new texture object under the `game` namespace
    game.texture = new me.video.renderer.Texture(
      me.loader.getJSON("texture"),
      me.loader.getImage("texture")
    );

    // start the game
    me.state.change(me.state.PLAY);
    // display the menu title
    // me.state.change(me.state.MENU);
  },
};
