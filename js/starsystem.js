"use strict";

var Star = function() {
    this.ro = 0;
    this.roSpeed = 20;  // Screen Unit / s
    this.roAccel = 0;  // Screen Unit / s / s
    this.theta = Math.random() * 2 * Math.PI;  // radians
    this.thetaSpeed = Math.random() * 0.5;  // radians / s
    this.thetaAccel = 0;  // radians / s / s
    this.color = "cyan";
    if (Math.random() < 0.3) { this.color = "gold"; }
    this.size = Math.random() * 1.5 + 2;
};

Star.prototype.draw = function(ctx) {
    // supposes that (0, 0) is the center of the screen

    // distance to player
    // We only consider theta difference
    var distanceToPlayer = angleDistance(this.theta, game.player.theta);
    var distanceToPlayerRatio = 1 - distanceToPlayer / (Math.PI / 3);
    distanceToPlayerRatio = Math.min(1, distanceToPlayerRatio);
    distanceToPlayerRatio = Math.max(0.2, distanceToPlayerRatio);
    ctx.globalAlpha = distanceToPlayerRatio;

    ctx.fillStyle = this.color;
    var _ = polarToCartesian(this.ro, this.theta);
    var x = _[0];
    var y = _[1];
    var size = this.getSize();
    ctx.beginPath();
    ctx.arc(x - size / 2, y - size / 2, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
};

Star.prototype.update = function(ds) {
    this.roSpeed += this.roAccel * ds;
    this.ro += this.roSpeed * ds;
    this.thetaSpeed += this.thetaAccel * ds;
    this.theta += this.thetaSpeed * ds;
    this.theta = normalizeAngle(this.theta);
};

Star.prototype.getSize = function() {
    return this.size * (this.ro / WORLD_SIZE_SU);
};

var SpeedLine = function() {
    this.theta = Math.random() * 2 * Math.PI;
    this.length = Math.randomBetween(20, 60);  // SU
    this.width = 5;
    this.ro = 0;
    this.roSpeed = Math.randomBetween(40, 70);  // SU / s
    this.color = "white";
};

SpeedLine.prototype.draw = function(ctx) {
    ctx.globalAlpha = this.ro / WORLD_SIZE_SU;
    var _ = polarToCartesian(this.ro, this.theta);
    var x1 = _[0];
    var y1 = _[1];
    _ = polarToCartesian(this.ro + this.getLength(), this.theta);
    var x2 = _[0];
    var y2 = _[1];
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.lineWidth = 2 * Math.ceil(this.getWidth(0));
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
};

SpeedLine.prototype.update = function(ds) {
    this.ro += this.roSpeed * ds;
};

SpeedLine.prototype.getLength = function() {
    return this.length * (this.ro / WORLD_SIZE_SU);
};

SpeedLine.prototype.getWidth = function(ratio) {
    // return the size at position ratio (between 0 - start and 1 - end)
    return this.width * (this.ro + ratio * this.getLength()) / WORLD_SIZE_SU;
};

var StarSystem = function () {
    this.stars = [];
    this.starCreationSpeed = 50; // stars per second
    this.maxStarsOnScreen = 5000;

    this.speedlines = [];
    this.speedLinesCreationSpeed = 20; // per second
    this.maxSpeedLinesOnScreen = 200;

    // partial counter:
    // If a creation speed is inferior to one per animation frame,
    // keep track of partial creation ratio of new elements
    this.partialStarCounter = 0;
    this.partialLineCounter = 0;

};

StarSystem.prototype.draw = function(ctx) {
    // draw speedlines
    for (var j = this.speedlines.length - 1; j >= 0; j--) {
        var sl = this.speedlines[j];
        sl.draw(ctx);
    }

    // draw stars
    for (var i = this.stars.length - 1; i >= 0; i--) {
        var star = this.stars[i];
        star.draw(ctx);
    }
};

StarSystem.prototype.update = function(ds) {
    var i, j; // loop variables

    // update stars
    for (i = this.stars.length - 1; i >= 0; i--) {
        var star = this.stars[i];
        star.update(ds);

        // delete far away stars
        if (star.ro > MAX_SU * 1.1) {
            this.stars.splice(i, 1);
        }
    }

    // update speedlines
    for (j = this.speedlines.length - 1; j >= 0; j--) {
        var sl = this.speedlines[j];
        sl.update(ds);

        // delete far away speedlines
        if (sl.ro > MAX_SU * 1.1) {
            this.speedlines.splice(j, 1);
        }
    }

    // create new stars
    if (this.stars.length < this.maxStarsOnScreen) {
        var deltaStars = Math.max(0, this.maxStarsOnScreen - this.stars.length);
        var starsToCreate = Math.min(deltaStars, this.starCreationSpeed * ds);
        this.partialStarCounter += starsToCreate;
        if (this.partialStarCounter >= 1) {
            for (j = 0; j < this.partialStarCounter; j++ ) {
                this.stars.push(new Star());
                this.partialStarCounter -= 1;
            }
        }
    }

    // create new speedlines
    if (this.speedlines.length < this.maxSpeedLinesOnScreen) {
        var deltaSpeedLines = Math.max(0, this.maxSpeedLinesOnScreen - this.speedlines.length);
        var speedLinesToCreate = Math.min(deltaSpeedLines, this.speedLinesCreationSpeed * ds);
        this.partialLineCounter += speedLinesToCreate;
        if (this.partialLineCounter >= 1) {
            for (j = 0; j < this.partialLineCounter; j++ ) {
                this.speedlines.push(new SpeedLine());
                this.partialLineCounter -= 1;
            }
        }
    }
};
