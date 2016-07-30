"use strict";

var Game = function() {
    this.state = Game.states.STARTING;

    this.worldSize = Math.min(wScr(), hScr());
    this.physics = new PhysicsManager(this.worldSize);
    this.player = new Player(this.worldSize, this.physics);
    this.starSystem = new StarSystem(this.worldSize);
    this.ennemyManager = new EnnemyManager(this.worldSize, this.physics);

    // instantly advance the simulation of starsystem so that stars are already in place
    for (var i = 0; i < 600; i++) {
        this.starSystem.update(0.1);
    }

    this.physics.addEntity(this.player);

    this.state = Game.states.WAITING_USER_INPUT;
    this.tutorial = new Tutorial();
};

Game.states = {
    STARTING: 'STARTING',
    WAITING_USER_INPUT: 'WAITING_USER_INPUT',
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED'
};

Game.prototype.update = function(ds, keysPressed) {
    if (keysPressed.has(80) /* P */) {
        this.togglePause();
        keysPressed.delete(80);
    }
    if (keysPressed.has(77) /* M */) {
        backgroundmusic.muted = !backgroundmusic.muted;
        keysPressed.delete(77);
    }

    if (this.state != Game.states.PAUSED) {
        this.player.update(ds, keysPressed);
        this.starSystem.update(ds);

        if (this.state == Game.states.WAITING_USER_INPUT) {
            this.tutorial.update(ds, keysPressed);
            if (this.tutorial.finished()) {
                this.state = Game.states.RUNNING;
            }
        } else if (this.state == Game.states.RUNNING) {
            this.physics.update(ds);
            while (!this.physics.collisionQueueIsEmpty()) {
                var collision = this.physics.getNextCollision();
                var ent1 = collision[0];
                var ent2 = collision[1];
                ent1.collisionWith(ent2);
                ent2.collisionWith(ent1);
            }
            this.ennemyManager.update(ds);
        }
    }

};

Game.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(-wScr() / 2, -hScr() / 2, wScr(), hScr());
    ctx.fill();
    this.starSystem.draw(ctx);
    this.ennemyManager.draw(ctx);
    this.player.draw(ctx);
    if (this.state == Game.states.WAITING_USER_INPUT) {
        this.tutorial.draw(ctx);
    }
};

Game.prototype.togglePause = function() {
    if (this.state == Game.states.RUNNING) {
        this.state = Game.states.PAUSED;
    } else if (this.state == Game.states.PAUSED) {
        this.state = Game.states.RUNNING;
    }
};
