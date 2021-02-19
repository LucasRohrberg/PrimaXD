"use strict";
var Endabgabe;
(function (Endabgabe) {
    var f = FudgeCore;
    var faid = FudgeAid;
    window.addEventListener("load", init);
    window.addEventListener("keydown", move);
    Endabgabe.team = [];
    const clrWhite = f.Color.CSS("white");
    let cmpCamera;
    let root = new f.Node("root");
    let enemyMonster;
    let activeMonster;
    let posInTeam;
    let shinyOdds;
    let bgmusic;
    let cooldown = false;
    let sound;
    let GAMESTATE;
    (function (GAMESTATE) {
        GAMESTATE[GAMESTATE["FIGHTING"] = 0] = "FIGHTING";
        GAMESTATE[GAMESTATE["WORLD"] = 1] = "WORLD";
    })(GAMESTATE || (GAMESTATE = {}));
    // TODO: Attack Sounds, Menü Hover Sounds
    async function init() {
        shinyOdds = await getShinyOdds("./js/gamestats.json");
        for (let i = 0; i < document.getElementsByClassName("combat").length; i++) {
            document.getElementsByClassName("combat")[i].addEventListener("click", action);
        }
        for (let i = 0; i < document.getElementsByClassName("action").length; i++) {
            document.getElementsByClassName("action")[i].addEventListener("click", action);
        }
        Endabgabe.gamestate = GAMESTATE.WORLD;
        const canvas = document.querySelector("canvas");
        let txtFloor = new f.TextureImage("./assets/background.png");
        let mtrFloor = new f.Material("mtrFloor", f.ShaderTexture, new f.CoatTextured(clrWhite, txtFloor));
        let floor = new faid.Node("floor", f.Matrix4x4.IDENTITY(), mtrFloor, new f.MeshQuad());
        floor.mtxLocal.translateZ(-0.1);
        floor.mtxLocal.scale(new f.Vector3(2.5, 2.5, 1));
        root.appendChild(floor);
        cmpCamera = new f.ComponentCamera();
        cmpCamera.backgroundColor = f.Color.CSS("#333333");
        cmpCamera.pivot.translateZ(15);
        cmpCamera.pivot.rotateY(180);
        let txtPlayer = new f.TextureImage("./assets/player.png");
        let mtrPlayer = new f.Material("mtrPlayer", f.ShaderTexture, new f.CoatTextured(clrWhite, txtPlayer));
        let cmpMaterialPlayer = new f.ComponentMaterial(mtrPlayer);
        let meshQuad = new f.MeshQuad("meshPlayer");
        let cmpMeshPlayer = new f.ComponentMesh(meshQuad);
        let cmpTransformPlayer = new f.ComponentTransform(f.Matrix4x4.IDENTITY());
        Endabgabe.avatar = new Endabgabe.GameObject("player", new f.Vector2(0, 0), new f.Vector2(1, 1));
        Endabgabe.avatar.addComponent(cmpMaterialPlayer);
        Endabgabe.avatar.addComponent(cmpMeshPlayer);
        Endabgabe.avatar.addComponent(cmpTransformPlayer);
        Endabgabe.avatar.addComponent(cmpCamera);
        Endabgabe.avatar.mtxLocal.translateY(0.32);
        Endabgabe.avatar.mtxLocal.scale(new f.Vector3(0.09, 0.09, 1));
        root.appendChild(Endabgabe.avatar);
        let mtrGrass = new f.Material("mtrGrass", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("GREEN", 0)));
        let cmpMaterialGrass = new f.ComponentMaterial(mtrGrass);
        let cmpMeshGrass = new f.ComponentMesh(meshQuad);
        let cmpTransformGrass = new f.ComponentTransform(f.Matrix4x4.IDENTITY());
        Endabgabe.grass = new Endabgabe.GameObject("grass", new f.Vector2(-2.5, 7), new f.Vector2(6, 2));
        Endabgabe.grass.addComponent(cmpMaterialGrass);
        Endabgabe.grass.addComponent(cmpMeshGrass);
        Endabgabe.grass.addComponent(cmpTransformGrass);
        Endabgabe.grass.mtxLocal.translateY(0.2);
        Endabgabe.grass.mtxLocal.translateZ(-1);
        Endabgabe.grass.mtxLocal.scale(new f.Vector3(0.64, 0.22, 1));
        root.appendChild(Endabgabe.grass);
        Endabgabe.viewport = new f.Viewport();
        Endabgabe.viewport.initialize("Viewport", root, cmpCamera, canvas);
        Endabgabe.viewport.draw();
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, loop);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 8);
    }
    function loop(_event) {
        if (Endabgabe.gamestate == GAMESTATE.WORLD && cooldown == false) {
            if (Endabgabe.avatar.checkCollision(Endabgabe.grass)) {
                console.log("you're in wild grass!");
                if (Math.random() > 0.96) {
                    Endabgabe.gamestate = GAMESTATE.FIGHTING;
                    document.getElementById("kampfUI").style.visibility = "visible";
                    startBattle();
                }
            }
        }
        for (let i = 0; i < document.getElementsByTagName("audio").length; i++) {
            document.getElementsByTagName("audio")[i].volume = document.getElementById("audioSlider").value / 100;
        }
        Endabgabe.viewport.draw();
    }
    function startBattle() {
        switchMusic();
        if (posInTeam != null) {
            activeMonster = Endabgabe.team[posInTeam];
        }
        else {
            activeMonster = Endabgabe.team[0];
            posInTeam = 0;
        }
        if (Endabgabe.team.length == 0) {
            document.getElementById("attacks").style.visibility = "hidden";
            document.getElementById("einfangen").style.visibility = "visible";
        }
        else if (Endabgabe.team.length == 3) {
            document.getElementById("einfangen").style.visibility = "hidden";
            document.getElementById("attacks").style.visibility = "visible";
        }
        else {
            document.getElementById("einfangen").style.visibility = "visible";
            document.getElementById("attacks").style.visibility = "visible";
        }
        loadBattleUI();
        // monster
        generateEnemy();
        if (Endabgabe.team.length > 0)
            displayActiveMonster();
    }
    function loadBattleUI() {
        document.getElementById("team").innerHTML = "";
        for (let i = 0; i < Endabgabe.team.length; i++) {
            document.getElementById("team").innerHTML += `<div id=${i}>${Endabgabe.team[i].name}<div>`;
        }
        for (let i = 0; i < Endabgabe.team.length; i++) {
            document.getElementById(`${i}`).addEventListener("click", changeMonster);
        }
    }
    function changeMonster(_event) {
        activeMonster = Endabgabe.team[_event.target.id];
        posInTeam = _event.target.id;
        displayActiveMonster();
        enemyAttack();
    }
    function displayActiveMonster() {
        document.getElementById("activeMonster").innerHTML = "";
        document.getElementById("activeMonster").innerHTML = `
        <span>${activeMonster.name}</span>
        <span>: LVL ${activeMonster.level}</span>
        <meter id="activeMonsterHP" type="range" disabled min="0" max="${activeMonster.maxHp}" value="${activeMonster.hp}"></meter>
        <label id="hpLabel" for="activeMonsterHP">HP: ${activeMonster.hp}/${activeMonster.maxHp}</label>
        <meter id="activeMonsterEXP" type="range" disabled min="0" max="${activeMonster.expToNextLvl}" value="${activeMonster.curExp}"></meter>
        <label for="activeMonsterHP">XP: ${activeMonster.curExp}/${activeMonster.expToNextLvl}</label>`;
        if (activeMonster.shiny) {
            document.getElementById("activeMonster").innerHTML += `<img id="activeMonsterIMG" src="./assets/${activeMonster.name}s.png" alt="">`;
        }
        else {
            document.getElementById("activeMonster").innerHTML += `<img id="activeMonsterIMG" src="./assets/${activeMonster.name}.png" alt="">`;
        }
    }
    async function getShinyOdds(_filename) {
        let data = await (await fetch(_filename)).json();
        let x = data.shinyOdds;
        return x;
    }
    function generateEnemy() {
        let shiny = false;
        let r = Math.random();
        if (r < shinyOdds) {
            shiny = true;
        }
        let name;
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
        enemyMonster = new Endabgabe.Monster(name, shiny);
        document.getElementById("enemy").innerHTML = `
        <span>${enemyMonster.name}</span>
        <span>: LVL ${enemyMonster.level}</span>
        <meter id="enemyHP" type="range" disabled min="0" max="${enemyMonster.maxHp}" value="${enemyMonster.hp}"></meter>`;
        if (shiny) {
            document.getElementById("enemy").innerHTML += `<img id="enemyIMG" src="./assets/${enemyMonster.name}s.png" alt="">`;
        }
        else {
            document.getElementById("enemy").innerHTML += `<img id="enemyIMG" src="./assets/${enemyMonster.name}.png" alt="">`;
        }
    }
    function enemyAttack() {
        delay(250).then(() => {
            if (Math.random() > 0.25) {
                sound = document.getElementById("attackSound");
                sound.play();
                document.getElementById("activeMonsterIMG").style.filter = "brightness(50%)";
                activeMonster.hp -= Math.floor((enemyMonster.atk * 4) / activeMonster.def);
                document.getElementById("activeMonsterHP").value = activeMonster.hp;
                document.getElementById("hpLabel").innerText = `HP: ${activeMonster.hp}/${activeMonster.maxHp}`;
                delay(150).then(() => document.getElementById("activeMonsterIMG").style.filter = "brightness(100%)");
                checkHP();
            }
        });
    }
    function action(_event) {
        sound = document.getElementById("confirmAction");
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
                sound = document.getElementById("attackSound");
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
                sound = document.getElementById("attackSound");
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
                sound = document.getElementById("attackSound");
                sound.play();
                break;
            case "HEILTRANK":
                sound = document.getElementById("heiltrank");
                sound.play();
                activeMonster.hp += activeMonster.level * 3;
                if (activeMonster.hp > activeMonster.maxHp)
                    activeMonster.hp = activeMonster.maxHp;
                document.getElementById("hpLabel").innerText = `HP: ${activeMonster.hp}/${activeMonster.maxHp}`;
                break;
            case "EINFANGEN":
                if (Endabgabe.team.length < 3) {
                    sound = document.getElementById("gefangen");
                    sound.play();
                    Endabgabe.team.push(enemyMonster);
                    enemyMonster = null;
                    cooldown = true;
                    Endabgabe.gamestate = GAMESTATE.WORLD;
                    document.getElementById("kampfUI").style.visibility = "hidden";
                    document.getElementById("attacks").style.visibility = "hidden";
                    document.getElementById("einfangen").style.visibility = "hidden";
                    switchMusic();
                    delay(3000).then(() => cooldown = false);
                }
                return;
            case "FLIEHEN":
                sound = document.getElementById("geflüchtet");
                sound.play();
                enemyMonster = null;
                cooldown = true;
                Endabgabe.gamestate = GAMESTATE.WORLD;
                document.getElementById("kampfUI").style.visibility = "hidden";
                document.getElementById("attacks").style.visibility = "hidden";
                document.getElementById("einfangen").style.visibility = "hidden";
                switchMusic();
                delay(3000).then(() => cooldown = false);
                return;
            default:
                break;
        }
        // update hp bars
        delay(150).then(() => document.getElementById("enemyIMG").style.filter = "brightness(100%)");
        document.getElementById("enemyHP").value = enemyMonster.hp;
        document.getElementById("activeMonsterHP").value = activeMonster.hp;
        // check death before attack
        if (enemyMonster.hp <= 0) {
            activeMonster.curExp += enemyMonster.expGain;
            activeMonster.levelUp();
            enemyMonster = null;
            cooldown = true;
            Endabgabe.gamestate = GAMESTATE.WORLD;
            document.getElementById("kampfUI").style.visibility = "hidden";
            document.getElementById("attacks").style.visibility = "hidden";
            document.getElementById("einfangen").style.visibility = "hidden";
            switchMusic();
            delay(3000).then(() => cooldown = false);
            return;
        }
        enemyAttack();
    }
    function switchMusic() {
        if (Endabgabe.gamestate == GAMESTATE.WORLD) {
            bgmusic = document.getElementById("FIGHTING");
            bgmusic.pause();
            bgmusic.currentTime = 0;
            bgmusic = document.getElementById("WORLD");
            bgmusic.play();
        }
        else if (Endabgabe.gamestate == GAMESTATE.FIGHTING) {
            bgmusic = document.getElementById("WORLD");
            bgmusic.pause();
            bgmusic.currentTime = 0;
            bgmusic = document.getElementById("FIGHTING");
            bgmusic.play();
        }
    }
    function checkHP() {
        if (activeMonster.hp <= 0) {
            Endabgabe.team.splice(posInTeam, 1);
            activeMonster = null;
            loadBattleUI();
            displayActiveMonster();
            if (Endabgabe.team.length == 0)
                document.getElementById("attacks").style.visibility = "hidden";
        }
    }
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function move(_event) {
        switch (_event.key) {
            case "w":
                if (Endabgabe.avatar.mtxLocal.translation.y < 1.2) {
                    Endabgabe.avatar.rect.position.y += 0.85;
                    Endabgabe.avatar.mtxLocal.translateY(0.85);
                }
                break;
            case "s":
                if (Endabgabe.avatar.mtxLocal.translation.y > 0.3) {
                    Endabgabe.avatar.rect.position.y -= 0.85;
                    Endabgabe.avatar.mtxLocal.translateY(-0.85);
                }
                break;
            case "a":
                if (Endabgabe.avatar.mtxLocal.translation.x > -0.5) {
                    Endabgabe.avatar.rect.position.x -= 0.85;
                    Endabgabe.avatar.mtxLocal.translateX(-0.85);
                }
                break;
            case "d":
                if (Endabgabe.avatar.mtxLocal.translation.x < 0.5) {
                    Endabgabe.avatar.rect.position.x += 0.85;
                    Endabgabe.avatar.mtxLocal.translateX(0.85);
                }
                break;
            default:
                break;
        }
    }
})(Endabgabe || (Endabgabe = {}));
//# sourceMappingURL=Main.js.map