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
    ctx.font = (5 * textSizeRatio) + "px space_monoregular";
    ctx.fillText("SPACEPOLAR", 0, -65);
    ctx.font = (3 * textSizeRatio) + "px space_monoregular";
    ctx.fillText("By PAPO", 0, -45);
    // get it? PAlmero and chaPO hehehe

    ctx.fillStyle = "white";
    ctx.font = (3 * textSizeRatio) + "px space_monoregular";
    if (this.steps == 0) {
        ctx.fillText("MOVE : arrow keys", 0, -15);
        ctx.fillText("FIRE : space key", 0, -3);
        ctx.fillText("PAUSE : p key", 0, 9);
        ctx.fillText("MUTE : m key", 0, 21);
        ctx.fillText(">> Fire to start mission <<", 0, 40);
    }

};

Tutorial.prototype.finished = function() {
    return this.steps > 0;
};
