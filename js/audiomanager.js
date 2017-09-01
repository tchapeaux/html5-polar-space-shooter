"use strict";

var AudioManager = function() {
    // fetch Howl instances from global namespace
    this.bgm = backgroundmusic;
    this.playerhit_fx = playerhit_fx;

    this.global_mute = false;
};

AudioManager.prototype.play_playerhit = function() {
    this.playerhit_fx.play();
};

AudioManager.prototype.toggle_mute = function() {
    this.global_mute = !this.global_mute;
    this.bgm.mute(this.global_mute);
    this.playerhit_fx.mute(this.global_mute);
}
