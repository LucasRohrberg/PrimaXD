"use strict";
var L08_Doom;
(function (L08_Doom) {
    var f = FudgeCore;
    window.addEventListener("load", hndLoad);
    let root;
    let cmpCamera = new f.ComponentCamera();
    function hndLoad() {
        const canvas = document.querySelector("canvas");
        root = new f.Node("Root");
        // Wand
        let wall = new f.Node("Cube");
        let meshWall = new f.MeshCube();
        let cmpWall = new f.ComponentMesh(meshWall);
        let lightBlue = new f.Material("LightBlue", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("#192DA1")));
        let cLightBlue = new f.ComponentMaterial(lightBlue);
        cmpWall.pivot.scale(new f.Vector3(5, 3, 5));
        wall.addComponent(cmpWall);
        wall.addComponent(cLightBlue);
        root.addChild(wall);
        // Boden
        let floor = new f.Node("Cube");
        let meshFloor = new f.MeshCube();
        let cmpFloor = new f.ComponentMesh(meshFloor);
        let darkBlue = new f.Material("DarkBlue", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("#111E6C")));
        let cDarkBlue = new f.ComponentMaterial(darkBlue);
        cmpFloor.pivot.scale(new f.Vector3(8.3, 0.1, 8));
        cmpFloor.pivot.translateZ(-0.2);
        cmpFloor.pivot.translateY(-25);
        floor.addComponent(cmpFloor);
        floor.addComponent(cDarkBlue);
        root.addChild(floor);
        // Kamera
        cmpCamera.pivot.translateZ(15);
        cmpCamera.pivot.rotateY(180);
        L08_Doom.viewport = new f.Viewport();
        L08_Doom.viewport.initialize("Viewport", root, cmpCamera, canvas);
        // viewport.draw();
        // Animation
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 30);
    }
    function hndLoop(_event) {
        // let frameTime: number = ƒ.Time.game.getElapsedSincePreviousCall() / 1000;
        if (cmpCamera.pivot.translation.z > 10)
            cmpCamera.pivot.translateZ(0.1);
        L08_Doom.viewport.draw();
    }
})(L08_Doom || (L08_Doom = {}));
//# sourceMappingURL=main.js.map