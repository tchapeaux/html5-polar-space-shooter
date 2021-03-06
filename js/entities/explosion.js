"use strict";

var Explosion = function(ro, theta, size) {
    this.ro = ro;
    this.theta = theta;
    this.roSpeed = 0;
    this.thetaSpeed = 0;
    this.isDead = false;
    this.size = size; // actual on-screen size might be affected by distance

    this.animationCounter = 0;
    this.animationLength = 1;
    this.animationSpeed = 3 * Math.PI; // rad / s

    this.explosion_img = document.getElementById("explosion_img");
};

Explosion.prototype.update = function(ds) {
    this.ro += this.roSpeed * ds;
    this.theta += this.thetaSpeed * ds;
    this.theta = normalizeAngle(this.theta);

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
    var onscreen_size_x = this.getSize() * (1 + ratio);
    var onscreen_size_y = this.getSize() * (1 + ratio);
    ctx.globalAlpha = 1 - ratio;
    drawCenteredImage(ctx, this.explosion_img, x, y, angle, onscreen_size_x, onscreen_size_y);
    ctx.globalAlpha = 1;

};

Explosion.prototype.getSize = function() {
    return this.size * this.ro * 3 / WORLD_SIZE_SU;
};

Explosion.prototype.collisionWith = function(entity) {
    // nothing to do
};
