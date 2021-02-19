namespace L13_UI {
    export class UI {
        public health: number = 100;
        public ammoGun: number = 30;
        public score: number = 0;

        public displayUI(): void {
            document.getElementById("health").innerHTML = `Health: ${this.health.toString()}`;
            document.getElementById("ammo").innerHTML = `Ammo: ${this.ammoGun.toString()}`;
            document.getElementById("score").innerHTML = `Score: ${this.score.toString()}`;
        }
    }
}