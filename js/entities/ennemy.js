"use strict";

var Ennemy = function(world_size, physicsManager, behavior) {
    this.ro = 0;
    this.world_size = world_size;
    this.physicsManager = physicsManager;
    this.theta = Math.random() * 2 * Math.PI;
    this.bullets = [];
    this.life = 3;
    this.isDead = false;
    this.size = 30;
    this.behavior = behavior;
    this.fireTimer = 0;
};

Ennemy.prototype.update = function(ds) {
    this.behavior.update(ds);
    var roSpeed = this.behavior.getRoSpeed();
    var thetaSpeed = this.behavior.getThetaSpeed();
    var firingSpeed = this.behavior.getFiringSpeed();
    this.ro += roSpeed * ds;
    this.theta += thetaSpeed * ds;

    this.fireTimer += ds;
    if (firingSpeed >= 0 && this.fireTimer > firingSpeed) {
        this.shoot();
        this.fireTimer -= firingSpeed;
    }

    if (this.isHit) {
        this.life -= 1;
    }
    if (this.life < 0) {
        this.isDead = true;
    }

    // bullets
    for (var b = this.bullets.length - 1; b >= 0; b--) {
        var bul = this.bullets[b];
        bul.update(ds);
        if (bul.ro <= 0 || bul.ro > this.world_size || bul.isDead) {
            this.bullets.splice(b, 1);
        }
    }
};

Ennemy.prototype.draw = function(ctx) {
    var x = this.ro * Math.cos(this.theta);
    var y = this.ro * Math.sin(this.theta);
    ctx.globalAlpha = Math.min(1, this.ro / (this.world_size / 8));

    var ennemy_img = document.getElementById("ennemy_img");
    drawCenteredImage(ctx, ennemy_img, x, y, this.theta, this.getSize() * 4, this.getSize() * 4);


    /*
    ctx.beginPath();
    ctx.fillStyle = this.behavior.currentState.fillColor;
    ctx.strokeStyle = this.behavior.currentState.strokeColor;
    var size = this.getSize();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    */
    ctx.globalAlpha = 1;

    for (var b = this.bullets.length - 1; b >= 0; b--) {
        this.bullets[b].draw(ctx);
    }
};

Ennemy.prototype.getSize = function() {
    return this.size * (this.ro / this.world_size);
};

Ennemy.prototype.shoot = function() {
    // Fire one bullet
    var bul = new Bullet(this, this.world_size);
    bul.roSpeed = this.behavior.getBulletSpeed();
    bul.power /= 2;
    this.bullets.push(bul);
    this.physicsManager.addEntity(bul);
    this.coolDownTimer = 0;
};

Ennemy.prototype.collisionWith = function(entity) {
    if (entity.owner && entity.owner !== this) {
        entity.isDead = true;
        this.isHit = true;
    }
};
