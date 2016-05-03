"use strict";

/*
* Enemy behavior is implemented as Finite-State Machines
* Each behavior is a collection of states and transition conditions, with a current state
*/

var State = function() {
    this.stateName = "";
    this.fillColor = "MediumOrchid";
    this.strokeColor = "Magenta";
    this.roSpeed = 0;
    this.thetaSpeed = 0;
    this.firingSpeed = -1;  // duration between two consecutive bullets (negative for no shooting)
    this.bulletSpeed = 100;
    this.transitionTimerDuration = 0;
    this.timedTransition = -1; // id of 'transitioned to' state (-1 for no transition)
    this.isHitTransition = -1; // id of 'transitioned to' state (-1 for no transition)
    this.playerHitTransition = -1; // id of 'transitioned to' state (-1 for no transition)
};

var Behavior = function() {
    this.states = [];
    this.currentState = undefined;
    this.transitionTimer = 0;
};

Behavior.prototype.update = function(ds) {
    if (this.currentState.timedTransition !== -1) {
        this.transitionTimer += ds;
        if (this.transitionTimer > this.currentState.transitionTimerDuration) {
            var newState = this.currentState.timedTransition;
            if (newState >= this.states.length) { throw "Invalid timedTransition id" }
            this.changeState(newState);
        };
    };
};

Behavior.prototype.getRoSpeed = function() {
    return this.currentState.roSpeed;
};

Behavior.prototype.getThetaSpeed = function() {
    return this.currentState.thetaSpeed;
};

Behavior.prototype.getFiringSpeed = function() {
    return this.currentState.firingSpeed;
};

Behavior.prototype.getBulletSpeed = function() {
    return this.currentState.bulletSpeed;
};

Behavior.prototype.changeState = function(stateId) {
    this.currentState = this.states[stateId];
    this.transitionTimer = 0;
};

function makeGoStraight() {
    var state = new State();
    state.stateName = "Go_Straight";
    state.fillColor = "grey";
    state.roSpeed = 40;
    state.thetaSpeed = 0;
    state.bulletSpeed = 100;
    state.firingSpeed = 2;
    var GoStraight = new Behavior();
    GoStraight.states = [state];
    GoStraight.currentState = state;
    return GoStraight;
}

function makeSeeSaw() {
    var state_advance = new State();
    state_advance.stateName = "advance";
    state_advance.roSpeed = 20;
    state_advance.thetaSpeed = 0;
    state_advance.bulletSpeed = -1;
    state_advance.timedTransition = 1; // rotate
    state_advance.transitionTimerDuration = 3;
    var state_rotate = new State();
    state_rotate.stateName = "rotate";
    state_rotate.fillColor = "red";
    state_rotate.roSpeed = 0;
    state_rotate.thetaSpeed = 2;
    state_rotate.firingSpeed = 0.1;
    state_rotate.timedTransition = 0; // advance
    state_rotate.transitionTimerDuration = 0.3;
    var SeeSaw = new Behavior();
    SeeSaw.states = [state_advance, state_rotate];
    SeeSaw.currentState = state_advance;
    return SeeSaw;

}

