"use strict";
var eternity;
(function (eternity) {
    console.log("hiii.");
    var f = FudgeCore;
    window.addEventListener("load", init);
    function init() {
        let canvas = document.querySelector("canvas");
        let node = new f.Node("Quad");
        let mesh = new f.MeshQuad();
        let cMesh = new f.ComponentMesh(mesh);
        node.addComponent(cMesh);
        let matRed = new f.Material("matRed", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("GREEN")));
        let cMaterial = new f.ComponentMaterial(matRed);
        node.addComponent(cMaterial);
        let cCamera = new f.ComponentCamera();
        cCamera.pivot.translateZ(4);
        cCamera.pivot.rotateY(180);
        eternity.viewport = new f.Viewport();
        eternity.viewport.initialize("Viewport", node, cCamera, canvas);
        eternity.viewport.draw();
    }
})(eternity || (eternity = {}));
//# sourceMappingURL=Main.js.map