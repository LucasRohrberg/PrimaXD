namespace eternity {
    console.log("hiii.");
    import f = FudgeCore;

    window.addEventListener("load", init);
    export let viewport: f.Viewport;

    function init() {
        let canvas: HTMLCanvasElement = document.querySelector("canvas");

        let node: f.Node = new f.Node("Quad");
        let mesh: f.Mesh = new f.MeshQuad();
        let cMesh: f.ComponentMesh = new f.ComponentMesh(mesh);
        node.addComponent(cMesh);

        let matRed: f.Material = new f.Material("matRed", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("GREEN")));
        let cMaterial: f.ComponentMaterial = new f.ComponentMaterial(matRed);
        node.addComponent(cMaterial);

        let cCamera: f.ComponentCamera = new f.ComponentCamera();
        cCamera.pivot.translateZ(4);
        cCamera.pivot.rotateY(180);
        
        viewport = new f.Viewport();
        viewport.initialize("Viewport", node, cCamera, canvas);

        viewport.draw();
    }
}