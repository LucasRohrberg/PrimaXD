namespace Endabgabe {
    import f = FudgeCore;
    import faid = FudgeAid;

    export class GameObject extends f.Node {
        rect: f.Rectangle;

        constructor(_name: string, _position: f.Vector2, _size: f.Vector2) {
            super(_name);
            this.rect = new f.Rectangle(_position.x, _position.y, _size.x, _size.y);
        }

        public checkCollision(_target: GameObject): boolean {
            let intersection: f.Rectangle = this.rect.getIntersection(_target.rect);
            if (intersection != null) {
                return true;
            }
            return false;
        }
    }
}