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

    ctx.fillStyle = this.currenttitlecolor;
    ctx.font = "75px space_monoregular";
    ctx.fillText("SPACEPOLAR", 0, -hScr()/3);

    ctx.fillStyle = "white";
    ctx.font = "20px space_monoregular";
    if (this.steps == 0) {
        ctx.fillText("Move using arrows | Press space to fire", 0, 0);
        ctx.fillText(">> Fire to continue <<", 0, hScr() / 3);
    } else if (this.steps == 1) {
        ctx.fillText("Press p to pause | Press m to mute sound", 0, 0);
        ctx.fillText(">> LET'S GO <<", 0, hScr() / 3);
    }

};

Tutorial.prototype.finished = function() {
    return this.steps > 1;
};
