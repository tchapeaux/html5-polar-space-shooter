"use strict";

var PhysicsManager = function() {
    this.entities = [];
    this.ennemy_bullets = [];
    this.explosions = [];
    this.collisionQueue = [];
}

PhysicsManager.prototype.addEntity = function(ent) {
    this.entities.push(ent);
};

PhysicsManager.prototype.update = function(ds) {
    var i, j;

    // remove dead entities
    for (var i = this.entities.length - 1; i >= 0; i--) {
        var ent = this.entities[i];
        if (ent.isDead || (ent.owner && ent.owner.isDead)) {
            this.entities.splice(i, 1);
        };
    };

    // iterate over every couple of entities
    for (i = this.entities.length - 1; i >= 0; i--) {
        for (j = i - 1; j >= 0; j--) {
            var ent1 = this.entities[i];
            var ent2 = this.entities[j];
            if (interesect(ent1, ent2)) {
                // console.log(ent1, ent2, "intersects");
                this.collisionQueue.push([ent1, ent2]);
            };
        };
    };

    // bullets
    for (var b = this.ennemy_bullets.length - 1; b >= 0; b--) {
        var bul = this.ennemy_bullets[b];
        bul.update(ds);
        if (bul.ro <= 0 || bul.ro > this.world_size || bul.isDead) {
            this.ennemy_bullets.splice(b, 1);
        };
    };

    // explosions
    for (var e = this.explosions.length - 1; e >= 0; e--) {
        var expl = this.explosions[e];
        expl.update(ds);
        if (expl.isDead) {
            this.explosions.splice(e, 1);
        };
    };

};

PhysicsManager.prototype.draw = function(ctx) {
    // bullets
    for (var b = this.ennemy_bullets.length - 1; b >= 0; b--) {
        this.ennemy_bullets[b].draw(ctx);
    }

    // explosions
    for (var e = this.explosions.length - 1; e >= 0; e--) {
        this.explosions[e].draw(ctx);
    }
};

PhysicsManager.prototype.getNextCollision = function() {
    return this.collisionQueue.shift();
};

PhysicsManager.prototype.collisionQueueIsEmpty = function() {
    return this.collisionQueue.length === 0;
};

function interesect(thing1, thing2) {
    // check if thing1 intersects with thing2
    // for now we suppose every-thing is a circle with ro, theta & radius (getSize())

    // first thing coordinates
    var x1 = Math.cos(thing1.theta) * thing1.ro;
    var y1 = Math.sin(thing1.theta) * thing1.ro;

    // second thing coordinate
    var x2 = Math.cos(thing2.theta) * thing2.ro;
    var y2 = Math.sin(thing2.theta) * thing2.ro;

    var dd = squared_distance(x1, y1, x2, y2);

    return dd < Math.pow(thing1.getSize() + thing2.getSize(), 2);
}

function squared_distance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return dx * dx + dy * dy;
}
