namespace Endabgabe {
    export class Monster {
        name: string;
        hp: number;
        maxHp: number;
        atk: number;
        def: number;
        speed: number;
        type: string;
        curExp: number;
        expGain: number;
        expToNextLvl: number;
        level: number;
        shiny: boolean;
        overflow: number;
        
        constructor(_name: string, _shiny: boolean) {
            if (Endabgabe.team.length > 0) {
                let averageTeamLevel: number = 0;
                for (let i: number = 0; i < Endabgabe.team.length; i++) {
                    averageTeamLevel += Endabgabe.team[i].level;
                    if (i == Endabgabe.team.length - 1) averageTeamLevel = Math.floor(averageTeamLevel / Endabgabe.team.length);
                }
                this.level = averageTeamLevel + Math.floor((Math.random() * 4 - 2));            
            } else {
                this.level = 5;
            }
            this.shiny = _shiny;
            this.curExp = 0;
            this.expToNextLvl = this.level * 8;
            this.name = _name;
            switch (this.name) {
                case "IGNILUX":
                    this.hp = this.level * 4;
                    this.maxHp = this.hp;
                    this.atk = this.level * 3;
                    this.def = this.level * 2;
                    this.speed = this.level * 2;
                    this.expGain = this.level * 2;
                    this.type = "FIRE";
                    break;
                case "TERAKNOSP":
                    this.hp = this.level * 5;
                    this.maxHp = this.hp;
                    this.atk = this.level * 2;
                    this.def = this.level * 3;
                    this.speed = this.level * 1;
                    this.expGain = this.level * 3;
                    this.type = "GRASS";
                    break;
                case "HYDRELLY":
                    this.hp = this.level * 4;
                    this.maxHp = this.hp;
                    this.atk = this.level * 2;
                    this.def = this.level * 2;
                    this.speed = this.level * 3;
                    this.expGain = this.level * 3;
                    this.type = "WATER";
                    break;
                default:
                    break;
            }
            
        }

        levelUp(): void {
            if (this.curExp >= this.expToNextLvl) {
                let sound: HTMLAudioElement = <HTMLAudioElement>document.getElementById("levelUp");
                sound.play();
                switch (this.name) {
                    case "IGNILUX":
                        this.level++;
                        this.overflow = this.curExp - this.expToNextLvl;
                        this.curExp = this.overflow;
                        this.expToNextLvl = this.level * 8;
                        this.maxHp += 4;
                        this.atk += 3;
                        this.def += 2;
                        this.speed += 2;
                        break;
                    case "TERAKNOSP":
                        this.level++;
                        this.overflow = this.curExp - this.expToNextLvl;
                        this.curExp = this.overflow;
                        this.expToNextLvl = this.level * 8;
                        this.maxHp += 5;
                        this.atk += 2;
                        this.def += 3;
                        this.speed += 1;
                        break;
                    case "HYDRELLY":
                        this.level++;
                        this.overflow = this.curExp - this.expToNextLvl;
                        this.curExp = this.overflow;
                        this.expToNextLvl = this.level * 8;
                        this.maxHp += 4;
                        this.atk += 2;
                        this.def += 2;
                        this.speed += 3;
                        break;
                    default:
                        break;
                }

            }
        }
    }
}