"use strict";

var Game = function() {
    this.state = Game.states.STARTING;

    // World elements
    this.physics = new PhysicsManager();
    this.player = new Player();
    this.starSystem = new StarSystem();
    this.ennemyManager = new EnnemyManager();

    // Audio
    this.audio = new AudioManager();

    // UI elements
    this.lifebar = new Lifebar(this.player);
    this.tutorial = new Tutorial();

    // instantly advance the simulation of starsystem so that stars are already in place
    for (var i = 0; i < 600; i++) {
        this.starSystem.update(0.1);
    }

    this.physics.addEntity(this.player);

    this.state = Game.states.WAITING_USER_INPUT;
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
        this.audio.toggle_mute();
        keysPressed.delete(77);
    }

    if (this.state != Game.states.PAUSED) {
        this.player.update(ds, keysPressed);
        this.starSystem.update(ds);
        this.lifebar.update(ds);

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
    // = A note on coordinates =
    // This game is simulated in a polar plane, with every entity having
    // (ro, theta) coordinates
    // - ro: distance to center of screen (0 = center, 100 = nearest screen edge)
    // - theta: angle, in radian (0 = right, Pi/2 = above, etc)
    // (we refer to the 'ro' units as 'Screen Unit (SU)'. 100 SU = worldSize())
    // This is converted to a (x,y) coordinate in the HTML canvas just before display
    // Every coordinate/speed/etc value stored in an Entity property should be
    // in accordance to this coordinate system.

    // Update MAX_SU ('out-of-screen' coordinate)
    MAX_SU = WORLD_SIZE_SU * Math.max(wScr(), hScr()) / worldSize();

    // Save context
    ctx.save();

    // Translate so that (0,0) = center of screen
    ctx.translate(gameCanvas.width / 2, gameCanvas.height / 2);
    // Scale so that 100 = nearest edge (worldSize())
    var ratio = worldSize() / 100;
    ctx.scale(ratio, ratio);

    // Black background
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(-wScr() / 2, -hScr() / 2, wScr(), hScr());
    ctx.fill();

    // Order has its importance: elements drawn last are drawn 'above' others

    // First (bottom) layer is the background (star system)
    this.starSystem.draw(ctx);

    // Ennemy + player layer
    this.ennemyManager.draw(ctx);
    this.player.draw(ctx);

    // FX (explosions) layer
    this.physics.draw(ctx);

    // UI layer
    if (this.state == Game.states.WAITING_USER_INPUT) {
        this.tutorial.draw(ctx);
    } else {
        this.lifebar.draw(ctx);
    }

    // DEBUG
    ctx.beginPath();
    ctx.globalAlpha = 0.5;
    ctx.arc(0, 0, 100, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.restore();

};

Game.prototype.togglePause = function() {
    if (this.state == Game.states.RUNNING || this.state == Game.states.WAITING_USER_INPUT) {
        this.state = Game.states.PAUSED;
    } else if (this.state == Game.states.PAUSED) {
        if (this.tutorial.finished()) {
            this.state = Game.states.RUNNING;
        } else {
            this.state = Game.states.WAITING_USER_INPUT;
        }
    }
};

// Define world screen variables
// MAX_SU shall be updated by the Game.draw() loop at each frame
var WORLD_SIZE_SU = 100;  // Screen Unit (see note above)
var MAX_SU = WORLD_SIZE_SU * Math.max(gameCanvas.width, gameCanvas.height) / worldSize();
