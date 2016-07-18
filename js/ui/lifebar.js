"use strict";

var Lifebar = function(player) {
    this.player = player;
    this.percentage = this.player.currentLives / this.player.maxLives;
};

Lifebar.prototype.update = function(ds) {
    // TODO easing/tweening
    this.percentage = this.player.currentLives / this.player.maxLives;
};

Lifebar.prototype.draw = function(ctx) {
    var width = wScr() / 3;
    var lifeWidth = width / this.player.maxLives;
    // TODO draw rectangle
};
