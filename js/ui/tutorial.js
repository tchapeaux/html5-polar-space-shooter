"use strict";

var Tutorial = function() {
    this.steps = 0;
    this.currenttitlecolor = "cyan";
    this.timecounter = 0;
}

Tutorial.prototype.switchColor = function() {
    if (this.currenttitlecolor == "cyan") {
        this.currenttitlecolor = "gold";
    } else {
        this.currenttitlecolor = "cyan";
    }
};

Tutorial.prototype.update = function(ds, keysPressed) {
    this.timecounter += ds;
    if (this.timecounter > 0.75) { // Timing was guesstimated manually based on bgm
        this.switchColor();
        this.timecounter = 0;
    }

    if (keysPressed.has(32) /* SPACE */) {
        // SPAAAAAAAAAAACE
        this.steps += 1;
    }
    keysPressed.delete(32);
};

Tutorial.prototype.draw = function(ctx) {
    ctx.textAlign = "center";

    var textSizeRatio = worldSize() / (WORLD_SIZE_SU);

    ctx.fillStyle = this.currenttitlecolor;
    var maxWidth = 100;  // fit to 100 SU
    ctx.font = (5 * textSizeRatio) + "px space_monoregular";
    ctx.fillText("SPACEPOLAR", 0, -65, maxWidth);
    ctx.font = (3 * textSizeRatio) + "px space_monoregular";
    ctx.fillText("By PAPO", 0, -45, maxWidth);
    // get it? PAlmero and chaPO hehehe

    ctx.fillStyle = "white";
    maxWidth = 100;
    ctx.font = (2 * textSizeRatio) + "px space_monoregular";
    if (this.steps == 0) {
        ctx.fillText("MOVE : arrow keys", 0, -15, maxWidth);
        ctx.fillText("FIRE : space key", 0, -3, maxWidth);
        ctx.fillText("PAUSE : p key", 0, 9, maxWidth);
        ctx.fillText("MUTE : m key", 0, 21, maxWidth);
        ctx.fillText(">> Fire to start mission <<", 0, 40, maxWidth);
    }

};

Tutorial.prototype.finished = function() {
    return this.steps > 0;
};
