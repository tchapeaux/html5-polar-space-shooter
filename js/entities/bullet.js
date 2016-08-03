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
};

Bullet.prototype.update = function(ds) {
    this.ro += this.roSpeed * ds;
    this.theta += this.thetaSpeed * ds;
    this.theta += (Math.random() - 0.5) * Math.PI / 100;
};

Bullet.prototype.draw = function(ctx) {
    var x = this.ro * Math.cos(this.theta);
    var y = this.ro * Math.sin(this.theta);
    ctx.beginPath();
    ctx.fillStyle = "gold";
    ctx.strokeStyle = "DarkOrange";
    var size = this.getSize();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
};

Bullet.prototype.getSize = function() {
    return this.size * this.power * this.ro / this.world_size;
};

Bullet.prototype.collisionWith = function(entity) {
    if (this.owner === entity) {
        return
    }
    if (this.owner instanceof Player && entity instanceof Bullet) {
        return
    }
    this.isDead = true;
};
