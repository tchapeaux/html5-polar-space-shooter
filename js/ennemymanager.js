function EnnemyManager (world_size, physicsManager) {
    this.world_size = world_size;
    this.ennemies = [];
    this.physicsManager = physicsManager;
    // temporary behavior
    this.newEnnemyTimer = 0;
};

EnnemyManager.prototype.update = function(ds) {
    for (var i = this.ennemies.length - 1; i >= 0; i--) {
        var ennemy = this.ennemies[i];
        ennemy.update(ds);
        if (ennemy.isDead || ennemy.ro > Math.max(wScr(), hScr())) {
            this.ennemies.splice(i, 1);
        };
    };

    // temporary behavior
    this.newEnnemyTimer += ds;
    if (this.newEnnemyTimer > 3) {
        if (Math.random() > 0.1) {
            this.newEnnemy(new Ennemy(this.world_size, this.physicsManager, makeGoStraight()));
        } else {
            this.newEnnemy(new Ennemy(this.world_size, this.physicsManager, makeSeeSaw()));
        };
        this.newEnnemyTimer = 0;
    };
};

EnnemyManager.prototype.draw = function(ctx) {
    for (var i = this.ennemies.length - 1; i >= 0; i--) {
        this.ennemies[i].draw(ctx);
    };
};

EnnemyManager.prototype.newEnnemy = function(ennemy) {
    this.ennemies.push(ennemy);
    this.physicsManager.addEntity(ennemy);
};
