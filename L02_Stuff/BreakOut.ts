namespace L02_DavidsRotation {
    import ƒ = FudgeCore;
  
    window.addEventListener("load", hndLoad);
    // window.addEventListener("click", sceneLoad);
  
    export let viewport: ƒ.Viewport;
  
    let root: ƒ.Node;
    let speed: ƒ.Vector3 = new ƒ.Vector3(0.3, 0.3, 0);
  
    function hndLoad(_event: Event): void {
  
      const canvas: HTMLCanvasElement = document.querySelector("canvas");
      ƒ.Debug.log(canvas);
  
      // Background
      let quad: ƒ.Node = new ƒ.Node("Quad");
      root = new ƒ.Node("Root");
      root.addComponent(new ƒ.ComponentTransform());
  
      let meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad();
      let cmpQuad: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshQuad);
      quad.addComponent(cmpQuad);
      root.appendChild(quad);
      
      // Blocks
      let cube: ƒ.Node = new ƒ.Node("Cube");
      let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
      let cmpCube: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
      let blue: ƒ.Material = new ƒ.Material("Blue", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("LIGHTBLUE")));
      let cblue: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(blue);
  
      cmpCube.pivot.scaleX(2);
      cmpCube.pivot.scaleY(0.5);
      cmpCube.pivot.scaleZ(0.01);
      cmpCube.pivot.translateX(-2);

      cube.addComponent(cmpCube);
      cube.addComponent(cblue);
      root.appendChild(cube);

      // 2
      let cube2: ƒ.Node = new ƒ.Node("Cube");
      let cmpCube2: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
      let cblue2: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(blue);
      
      cmpCube2.pivot.scaleX(2);
      cmpCube2.pivot.scaleY(0.5);
      cmpCube2.pivot.scaleZ(0.01);
      cmpCube2.pivot.translateX(2);

      cube2.addComponent(cmpCube2);
      cube2.addComponent(cblue2);
      root.appendChild(cube2);


      // Spielball
      let ball: ƒ.Node = new ƒ.Node("Sphere");
      let meshBall: ƒ.MeshSphere = new ƒ.MeshSphere("Ball", 15, 15);
      let cmpBall: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshBall);
      let white: ƒ.Material = new ƒ.Material("White", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));
      let cwhite: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(white);

      cmpBall.pivot.translateY(-3);
      cmpBall.pivot.rotateZ(45);
      cmpBall.pivot.scale(new ƒ.Vector3(0.5, 0.5, 0.5));

      ball.addComponent(cmpBall);
      ball.addComponent(cwhite);
      root.appendChild(ball);
  
      // Camera
      let cCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
      cCamera.pivot.translateZ(9);
      cCamera.pivot.translateY(-2);
      cCamera.pivot.rotateY(180);

      // Viewport
      viewport = new ƒ.Viewport();
      viewport.initialize("Viewport", root, cCamera, canvas);
      ƒ.Debug.log(viewport);
      
      // Animation
      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, hndLoop);  
      ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
      
      function hndLoop(_event: Event): void {
        if (cmpBall.pivot.translation.y > 0.5 || cmpBall.pivot.translation.y < -4.5) {
          // speed.y *= -1;
          // speed.x *= -1;
          speed.scale(-1);
        }
        cmpBall.pivot.translate(speed);

        viewport.draw();
      }

      // varName = ƒ.Time.game.getElapsedSincePreviousCall();
      // speedVariableCopy
      // speedVariableCopy.scale(varName);
      // Bewegung

    }
  }