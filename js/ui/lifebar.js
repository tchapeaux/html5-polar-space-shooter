"use strict";

var Lifebar = function(player) {
    this.player = player;
    this.percentage = this.player.currentLives / this.player.maxLives;
};

Lifebar.prototype.update = function(ds) {
    // TODO easing/tweening
    this.current_life_ratio = this.player.currentLives / this.player.maxLives;
};

Lifebar.prototype.draw = function(ctx) {
    var orig_x = -97
    var orig_y = -97
    var width = 70;
    var lifeWidth = width * this.current_life_ratio;
    var height = 5;
    var outline = 1;

    ctx.globalAlpha = 1;

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(orig_x - outline, orig_y - outline, width + 2 * outline, height + 2 * outline);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.rect(orig_x - 1, orig_y - 1, width + 2, height + 2);
    ctx.fill();

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.rect(orig_x, orig_y, lifeWidth, height);
    ctx.fill();

    ctx.globalAlpha = 1;

};
