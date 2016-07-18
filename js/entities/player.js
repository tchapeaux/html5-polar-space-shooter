"use strict";

var Player = function(world_size, physicsManager) {
    this.world_size = world_size;
    this.ro = 4 * (world_size / 2) / 5;
    this.physicsManager = physicsManager;
    this.theta = 0;
    this.thetaSpeed = 0;
    this.thetaAccel = Math.PI;
    this.maxThetaSpeed = Math.PI;
    this.size = 15;
    this.maxLives = 10;
    this.currentLives = this.maxLives;
    this.isHit = false;
    this.bullets = [];
    this.shootCoolDown = 0.33;
    this.coolDownTimer = this.shootCoolDown;
};

Player.BULLET_SPEED = -200;

Player.prototype.update = function(ds, keysPressed) {
    // speed
    if (keysPressed.has(37) /* LEFT ARROW*/) {
        this.thetaSpeed += this.thetaAccel * ds;
    } else if (keysPressed.has(39) /* RIGHT ARROW */ ) {
        this.thetaSpeed -= this.thetaAccel * ds;
    } else {
        // slowdown
        var direction = Math.sign(this.thetaSpeed);
        this.thetaSpeed += -direction * this.thetaAccel * ds;
    }
    if (keysPressed.has(32) /* SPACEBAR */ ) {
        if (this.coolDownTimer >= this.shootCoolDown) {
            this.shoot();
        }
    }
    this.thetaSpeed = Math.min(this.thetaSpeed, this.maxThetaSpeed);
    this.thetaSpeed = Math.max(this.thetaSpeed, -this.maxThetaSpeed);


    // cooldown
    if (this.coolDownTimer < this.shootCoolDown) {
        this.coolDownTimer += ds;
    }

    // movement
    this.theta += this.thetaSpeed * ds;

    // being hit
    // (TODO)
    //if (this.isHit) {
    //
    //};


    // bullets
    for (var b = this.bullets.length - 1; b >= 0; b--) {
        var bul = this.bullets[b];
        bul.update(ds);
        if (bul.ro <= 0 || bul.isDead) {
            this.bullets.splice(b, 1);
        }
    }
};

Player.prototype.draw = function(ctx) {
    var x = this.ro * Math.cos(this.theta);
    var y = this.ro * Math.sin(this.theta);
    ctx.beginPath();
    ctx.fillStyle = "DeepSkyBlue";
    if (this.isHit) {
        ctx.fillStyle = "Red";
        this.isHit = false;
    }
    ctx.strokeStyle = "DodgerBlue";
    ctx.arc(x, y, 1.5 * this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    for (var b = this.bullets.length - 1; b >= 0; b--) {
        this.bullets[b].draw(ctx);
    }

};

Player.prototype.getSize = function() {
    return this.size;
};

Player.prototype.shoot = function() {
    // Fire one bullet
    var bul = new Bullet(this, this.world_size);
    bul.roSpeed = Player.BULLET_SPEED;
    this.bullets.push(bul);
    this.physicsManager.addEntity(bul);
    this.coolDownTimer = 0;
};

Player.prototype.collisionWith = function(entity) {
    if (entity.owner && entity.owner !== this) {
        this.isHit = true;
    }
};
