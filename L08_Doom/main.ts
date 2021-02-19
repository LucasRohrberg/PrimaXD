namespace L08_Doom {
    import f = FudgeCore;

    window.addEventListener("load", hndLoad);
    export let viewport: f.Viewport;

    let root: f.Node;
    let cmpCamera: f.ComponentCamera = new f.ComponentCamera();

    function hndLoad(): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        root = new f.Node("Root");

        // Wand
        let wall: f.Node = new f.Node("Cube");
        let meshWall: f.MeshCube = new f.MeshCube();
        let cmpWall: f.ComponentMesh = new f.ComponentMesh(meshWall);
        let lightBlue: f.Material = new f.Material("LightBlue", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("#192DA1")));
        let cLightBlue: f.ComponentMaterial = new f.ComponentMaterial(lightBlue);

        cmpWall.pivot.scale(new f.Vector3(5, 3, 5));

        wall.addComponent(cmpWall);
        wall.addComponent(cLightBlue);
        root.addChild(wall);

        // Boden
        let floor: f.Node = new f.Node("Cube");
        let meshFloor: f.MeshCube = new f.MeshCube();
        let cmpFloor: f.ComponentMesh = new f.ComponentMesh(meshFloor);
        let darkBlue: f.Material = new f.Material("DarkBlue", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("#111E6C")));
        let cDarkBlue: f.ComponentMaterial = new f.ComponentMaterial(darkBlue);

        cmpFloor.pivot.scale(new f.Vector3(8.3, 0.1, 8));
        cmpFloor.pivot.translateZ(-0.2);
        cmpFloor.pivot.translateY(-25);

        floor.addComponent(cmpFloor);
        floor.addComponent(cDarkBlue);
        root.addChild(floor);
        
        // Kamera
        cmpCamera.pivot.translateZ(15);
        cmpCamera.pivot.rotateY(180);

        viewport = new f.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);

        // viewport.draw();

        // Animation
        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, hndLoop);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 30);
    }

    function hndLoop(_event: Event): void {
        // let frameTime: number = ƒ.Time.game.getElapsedSincePreviousCall() / 1000;
        if (cmpCamera.pivot.translation.z > 10) cmpCamera.pivot.translateZ(0.1);

        viewport.draw();
    }
}