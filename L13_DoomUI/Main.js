"use strict";
var L13_UI;
(function (L13_UI) {
    var ƒ = FudgeCore;
    var ƒaid = FudgeAid;
    window.addEventListener("load", hndLoad);
    const clrWhite = ƒ.Color.CSS("white");
    L13_UI.sizeWall = 3;
    L13_UI.numWalls = 20;
    L13_UI.avatar = new ƒ.Node("Avatar");
    let root = new ƒ.Node("Root");
    let walls;
    let enemies;
    let ui = new L13_UI.UI;
    let jumpSpeed = 0;
    let dy = 0;
    let ctrSpeed = new ƒ.Control("AvatarSpeed", 0.3, 0 /* PROPORTIONAL */);
    ctrSpeed.setDelay(100);
    let ctrStrafe = new ƒ.Control("AvatarSpeed", 0.1, 0 /* PROPORTIONAL */);
    ctrSpeed.setDelay(100);
    let ctrRotation = new ƒ.Control("AvatarRotation", -0.1, 0 /* PROPORTIONAL */);
    ctrRotation.setDelay(100);
    async function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        let meshQuad = new ƒ.MeshQuad("Quad");
        let txtFloor = new ƒ.TextureImage("../DoomAssets/DEM1_5.png");
        let mtrFloor = new ƒ.Material("Floor", ƒ.ShaderTexture, new ƒ.CoatTextured(clrWhite, txtFloor));
        let floor = new ƒaid.Node("Floor", ƒ.Matrix4x4.ROTATION_X(-90), mtrFloor, meshQuad);
        floor.mtxLocal.scale(ƒ.Vector3.ONE(L13_UI.sizeWall * L13_UI.numWalls));
        floor.getComponent(ƒ.ComponentMaterial).pivot.scale(ƒ.Vector2.ONE(L13_UI.numWalls));
        root.appendChild(floor);
        walls = createWalls();
        root.appendChild(walls);
        enemies = await createEnemies();
        root.appendChild(enemies);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.projectCentral(1, 45, ƒ.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
        cmpCamera.pivot.translate(ƒ.Vector3.Y(1.7));
        cmpCamera.backgroundColor = ƒ.Color.CSS("darkblue");
        L13_UI.avatar.addComponent(cmpCamera);
        L13_UI.avatar.addComponent(new ƒ.ComponentTransform());
        L13_UI.avatar.mtxLocal.translate(ƒ.Vector3.Z(10));
        L13_UI.avatar.mtxLocal.rotate(ƒ.Vector3.Y(180));
        root.appendChild(L13_UI.avatar);
        L13_UI.viewport = new ƒ.Viewport();
        L13_UI.viewport.initialize("Viewport", root, cmpCamera, canvas);
        L13_UI.viewport.draw();
        canvas.addEventListener("mousemove", hndMouse);
        canvas.addEventListener("click", canvas.requestPointerLock);
        document.addEventListener("click", shoot);
        document.addEventListener("keydown", hndJump);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 120);
    }
    function hndJump(_event) {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && L13_UI.avatar.mtxLocal.translation.y <= 0) {
            jumpSpeed = 0.3;
        }
    }
    function hndLoop(_event) {
        ctrSpeed.setInput(ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
            + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]));
        ctrStrafe.setInput(ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])
            + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]));
        moveAvatar(ctrSpeed.getOutput(), ctrRotation.getOutput(), ctrStrafe.getOutput());
        ctrRotation.setInput(0);
        L13_UI.avatar.mtxLocal.translateY(jumpSpeed);
        if (L13_UI.avatar.mtxLocal.translation.y <= 0) {
            jumpSpeed = 0;
            dy = 0;
        }
        else if (L13_UI.avatar.mtxLocal.translation.y > 0) {
            // let time: ƒ.Time = new ƒ.Time;
            // let dTime: number = time.getElapsedSincePreviousCall();
            // jumpSpeed *= dTime;
            dy -= 0.01;
            jumpSpeed += dy;
        }
        for (let enemy of enemies.getChildren())
            enemy.update();
        ui.displayUI();
        L13_UI.viewport.draw();
    }
    function shoot() {
        if (ui.ammoGun > 0)
            ui.ammoGun--;
    }
    function hndMouse(_event) {
        // console.log(_event.movementX, _event.movementY);
        ctrRotation.setInput(_event.movementX);
    }
    function moveAvatar(_speed, _rotation, _strafe) {
        L13_UI.avatar.mtxLocal.rotateY(_rotation);
        let posOld = L13_UI.avatar.mtxLocal.translation;
        L13_UI.avatar.mtxLocal.translateZ(_speed);
        L13_UI.avatar.mtxLocal.translateX(_strafe);
        let bouncedOff = bounceOffWalls(walls.getChildren());
        if (bouncedOff.length < 2)
            return;
        bouncedOff = bounceOffWalls(bouncedOff);
        if (bouncedOff.length == 0)
            return;
        console.log("Stuck!");
        L13_UI.avatar.mtxLocal.translation = posOld;
    }
    function bounceOffWalls(_walls) {
        let bouncedOff = [];
        let posAvatar = L13_UI.avatar.mtxLocal.translation;
        for (let wall of _walls) {
            let posBounce = wall.calculateBounce(posAvatar, 1);
            if (posBounce) {
                L13_UI.avatar.mtxLocal.translation = posBounce;
                bouncedOff.push(wall);
            }
        }
        return bouncedOff;
    }
    async function createEnemies() {
        let enemies = new ƒ.Node("Enemies");
        let txtCacodemon = new ƒ.TextureImage();
        await txtCacodemon.load("../DoomAssets/Cacodemon.png");
        let coatSprite = new ƒ.CoatTextured(clrWhite, txtCacodemon);
        L13_UI.Enemy.generateSprites(coatSprite);
        for (let i = 0; i < 1; i++)
            enemies.appendChild(new L13_UI.Enemy("Cacodemon" + i, ƒ.Vector3.Z(3)));
        // enemies.appendChild(new Enemy("Cacodemon1", ƒ.Vector3.X(3)));
        // enemies.appendChild(new Enemy("Cacodemon2", ƒ.Vector3.X(-3)));
        console.log("Enemies", enemies);
        return enemies;
    }
    function createWalls() {
        let walls = new ƒ.Node("Walls");
        let txtWall = new ƒ.TextureImage("../DoomAssets/CEMPOIS.png");
        let mtrWall = new ƒ.Material("Wall", ƒ.ShaderTexture, new ƒ.CoatTextured(clrWhite, txtWall));
        walls.appendChild(new L13_UI.Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.Y(L13_UI.sizeWall / 2), ƒ.Vector3.ZERO(), mtrWall));
        walls.appendChild(new L13_UI.Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(0.5, 1, -0.866), L13_UI.sizeWall / 2), ƒ.Vector3.Y(120), mtrWall));
        walls.appendChild(new L13_UI.Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(-0.5, 1, -0.866), L13_UI.sizeWall / 2), ƒ.Vector3.Y(-120), mtrWall));
        for (let i = -L13_UI.numWalls / 2 + 0.5; i < L13_UI.numWalls / 2; i++) {
            walls.appendChild(new L13_UI.Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(-L13_UI.numWalls / 2, 0.5, i), L13_UI.sizeWall), ƒ.Vector3.Y(90), mtrWall));
            // for (let i: number = -numWalls / 2 + 0.5; i < numWalls / 2; i++)
            walls.appendChild(new L13_UI.Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(L13_UI.numWalls / 2, 0.5, i), L13_UI.sizeWall), ƒ.Vector3.Y(-90), mtrWall));
            // for (let i: number = -numWalls / 2 + 0.5; i < numWalls / 2; i++)
            walls.appendChild(new L13_UI.Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(i, 0.5, -L13_UI.numWalls / 2), L13_UI.sizeWall), ƒ.Vector3.Y(0), mtrWall));
            // for (let i: number = -numWalls / 2 + 0.5; i < numWalls / 2; i++)
            walls.appendChild(new L13_UI.Wall(ƒ.Vector2.ONE(3), ƒ.Vector3.SCALE(new ƒ.Vector3(i, 0.5, L13_UI.numWalls / 2), L13_UI.sizeWall), ƒ.Vector3.Y(180), mtrWall));
        }
        return walls;
    }
})(L13_UI || (L13_UI = {}));
//# sourceMappingURL=Main.js.map