"use strict";

var Player = function(world_size, physicsManager) {
    this.world_size = world_size;
    this.physicsManager = physicsManager;
    this.bullets = [];

    // constants
    this.ro = 4 * (world_size / 2) / 5;
    this.maxThetaSpeed = 4 * Math.PI;
    this.size = 15;
    this.maxLives = 10;
    this.shootCoolDown = 0.2;
    this.speedCoolDown = 0.3;

    // state
    this.theta = 0;
    this.thetaSpeed = 2;
    this.thetaAccel = 4 * Math.PI;
    this.currentLives = this.maxLives;
    this.isHit = false;
    this.shootCoolDownTimer = this.shootCoolDown;
    this.speedCoolDownTimer = this.speedCoolDown;
};

Player.BULLET_SPEED = -200;

Player.prototype.update = function(ds, keysPressed) {
    // speed
    var direction = Math.sign(this.thetaSpeed);
    var abs_speed = Math.abs(this.thetaSpeed);
    if (direction >= 0 && keysPressed.has(37) /* LEFT ARROW*/) {
        this.thetaSpeed += this.thetaAccel * ds;
        this.speedCoolDownTimer = this.speedCoolDown;
    } else if (direction <= 0 && keysPressed.has(39) /* RIGHT ARROW */ ) {
        this.thetaSpeed -= this.thetaAccel * ds;
        this.speedCoolDownTimer = this.speedCoolDown;
    } else if (Math.abs(this.thetaSpeed) > 0) {
        // slowdown
        abs_speed = abs_speed * (this.speedCoolDownTimer - ds) / this.speedCoolDownTimer;
        abs_speed = Math.max(0, abs_speed);
        this.speedCoolDownTimer = Math.max(0, this.speedCoolDownTimer - ds);
        this.thetaSpeed = direction * abs_speed;
    }
    if (keysPressed.has(32) /* SPACEBAR */ ) {
        if (this.shootCoolDownTimer >= this.shootCoolDown) {
            this.shoot();
        }
    }

    // force speed within bounds
    this.thetaSpeed = Math.min(this.thetaSpeed, this.maxThetaSpeed);
    this.thetaSpeed = Math.max(this.thetaSpeed, -this.maxThetaSpeed);


    // Shoot cooldown
    if (this.shootCoolDownTimer < this.shootCoolDown) {
        this.shootCoolDownTimer += ds;
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
    var player_img = document.getElementById("player_img");
    drawCenteredImage(ctx, player_img, x, y, this.size * 4, this.size * 4);

    /*

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

    */

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
    this.shootCoolDownTimer = 0;
};

Player.prototype.collisionWith = function(entity) {
    if (entity.owner && entity.owner !== this) {
        this.isHit = true;
    }
};
