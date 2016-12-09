"use strict";

var Bullet = function(owner, world_size) {
    this.owner = owner;
    this.ro = owner.ro;
    this.theta = owner.theta;
    this.world_size = world_size;
    this.first_ro = this.ro;
    this.roSpeed = 0;
    this.thetaSpeed = 0;
    this.power = 1;
    this.isDead = false;
    this.size = 30; // actual on-screen size might be affected by other factors

    this.animationFrameTotalCount = 2;
    this.animationFrameCounter = 0;
    this.animationPeriod = 0.37;
    this.animationPeriodCounter = Math.random() * this.animationPeriod;  // start at random point in period
};

Bullet.prototype.update = function(ds) {
    this.ro += this.roSpeed * ds;
    this.theta += this.thetaSpeed * ds;

    this.animationPeriodCounter += ds;
    if (this.animationPeriodCounter > this.animationPeriod) {
        this.animationPeriodCounter -= this.animationPeriod;
        this.animationFrameCounter += 1;
        if (this.animationFrameCounter == this.animationFrameTotalCount) {
            this.animationFrameCounter = 0;
        }
    }
};

Bullet.prototype.draw = function(ctx) {
    var x = this.ro * Math.cos(this.theta);
    var y = this.ro * Math.sin(this.theta);

    var missile_img = document.getElementById("missile_img");
    var angle = -Math.PI/2 + this.theta; // angle corrected
    if (this.roSpeed > 0) {
        // quick-fix for ennemy bullets (must go in the other direction)
        angle += Math.PI;
    }
    var onscreen_size_x = -1 * this.getSize() * missile_img.width / 50;
    if (this.animationFrameCounter == 1) {
        onscreen_size_x *= -1.2;
    }
    var onscreen_size_y = this.getSize() * missile_img.height / 50;
    drawCenteredImage(ctx, missile_img, x, y, angle, onscreen_size_x, onscreen_size_y);

};

Bullet.prototype.getSize = function() {
    return this.size * this.power * this.ro / this.world_size;
};

Bullet.prototype.collisionWith = function(entity) {
    // Ignore owner
    if (this.owner === entity) {
        return
    }
    // Player bullets ignore other bullets
    if (this.owner instanceof Player && entity instanceof Bullet) {
        return
    }
    // Ennemy bullets ignore bullets from the same entity
    if (entity instanceof Bullet && this.owner === entity.owner) {
        return
    }
    this.isDead = true;
};
