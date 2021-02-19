namespace Endabgabe {
    import f = FudgeCore;
    import faid = FudgeAid;

    window.addEventListener("load", init);
    window.addEventListener("keydown", move);
    export let viewport: f.Viewport;
    export let avatar: GameObject;
    export let grass: GameObject;
    export let gamestate: GAMESTATE;
    export let team: Monster[] = [];
    const clrWhite: f.Color = f.Color.CSS("white");
    let cmpCamera: f.ComponentCamera;
    let root: f.Node = new f.Node("root");
    let enemyMonster: Monster;
    let activeMonster: Monster;
    let posInTeam: number;
    let shinyOdds: number;
    let bgmusic: HTMLAudioElement;
    let cooldown: boolean = false;
    let sound: HTMLAudioElement;
    enum GAMESTATE {
        FIGHTING,
        WORLD
    }

    // TODO: Attack Sounds, Menü Hover Sounds

    async function init(): Promise<void> {
        shinyOdds = await getShinyOdds("./js/gamestats.json");
        for (let i: number = 0; i < document.getElementsByClassName("combat").length; i++) {
            document.getElementsByClassName("combat")[i].addEventListener("click", action);
        }
        for (let i: number = 0; i < document.getElementsByClassName("action").length; i++) {
            document.getElementsByClassName("action")[i].addEventListener("click", action);
        }
        gamestate = GAMESTATE.WORLD;
        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        let txtFloor: f.TextureImage = new f.TextureImage("./assets/background.png");
        let mtrFloor: f.Material = new f.Material("mtrFloor", f.ShaderTexture, new f.CoatTextured(clrWhite, txtFloor));
        let floor: faid.Node = new faid.Node("floor", f.Matrix4x4.IDENTITY(), mtrFloor, new f.MeshQuad());
        floor.mtxLocal.translateZ(-0.1);
        floor.mtxLocal.scale(new f.Vector3(2.5, 2.5, 1));
        root.appendChild(floor);

        cmpCamera = new f.ComponentCamera();
        cmpCamera.backgroundColor = f.Color.CSS("#333333");
        cmpCamera.pivot.translateZ(15);
        cmpCamera.pivot.rotateY(180);
        
        let txtPlayer: f.TextureImage = new f.TextureImage("./assets/player.png");
        let mtrPlayer: f.Material = new f.Material("mtrPlayer", f.ShaderTexture, new f.CoatTextured(clrWhite, txtPlayer));
        let cmpMaterialPlayer: f.ComponentMaterial = new f.ComponentMaterial(mtrPlayer);
        let meshQuad: f.MeshQuad = new f.MeshQuad("meshPlayer");
        let cmpMeshPlayer: f.ComponentMesh = new f.ComponentMesh(meshQuad);
        let cmpTransformPlayer: f.ComponentTransform = new f.ComponentTransform(f.Matrix4x4.IDENTITY());
        avatar = new GameObject("player", new f.Vector2(0, 0), new f.Vector2(1, 1));
        avatar.addComponent(cmpMaterialPlayer);
        avatar.addComponent(cmpMeshPlayer);
        avatar.addComponent(cmpTransformPlayer);
        avatar.addComponent(cmpCamera);
        avatar.mtxLocal.translateY(0.32);
        avatar.mtxLocal.scale(new f.Vector3(0.09, 0.09, 1));
        root.appendChild(avatar);

        let mtrGrass: f.Material = new f.Material("mtrGrass", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("GREEN", 0)));
        let cmpMaterialGrass: f.ComponentMaterial = new f.ComponentMaterial(mtrGrass);
        let cmpMeshGrass: f.ComponentMesh = new f.ComponentMesh(meshQuad);
        let cmpTransformGrass: f.ComponentTransform = new f.ComponentTransform(f.Matrix4x4.IDENTITY());
        grass = new GameObject("grass", new f.Vector2(-2.5, 7), new f.Vector2(6, 2));
        grass.addComponent(cmpMaterialGrass);
        grass.addComponent(cmpMeshGrass);
        grass.addComponent(cmpTransformGrass);
        grass.mtxLocal.translateY(0.2);
        grass.mtxLocal.translateZ(-1);
        grass.mtxLocal.scale(new f.Vector3(0.64, 0.22, 1));
        root.appendChild(grass);

        viewport = new f.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        viewport.draw();

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, loop);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 8);
    }

    function loop(_event: Event): void {
        if (gamestate == GAMESTATE.WORLD && cooldown == false) {
            if (avatar.checkCollision(grass)) {
                console.log("you're in wild grass!");
                if (Math.random() > 0.96) {
                    gamestate = GAMESTATE.FIGHTING;
                    document.getElementById("kampfUI").style.visibility = "visible";
                    startBattle();
                }
            }
        }
        for (let i: number = 0; i < document.getElementsByTagName("audio").length; i++ ) {
            document.getElementsByTagName("audio")[i].volume = document.getElementById("audioSlider").value / 100;
        }
        viewport.draw();
    }

    function startBattle(): void {
        switchMusic();
        if (posInTeam != null) {
            activeMonster = team[posInTeam];
        } else {
            activeMonster = team[0];
            posInTeam = 0;
        }
        if (team.length == 0) {
            document.getElementById("attacks").style.visibility = "hidden";
            document.getElementById("einfangen").style.visibility = "visible";
        } else if (team.length == 3) {
            document.getElementById("einfangen").style.visibility = "hidden";
            document.getElementById("attacks").style.visibility = "visible";
        } else {
            document.getElementById("einfangen").style.visibility = "visible";
            document.getElementById("attacks").style.visibility = "visible";
        }

        loadBattleUI();

        // monster
        generateEnemy();
        if (team.length > 0) displayActiveMonster();
    }

    function loadBattleUI(): void {
        document.getElementById("team").innerHTML = "";
        for (let i: number = 0; i < team.length; i++) {
            document.getElementById("team").innerHTML += `<div id=${i}>${team[i].name}<div>`;
        }
        for (let i: number = 0; i < team.length; i++) {
            document.getElementById(`${i}`).addEventListener("click", changeMonster);
        }
    }

    function changeMonster(_event: Event): void {
        activeMonster = team[_event.target.id];
        posInTeam = _event.target.id;
        displayActiveMonster();
        enemyAttack();
    }

    function displayActiveMonster(): void {
        document.getElementById("activeMonster").innerHTML = "";
        document.getElementById("activeMonster").innerHTML = `
        <span>${activeMonster.name}</span>
        <span>: LVL ${activeMonster.level}</span>
        <meter id="activeMonsterHP" type="range" disabled min="0" max="${activeMonster.maxHp}" value="${activeMonster.hp}"></meter>
        <label id="hpLabel" for="activeMonsterHP">HP: ${activeMonster.hp}/${activeMonster.maxHp}</label>
        <meter id="activeMonsterEXP" type="range" disabled min="0" max="${activeMonster.expToNextLvl}" value="${activeMonster.curExp}"></meter>
        <label for="activeMonsterHP">XP: ${activeMonster.curExp}/${activeMonster.expToNextLvl}</label>`
        if (activeMonster.shiny) {
            document.getElementById("activeMonster").innerHTML += `<img id="activeMonsterIMG" src="./assets/${activeMonster.name}s.png" alt="">`;
        } else {
            document.getElementById("activeMonster").innerHTML += `<img id="activeMonsterIMG" src="./assets/${activeMonster.name}.png" alt="">`;
        }
    }

    async function getShinyOdds(_filename: string): Promise<number> {
        let data: { shinyOdds: number } = await (await fetch(_filename)).json();
        let x: number = data.shinyOdds;
        return x;
    }

    function generateEnemy(): void {
        let shiny: boolean = false;
        let r: number = Math.random();
        if (r < shinyOdds) {
            shiny = true;
        }

        let name: string;
        r = Math.floor(Math.random() * 3);
        switch (r) {
            case 0:
                name = "IGNILUX";
                break;
            case 1:
                name = "TERAKNOSP";
                break;
            case 2:
                name = "HYDRELLY";
                break;
            default:
                break;
        }

        // generate html
        document.getElementById("enemy").innerHTML = "";
        enemyMonster = new Monster(name, shiny);
        document.getElementById("enemy").innerHTML = `
        <span>${enemyMonster.name}</span>
        <span>: LVL ${enemyMonster.level}</span>
        <meter id="enemyHP" type="range" disabled min="0" max="${enemyMonster.maxHp}" value="${enemyMonster.hp}"></meter>`
        if (shiny) {
            document.getElementById("enemy").innerHTML += `<img id="enemyIMG" src="./assets/${enemyMonster.name}s.png" alt="">`;
        } else {
            document.getElementById("enemy").innerHTML += `<img id="enemyIMG" src="./assets/${enemyMonster.name}.png" alt="">`;
        }
    }

    function enemyAttack(): void {
        delay(250).then(()=> {
            if (Math.random() > 0.25) {
                sound = <HTMLAudioElement>document.getElementById("attackSound");
                sound.play();
                document.getElementById("activeMonsterIMG").style.filter = "brightness(50%)";
                activeMonster.hp -= Math.floor((enemyMonster.atk * 4) / activeMonster.def);
                document.getElementById("activeMonsterHP").value = activeMonster.hp;
                document.getElementById("hpLabel").innerText = `HP: ${activeMonster.hp}/${activeMonster.maxHp}`;
                delay(150).then(()=> document.getElementById("activeMonsterIMG").style.filter = "brightness(100%)");
                checkHP();
            }
        })
    }

    function action(_event: Event) {
        sound = <HTMLAudioElement>document.getElementById("confirmAction");
        sound.play();
        switch (_event.target.innerHTML) {
            case "INFERNO":
                switch (enemyMonster.type) {
                    case "GRASS":
                        enemyMonster.hp -= (activeMonster.atk * 7) / enemyMonster.def;
                        break;
                    case "FIRE":
                        enemyMonster.hp -= (activeMonster.atk * 5) / enemyMonster.def;
                        break;
                    case "WATER":
                        enemyMonster.hp -= (activeMonster.atk * 3) / enemyMonster.def;
                        break;
                    default:
                        break;
                }
                document.getElementById("enemyIMG").style.filter = "brightness(50%)";
                sound = <HTMLAudioElement>document.getElementById("attackSound");
                sound.play();
                break;
            case "SINNFLUT":
                switch (enemyMonster.type) {
                    case "GRASS":
                        enemyMonster.hp -= (activeMonster.atk * 3) / enemyMonster.def;
                        break;
                    case "FIRE":
                        enemyMonster.hp -= (activeMonster.atk * 7) / enemyMonster.def;
                        break;
                    case "WATER":
                        enemyMonster.hp -= (activeMonster.atk * 5) / enemyMonster.def;
                        break;
                    default:
                        break;
                }
                document.getElementById("enemyIMG").style.filter = "brightness(50%)";
                sound = <HTMLAudioElement>document.getElementById("attackSound");
                sound.play();
                break;
            case "MEGARANKE":
                switch (enemyMonster.type) {
                    case "GRASS":
                        enemyMonster.hp -= (activeMonster.atk * 5) / enemyMonster.def;
                        break;
                    case "FIRE":
                        enemyMonster.hp -= (activeMonster.atk * 3) / enemyMonster.def;
                        break;
                    case "WATER":
                        enemyMonster.hp -= (activeMonster.atk * 7) / enemyMonster.def;
                        break;
                    default:
                        break;
                }
                document.getElementById("enemyIMG").style.filter = "brightness(50%)";
                sound = <HTMLAudioElement>document.getElementById("attackSound");
                sound.play();
                break;
            case "HEILTRANK":
                sound = <HTMLAudioElement>document.getElementById("heiltrank");
                sound.play();
                activeMonster.hp += 10;
                if (activeMonster.hp > activeMonster.maxHp) activeMonster.hp = activeMonster.maxHp;
                document.getElementById("hpLabel").innerText = `HP: ${activeMonster.hp}/${activeMonster.maxHp}`;
                break;
            case "EINFANGEN":
                if (team.length < 3) {
                    sound = <HTMLAudioElement>document.getElementById("gefangen");
                    sound.play();
                    team.push(enemyMonster);
                    enemyMonster = null;
                    cooldown = true;
                    gamestate = GAMESTATE.WORLD;
                    document.getElementById("kampfUI").style.visibility = "hidden";
                    document.getElementById("attacks").style.visibility = "hidden";
                    document.getElementById("einfangen").style.visibility = "hidden";
                    switchMusic();
                    delay(3000).then(()=> cooldown = false);
                }
                return;
            case "FLIEHEN":
                sound = <HTMLAudioElement>document.getElementById("geflüchtet");
                sound.play();
                enemyMonster = null;
                cooldown = true;
                gamestate = GAMESTATE.WORLD;
                document.getElementById("kampfUI").style.visibility = "hidden";
                document.getElementById("attacks").style.visibility = "hidden";
                document.getElementById("einfangen").style.visibility = "hidden";
                switchMusic();
                delay(3000).then(()=> cooldown = false);
                return;
            default:
                break;
        }

        // update hp bars
        delay(150).then(()=> document.getElementById("enemyIMG").style.filter = "brightness(100%)");
        document.getElementById("enemyHP").value = enemyMonster.hp;
        document.getElementById("activeMonsterHP").value = activeMonster.hp;

        // check death before attack
        if (enemyMonster.hp <= 0) {
            activeMonster.curExp += enemyMonster.expGain;
            activeMonster.levelUp();
            enemyMonster = null;
            cooldown = true;
            gamestate = GAMESTATE.WORLD;
            document.getElementById("kampfUI").style.visibility = "hidden";
            document.getElementById("attacks").style.visibility = "hidden";
            document.getElementById("einfangen").style.visibility = "hidden";
            switchMusic();
            delay(3000).then(()=> cooldown = false);
            return;
        }
        enemyAttack();
    }

    function switchMusic(): void {
        if (gamestate == GAMESTATE.WORLD) {
            bgmusic = <HTMLAudioElement>document.getElementById("FIGHTING");
            bgmusic.pause();
            bgmusic.currentTime = 0;
            bgmusic = <HTMLAudioElement>document.getElementById("WORLD");
            bgmusic.play();
        } else if (gamestate == GAMESTATE.FIGHTING) {
            bgmusic = <HTMLAudioElement>document.getElementById("WORLD");
            bgmusic.pause();
            bgmusic.currentTime = 0;
            bgmusic = <HTMLAudioElement>document.getElementById("FIGHTING");
            bgmusic.play();
        }
    }

    function checkHP(): void {
        if (activeMonster.hp <= 0) {
            team.splice(posInTeam, 1);
            activeMonster = null;
            loadBattleUI();
            displayActiveMonster();
            if (team.length == 0) document.getElementById("attacks").style.visibility = "hidden";
        }
    }

    function delay(ms: number): Promise<number> {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    function move(_event: KeyboardEvent): void {
        switch (_event.key) {
            case "w":
                if (avatar.mtxLocal.translation.y < 1.2) {
                    avatar.rect.position.y += 0.85;
                    avatar.mtxLocal.translateY(0.85);
                }
                break;
            case "s":
                if (avatar.mtxLocal.translation.y > 0.3) {
                    avatar.rect.position.y -= 0.85;
                    avatar.mtxLocal.translateY(-0.85);
                }
                break;
            case "a":
                if (avatar.mtxLocal.translation.x > -0.5) {
                    avatar.rect.position.x -= 0.85;
                    avatar.mtxLocal.translateX(-0.85);
                }
                break;
            case "d":
                if (avatar.mtxLocal.translation.x < 0.5) {
                    avatar.rect.position.x += 0.85;
                    avatar.mtxLocal.translateX(0.85);
                }
                break;
            default:
                break;
        }
    }
}