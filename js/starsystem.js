"use strict";

var Star = function() {
    this.ro = 0;
    this.roSpeed = 20;  // Screen Unit / s
    this.roAccel = 0;  // Screen Unit / s / s
    this.theta = Math.random() * 2 * Math.PI;  // radians
    this.thetaSpeed = Math.random() * 0.1;  // radians / s
    this.thetaAccel = 0;  // radians / s / s
    this.color = "#347543";
    if (Math.random() < 0.3) { this.color = "#41a6af"; }
    this.size = Math.random() * 3 + 4;
};

Star.prototype.draw = function(ctx) {
    // supposes that (0, 0) is the center of the screen
    ctx.fillStyle = this.color;
    var _ = polarToCartesian(this.ro, this.theta);
    var x = _[0];
    var y = _[1];
    var size = this.getSize();
    ctx.beginPath();
    ctx.arc(x - size / 2, y - size / 2, size, 0, 2 * Math.PI);
    ctx.fill();
};

Star.prototype.update = function(ds) {
    this.roSpeed += this.roAccel * ds;
    this.ro += this.roSpeed * ds;
    this.thetaSpeed += this.thetaAccel * ds;
    this.theta += this.thetaSpeed * ds;
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
    this.starCreationSpeed = 20; // stars per second
    this.maxStarsOnScreen = 5000;

    this.speedlines = [];
    this.speedLinesCreationSpeed = 5; // per second
    this.maxSpeedLinesOnScreen = 50;
};

StarSystem.prototype.draw = function(ctx) {
    // draw speedlines
    for (var j = this.speedlines.length - 1; j >= 0; j--) {
        var sl = this.speedlines[j];
        ctx.globalAlpha = sl.ro / WORLD_SIZE_SU;
        // ctx.globalAlpha = Math.max(ctx.globalAlpha, 1);
        sl.draw(ctx);
        ctx.globalAlpha = 1;
    }

    // draw stars
    for (var i = this.stars.length - 1; i >= 0; i--) {
        var star = this.stars[i];
        ctx.globalAlpha = 1;
        star.draw(ctx);
        ctx.globalAlpha = 1;
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
        for (j = 0; j < starsToCreate; j++ ) {
            this.stars.push(new Star());
        }
    }

    // create new speedlines
    if (this.speedlines.length < this.maxSpeedLinesOnScreen) {
        var deltaSpeedLines = Math.max(0, this.maxSpeedLinesOnScreen - this.speedlines.length);
        var speedLinesToCreate = Math.min(deltaSpeedLines, this.speedLinesCreationSpeed * ds);
        for (j = 0; j < speedLinesToCreate; j++ ) {
            this.speedlines.push(new SpeedLine());
        }
    }
};
