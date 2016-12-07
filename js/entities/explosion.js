"use strict";

var Explosion = function(ro, theta, world_size) {
    this.ro = ro;
    this.theta = theta;
    this.world_size = world_size;
    this.roSpeed = 0;
    this.thetaSpeed = 0;
    this.isDead = false;
    this.size = 30; // actual on-screen size might be affected by other factors

    this.animationCounter = 0;
    this.animationLength = 1;
    this.animationSpeed = 3 * Math.PI; // rad / s
};

Explosion.prototype.update = function(ds) {
    this.ro += this.roSpeed * ds;
    this.theta += this.thetaSpeed * ds;

    this.animationCounter += ds;
    if (this.animationCounter > this.animationLength) {
        this.isDead = true;
    }
};

Explosion.prototype.draw = function(ctx) {
    var x = this.ro * Math.cos(this.theta);
    var y = this.ro * Math.sin(this.theta);
    var angle = this.animationCounter * this.animationSpeed;


    var ratio = this.animationCounter / this.animationLength;
    var onscreen_size_x = this.getSize() * (1 - ratio);
    var onscreen_size_y = this.getSize() * (1 - ratio);
    var explosion_img = document.getElementById("explosion_img");
    ctx.globalAlpha = 1 - ratio;
    drawCenteredImage(ctx, explosion_img, x, y, angle, onscreen_size_x, onscreen_size_y);
    ctx.globalAlpha = 1;

};

Explosion.prototype.getSize = function() {
    return this.size * this.ro * 3 / this.world_size;
};

Explosion.prototype.collisionWith = function(entity) {
    // nothing to do
};
