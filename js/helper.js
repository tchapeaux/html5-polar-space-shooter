"use strict";

// My own set implementation, based on:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// highly inefficient :)
function Set() {
    this.table = [];
}

Set.prototype._findIndex = function(elem) {
    for (var i = this.table.length - 1; i >= 0; i--) {
        if (this.table[i] === elem) {
            return i;
        }
    }
    return false;
};

Set.prototype.add = function(elem) {
    if (this._findIndex(elem) === false) {
        this.table.push(elem);
    }
};

Set.prototype.has = function(elem) {
    return this._findIndex(elem) !== false;
};

Set.prototype.delete = function(elem) {
    var index = this._findIndex(elem);
    if (index !== false) {
        this.table.splice(index, 1);
    }
};

Set.prototype.clear = function() {
    this.table = [];
};

// filler Math.sign implementation
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

Math.sign = function (x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x))
        return x;
    return x > 0 ? 1 : -1;
};

// filler Math.randomBetween

Math.randomBetween = function(min, max) {
    if (max < min) {
        throw "randomBetween: max < min";
    }
    return min + (max - min) * Math.random();
};

// general maths functions
function distance(x1, y1, x2, y2) {
    // return distance between (x1, y1) and (x2, y2)
    return Math.sqrt(distance_squared(x1, y1, x2, y2));
}

function distance_gt_than(x1, y1, x2, y2, value) {
    // return true if the dist between (x1, y1) and (x2, y2) is greater than value
    return distance_squared(x1, y1, x2, y2) > value * value;
}

function distance_squared(x1, y1, x2, y2) {
    // return distance between (x1, y1) and (x2, y2), squared
    // better to use this when you only want to compare two distances (distance smaller or bigger than...)
    // as the sqrt() operation is very costly
    var dx = x2 - x1;
    var dy = y2 - y1;
    return dx * dx + dy * dy;
}

function polarToCartesian(ro, theta) {
    // return [x, y]
    return [ro * Math.cos(theta), ro * Math.sin(theta)];
}

function cartesianToPolar(x, y) {
    // return ro, theta
    var ro = distance(0, 0, x, y);
    var theta = Math.atan2(y, x); // x and y must be reversed (y, x), see atan2 doc
    return [ro, theta];
}

function normalizeAngle(angle) {
    // Return an equivalent angle between 0 and 2*PI
    while (angle <= 0) {
        angle += 2 * Math.PI;
    }
    while (angle > 2 * Math.PI) {
        angle -= 2 * Math.PI;
    }
    return angle;
}

function angleDistance(angle1, angle2) {
    var d = Math.abs(angle2 - angle1);
    if (d > Math.PI) {
        d = Math.abs(2 * Math.PI - d);
    }
    return d;
}

function drawCenteredImage(ctx, img, x, y, angle, size_x, size_y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    // quick-fix for animation
    if (size_x < 0) {
        ctx.scale(-1, 1);
    }
    ctx.drawImage(img, -size_x/2, -size_y/2, size_x, size_y);
    ctx.restore();
}
