namespace L11_Doom_Enemy {
  import ƒ = FudgeCore;
  import ƒaid = FudgeAid;

  export enum ANGLE {
    // N = 0, NE = 1, E = 2, SE = 3, S = 4, SW = 5, W = 6, NW = 7,
    _000 = 0, _045 = 1, _090 = 2, _135 = 3, _180 = 4, _225 = 5, _270 = 6, _315 = 7
  }

  export enum JOB {
    IDLE, PATROL
  }


  export class Enemy extends ƒ.Node {
    private static animations: ƒAid.SpriteSheetAnimations;
    public speed: number = 3;
    private show: ƒ.Node;
    private sprite: ƒaid.NodeSprite;
    private posTarget: ƒ.Vector3;
    private angleView: number = 0;
    private job: JOB = JOB.PATROL;
    // private static speedMax: number = 1; // units per second
    // public direction: number = 0; 

    constructor(_name: string = "Enemy", _position: ƒ.Vector3) {
      super(_name);
      this.addComponent(new ƒ.ComponentTransform());
      this.mtxLocal.translation = _position;

      this.show = new ƒaid.Node("Show", ƒ.Matrix4x4.IDENTITY());
      this.appendChild(this.show);

      this.sprite = new ƒaid.NodeSprite("Sprite");
      this.sprite.addComponent(new ƒ.ComponentTransform());
      this.show.appendChild(this.sprite);


      this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle_000"]);
      // this.sprite.showFrame(0);
      this.sprite.setFrameDirection(1);
      this.sprite.framerate = 2;

      // this.posTarget = _position;
      this.chooseTargetPosition();

      // this.appendChild(new ƒaid.Node("Cube", ƒ.Matrix4x4.IDENTITY(), new ƒ.Material("Cube", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("red"))), new ƒ.MeshCube()));
    }


    public static generateSprites(_spritesheet: ƒ.CoatTextured): void {
      Enemy.animations = {};
      for (let angle: number = 0; angle < 5; angle++) {
        let name: string = "Idle" + ANGLE[angle];
        let sprite: ƒaid.SpriteSheetAnimation = new ƒaid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(ƒ.Rectangle.GET(44 + angle * 107, 33, 63, 66), 3, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.Y(100));
        Enemy.animations[name] = sprite;
      }
    }

    public update(): void {


      switch (this.job) {
        case JOB.PATROL:
          if (this.mtxLocal.translation.equals(this.posTarget, 0.1))
            // this.chooseTargetPosition();
            this.job = JOB.IDLE;
          this.move();
          break;
        case JOB.IDLE:
        default:
          break;
      }


      this.displayAnimation();
    }

    private move(): void {
      this.mtxLocal.showTo(this.posTarget);
      this.mtxLocal.translateZ(this.speed * ƒ.Loop.timeFrameGame / 1000);
    }

    private displayAnimation(): void {
      this.show.mtxLocal.showTo(ƒ.Vector3.TRANSFORMATION(avatar.mtxLocal.translation, this.mtxWorldInverse, true));

      let rotation: number = this.show.mtxLocal.rotation.y;
      rotation = (rotation + 360 + 22.5) % 360;
      rotation = Math.floor(rotation / 45);

      if (this.angleView == rotation)
        return;

      this.angleView = rotation;

      if (rotation > 4) {
        rotation = 8 - rotation;
        this.flip(true);
      }
      else
        this.flip(false);

      let section: string = ANGLE[rotation]; // .padStart(3, "0");
      console.log(section);
      this.sprite.setAnimation(<ƒAid.SpriteSheetAnimation>Enemy.animations["Idle" + section]);
    }

    private chooseTargetPosition(): void {
      let range: number = sizeWall * numWalls / 2 - 2;
      this.posTarget = new ƒ.Vector3(ƒ.Random.default.getRange(-range, range), 0, ƒ.Random.default.getRange(-range, range));
      console.log("New target", this.posTarget.toString());
    }

    private flip(_reverse: boolean): void {
      this.sprite.mtxLocal.rotation = ƒ.Vector3.Y(_reverse ? 180 : 0);
    }
  }
}