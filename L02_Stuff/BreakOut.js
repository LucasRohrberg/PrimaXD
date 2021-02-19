"use strict";
var L02_DavidsRotation;
(function (L02_DavidsRotation) {
    var ƒ = FudgeCore;
    window.addEventListener("load", hndLoad);
    let root;
    let speed = new ƒ.Vector3(0.3, 0.3, 0);
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        ƒ.Debug.log(canvas);
        // Background
        let quad = new ƒ.Node("Quad");
        root = new ƒ.Node("Root");
        root.addComponent(new ƒ.ComponentTransform());
        let meshQuad = new ƒ.MeshQuad();
        let cmpQuad = new ƒ.ComponentMesh(meshQuad);
        quad.addComponent(cmpQuad);
        root.appendChild(quad);
        // Blocks
        let cube = new ƒ.Node("Cube");
        let meshCube = new ƒ.MeshCube();
        let cmpCube = new ƒ.ComponentMesh(meshCube);
        let blue = new ƒ.Material("Blue", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("LIGHTBLUE")));
        let cblue = new ƒ.ComponentMaterial(blue);
        cmpCube.pivot.scaleX(2);
        cmpCube.pivot.scaleY(0.5);
        cmpCube.pivot.scaleZ(0.01);
        cmpCube.pivot.translateX(-2);
        cube.addComponent(cmpCube);
        cube.addComponent(cblue);
        root.appendChild(cube);
        // 2
        let cube2 = new ƒ.Node("Cube");
        let cmpCube2 = new ƒ.ComponentMesh(meshCube);
        let cblue2 = new ƒ.ComponentMaterial(blue);
        cmpCube2.pivot.scaleX(2);
        cmpCube2.pivot.scaleY(0.5);
        cmpCube2.pivot.scaleZ(0.01);
        cmpCube2.pivot.translateX(2);
        cube2.addComponent(cmpCube2);
        cube2.addComponent(cblue2);
        root.appendChild(cube2);
        // Spielball
        let ball = new ƒ.Node("Sphere");
        let meshBall = new ƒ.MeshSphere("Ball", 15, 15);
        let cmpBall = new ƒ.ComponentMesh(meshBall);
        let white = new ƒ.Material("White", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));
        let cwhite = new ƒ.ComponentMaterial(white);
        cmpBall.pivot.translateY(-3);
        cmpBall.pivot.rotateZ(45);
        cmpBall.pivot.scale(new ƒ.Vector3(0.5, 0.5, 0.5));
        ball.addComponent(cmpBall);
        ball.addComponent(cwhite);
        root.appendChild(ball);
        // Camera
        let cCamera = new ƒ.ComponentCamera();
        cCamera.pivot.translateZ(9);
        cCamera.pivot.translateY(-2);
        cCamera.pivot.rotateY(180);
        // Viewport
        L02_DavidsRotation.viewport = new ƒ.Viewport();
        L02_DavidsRotation.viewport.initialize("Viewport", root, cCamera, canvas);
        ƒ.Debug.log(L02_DavidsRotation.viewport);
        // Animation
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
        function hndLoop(_event) {
            if (cmpBall.pivot.translation.y > 0.5 || cmpBall.pivot.translation.y < -4.5) {
                // speed.y *= -1;
                // speed.x *= -1;
                speed.scale(-1);
            }
            cmpBall.pivot.translate(speed);
            L02_DavidsRotation.viewport.draw();
        }
        // varName = ƒ.Time.game.getElapsedSincePreviousCall();
        // speedVariableCopy
        // speedVariableCopy.scale(varName);
        // Bewegung
    }
})(L02_DavidsRotation || (L02_DavidsRotation = {}));
//# sourceMappingURL=BreakOut.js.map