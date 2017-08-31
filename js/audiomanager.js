"use strict";

var AudioManager = function() {
    this.bgm = new Howl({
        src: ['res/Smockpuppet_-_Spacer.ogg', 'res/Smockpuppet_-_Spacer.mp3'],
        autoplay: true,
        loop: true
    });

    this.playerhit_fx = new Howl({
        src: ['res/NFF-alien-hit.wav'],
    });
};

AudioManager.prototype.play_playerhit = function() {
    this.playerhit_fx.play();
};
