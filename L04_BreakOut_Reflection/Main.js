"use strict";
// namespace L04_BreakOut_Reflection {
//   import ƒ = FudgeCore;
//   window.addEventListener("load", hndLoad);
//   // window.addEventListener("click", sceneLoad);
//   let ball: GameObject;
//   let walls: ƒ.Node;
//   let score: number = 0;
//   let velocity: ƒ.Vector3 = new ƒ.Vector3(ƒ.Random.default.getRange(-1, 1), ƒ.Random.default.getRange(-1, 1), 0);
//   let speed: number = 15;
//   velocity.normalize(speed);
//   export let viewport: ƒ.Viewport;
//   let root: ƒ.Node;
//   function hndLoad(_event: Event): void {
//     const canvas: HTMLCanvasElement = document.querySelector("canvas");
//     // ƒ.Debug.log(canvas);
//     root = new ƒ.Node("Root");
//     ball = new GameObject("Ball", new ƒ.Vector2(0, 0), new ƒ.Vector2(1, 1));
//     root.addChild(ball);
//     walls = new ƒ.Node("Walls");
//     root.addChild(walls);
//     walls.addChild(new GameObject("WallLeft", new ƒ.Vector2(-19, 0), new ƒ.Vector2(1, 30)));
//     walls.addChild(new GameObject("WallRight", new ƒ.Vector2(19, 0), new ƒ.Vector2(1, 30)));
//     walls.addChild(new GameObject("WallTop", new ƒ.Vector2(0, 12.5), new ƒ.Vector2(40, 1)));
//     walls.addChild(new GameObject("WallBottom", new ƒ.Vector2(0, -12.5), new ƒ.Vector2(40, 1)));
//     //#region "Blocks"
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(0, 11), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(8, 11), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(-8, 11), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(16, 11), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(-16, 11), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(0, 8), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(8, 8), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(-8, 8), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(16, 8), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(-16, 8), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(0, 5), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(8, 5), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(-8, 5), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(16, 5), new ƒ.Vector2(4, 1)));
//     walls.addChild(new GameObject("Block", new ƒ.Vector2(-16, 5), new ƒ.Vector2(4, 1)));
//     //#endregion
//     let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
//     cmpCamera.pivot.translateZ(40);
//     cmpCamera.pivot.rotateY(180);
//     viewport = new ƒ.Viewport();
//     viewport.initialize("Viewport", root, cmpCamera, canvas);
//     // ƒ.Debug.log(viewport);
//     ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, hndLoop);
//     ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
//   }
//   function hndLoop(_event: Event): void {
//     // console.log("Tick");
//     document.getElementById("score").innerHTML = `Score: ${score.toString()}`;
//     let frameTime: number = ƒ.Time.game.getElapsedSincePreviousCall() / 1000;
//     let move: ƒ.Vector3 = ƒ.Vector3.SCALE(velocity, frameTime);
//     ball.mtxLocal.translate(move);
//     ball.rect.position.x = ball.mtxLocal.translation.x - 0.5;
//     ball.rect.position.y = ball.mtxLocal.translation.y - 0.5;
//     viewport.draw();
//     hndCollision();
//   }
//   function hndCollision(): void {
//     for (let wall of walls.getChildren()) {
//       let intersection: ƒ.Rectangle = ball.rect.getIntersection((<GameObject>wall).rect);
//       if (intersection) {
//         console.log("Ball collides");
//         if (intersection.size.x > intersection.size.y)
//           velocity.y *= -1;
//         else
//           velocity.x *= -1;
//         // remove block on collision
//         if ((<GameObject>wall).name == "Block") {
//           walls.removeChild(<GameObject>wall);
//           score += 10;
//         }
//       }
//     }
//   }
// }
//# sourceMappingURL=Main.js.map