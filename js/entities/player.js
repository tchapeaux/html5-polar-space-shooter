"use strict";

var Player = function() {
    this.bullets = [];

    // constants
    this.ro = 4 * (worldSize() / 2) / 5;
    this.maxThetaSpeed = 4 * Math.PI;
    this.size = 15;
    this.maxLives = 10;
    // shoot cooldown - time between two consecutive shot
    this.shootCoolDown = 0.2;
    // speed cooldown - time to slow down to a stop when releasing move keys
    this.speedCoolDown = 0.3;
    // disoriented cooldown - 'disoriented' state duration (cannot shoot after being hit)
    this.disorientedCoolDown = 2;

    // state
    this.theta = 0;
    this.thetaSpeed = 0;
    this.thetaAccel = 4 * Math.PI;
    this.currentLives = this.maxLives;
    this.isHit = false;
    // Timers are activated by being set to a value above 0
    // They will tick down until reaching 0 again
    this.shootCoolDownTimer = 0;
    this.speedCoolDownTimer = 0;
    this.disorientedCoolDownTimer = 0;
    // variable to control the rotation of the player
    this.rotation_timeaccum = 0;

    this.player_img = document.getElementById("player_img");
    this.player_hit_img = document.getElementById("player_hit_img");
};

Player.BULLET_SPEED = -200;

Player.prototype.update = function(ds, keysPressed) {
    this.rotation_timeaccum += ds;
    while (this.rotation_timeaccum > 2 * Math.PI) { this.rotation_timeaccum -= 2 * Math.PI; }
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
        if (this.shootCoolDownTimer <= 0) {
            this.shoot();
        }
    }

    // force speed within bounds
    this.thetaSpeed = Math.min(this.thetaSpeed, this.maxThetaSpeed);
    this.thetaSpeed = Math.max(this.thetaSpeed, -this.maxThetaSpeed);


    // Shoot cooldown
    if (this.shootCoolDownTimer > 0) {
        this.shootCoolDownTimer -= ds;
    }

    // Disoriented cooldown
    if (this.disorientedCoolDownTimer > 0) {
        this.disorientedCoolDownTimer -= ds;
    }

    // movement
    this.theta += this.thetaSpeed * ds;

    // being hit
    if (this.isHit) {
        this.currentLives -= 1;
        this.isHit = false;
        game.audio.play_playerhit();
        this.disorientedCoolDownTimer = this.disorientedCoolDown;

        // death disabled for DEBUG
        if (this.currentLives == 0) {
            this.currentLives = this.maxLives;
        }
    };


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
    var img = this.player_img;
    if (this.disorientedCoolDownTimer > 0) {
        img = this.player_hit_img;
    }
    drawCenteredImage(ctx, img, x, y, this.rotation_timeaccum, this.size * 4, this.size * 4);

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
    var bul = new Bullet(this);
    bul.roSpeed = Player.BULLET_SPEED;
    this.bullets.push(bul);
    game.physics.addEntity(bul);
    this.shootCoolDownTimer = this.shootCoolDown;
};

Player.prototype.collisionWith = function(entity) {
    if (entity.owner && entity.owner !== this) {
        this.isHit = true;
    }
};
