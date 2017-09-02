"use strict";

var AudioManager = function() {
    // fetch Howl instances from global namespace
    this.bgm = backgroundmusic;
    this.playerhit_fx = playerhit_fx;
    this.playershoot_fx = playershoot_fx;
    this.ennemyshoot_fx = ennemyshoot_fx;

    this.global_mute = false;
};

AudioManager.prototype.play_playerhit = function() {
    this.playerhit_fx.play();
};

AudioManager.prototype.play_playershoot = function() {
    this.playershoot_fx.play();
};

AudioManager.prototype.play_ennemyshoot = function() {
    this.ennemyshoot_fx.play();
};

AudioManager.prototype.toggle_mute = function() {
    this.global_mute = !this.global_mute;
    this.bgm.mute(this.global_mute);
    this.playerhit_fx.mute(this.global_mute);
    this.playershoot_fx.mute(this.global_mute);
    this.ennemyshoot_fx.mute(this.global_mute);
}
