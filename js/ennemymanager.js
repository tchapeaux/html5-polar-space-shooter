function EnnemyManager () {
    this.ennemies = [];
    // temporary behavior
    this.newEnnemyTimer = 0;
}

EnnemyManager.prototype.update = function(ds) {
    for (var i = this.ennemies.length - 1; i >= 0; i--) {
        var ennemy = this.ennemies[i];
        ennemy.update(ds);
        if (ennemy.isDead || ennemy.ro > Math.max(wScr(), hScr())) {
            this.ennemies.splice(i, 1);
        }
    }

    // temporary behavior
    this.newEnnemyTimer += ds;
    if (this.newEnnemyTimer > 3) {
        if (Math.random() > 0.75) {
            this.newEnnemy(new Ennemy(makeGoStraight()));
        } else {
            this.newEnnemy(new Ennemy(makeSeeSaw()));
        }
        this.newEnnemyTimer = 0;
    }
};

EnnemyManager.prototype.draw = function(ctx) {
    for (var i = this.ennemies.length - 1; i >= 0; i--) {
        this.ennemies[i].draw(ctx);
    }
};

EnnemyManager.prototype.newEnnemy = function(ennemy) {
    this.ennemies.push(ennemy);
    game.physics.addEntity(ennemy);
};
