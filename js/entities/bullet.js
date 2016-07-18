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
};

Bullet.prototype.draw = function(ctx) {
    var x = this.ro * Math.cos(this.theta);
    var y = this.ro * Math.sin(this.theta);
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    var size = this.getSize();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
};

Bullet.prototype.getSize = function() {
    return this.size * this.power * this.ro / this.world_size;
};

Bullet.prototype.collisionWith = function(entity) {
    if (this.owner !== entity && ! entity instanceof Bullet) {
        //console.log(this.owner, entity, this);
        this.isDead = true;
    }
};
