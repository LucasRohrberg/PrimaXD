"use strict";
var Endabgabe;
(function (Endabgabe) {
    var f = FudgeCore;
    class GameObject extends f.Node {
        constructor(_name, _position, _size) {
            super(_name);
            this.rect = new f.Rectangle(_position.x, _position.y, _size.x, _size.y);
        }
        checkCollision(_target) {
            let intersection = this.rect.getIntersection(_target.rect);
            if (intersection != null) {
                return true;
            }
            return false;
        }
    }
    Endabgabe.GameObject = GameObject;
})(Endabgabe || (Endabgabe = {}));
//# sourceMappingURL=GameObject.js.map