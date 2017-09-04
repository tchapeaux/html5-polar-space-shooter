"use strict";

var Ennemy = function(behavior) {
    this.ro = 0;
    this.theta = Math.random() * 2 * Math.PI;
    this.life = 3;
    this.isDead = false;
    this.size = 10;
    this.behavior = behavior;
    this.fireTimer = 0;

    this.ennemy_img = document.getElementById("ennemy_img");
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
        game.physics.explosions.push(new Explosion(this.ro, this.theta, 10));
    }
};

Ennemy.prototype.draw = function(ctx) {
    var x = this.ro * Math.cos(this.theta);
    var y = this.ro * Math.sin(this.theta);
    ctx.globalAlpha = Math.min(1, this.ro / (WORLD_SIZE_SU / 8));

    drawCenteredImage(ctx, this.ennemy_img, x, y, this.theta, this.getSize() * 4, this.getSize() * 4);


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
};

Ennemy.prototype.getSize = function() {
    return this.size * (this.ro / WORLD_SIZE_SU);
};

Ennemy.prototype.shoot = function() {
    // Fire one bullet
    var bul = new Bullet(this);
    bul.roSpeed = this.behavior.getBulletSpeed();
    bul.power /= 2;
    game.physics.ennemy_bullets.push(bul);
    game.physics.addEntity(bul);
    this.coolDownTimer = 0;
    game.audio.play_ennemyshoot();
};

Ennemy.prototype.collisionWith = function(entity) {
    if (entity.owner && entity.owner !== this) {
        entity.isDead = true;
        this.isHit = true;
    }
};
