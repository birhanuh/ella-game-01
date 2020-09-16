export const ControlButton = me.GUI_Object.extend({
  init: function (x, y, settings) {
    if (!settings) {
      settings = {
        region: game.texture,
        image: "right",
        framewidth: 80,
        frameheight: 80,
        width: 80,
        height: 80,
      };
    }
    this._super(me.GUI_Object, "init", [x, y, settings]);
    this.type = settings.type || "right";
    me.input.registerPointerEvent("pointerdown", this, this.onHold.bind(this));
    me.input.registerPointerEvent("pointerup", this, this.onRelease.bind(this));
    me.input.registerPointerEvent(
      "pointercancel",
      this,
      this.onRelease.bind(this)
    );
  },

  onClick: function () {
    console.log("click meee");
  },

  onHold: function (event) {
    switch (this.type) {
      case "right":
        me.input.triggerKeyEvent(me.input.KEY.RIGHT, true);
        break;
      case "left":
        me.input.triggerKeyEvent(me.input.KEY.LEFT, true);
        break;
      case "up":
        me.input.triggerKeyEvent(me.input.KEY.UP, true);
        break;
      default:
        me.input.triggerKeyEvent(me.input.KEY.RIGHT, true);
        break;
    }
  },

  onRelease: function (event) {
    switch (this.type) {
      case "right":
        me.input.triggerKeyEvent(me.input.KEY.RIGHT, false);
        break;
      case "left":
        me.input.triggerKeyEvent(me.input.KEY.LEFT, false);
        break;
      case "up":
        me.input.triggerKeyEvent(me.input.KEY.UP, false);
        break;
      default:
        me.input.triggerKeyEvent(me.input.KEY.RIGHT, false);
        break;
    }
  },
});
