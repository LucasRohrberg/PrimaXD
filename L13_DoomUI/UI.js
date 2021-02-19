"use strict";
var L13_UI;
(function (L13_UI) {
    class UI {
        constructor() {
            this.health = 100;
            this.ammoGun = 30;
            this.score = 0;
        }
        displayUI() {
            document.getElementById("health").innerHTML = `Health: ${this.health.toString()}`;
            document.getElementById("ammo").innerHTML = `Ammo: ${this.ammoGun.toString()}`;
            document.getElementById("score").innerHTML = `Score: ${this.score.toString()}`;
        }
    }
    L13_UI.UI = UI;
})(L13_UI || (L13_UI = {}));
//# sourceMappingURL=UI.js.map