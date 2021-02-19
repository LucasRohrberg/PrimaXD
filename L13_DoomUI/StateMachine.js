"use strict";
var L13_UI;
(function (L13_UI) {
    var ƒaid = FudgeAid;
    class ComponentStateMachineEnemy extends ƒaid.ComponentStateMachine {
        constructor() {
            super();
            this.instructions = ComponentStateMachineEnemy.instructions;
        }
        static setupStateMachine() {
            let setup = new ƒaid.StateMachineInstructions();
            setup.setAction(L13_UI.JOB.PATROL, (_machine) => {
                let container = _machine.getContainer();
                // console.log(container);
                if (container.mtxLocal.translation.equals(container.posTarget, 0.1))
                    _machine.transit(L13_UI.JOB.IDLE);
                container.move();
            });
            setup.setTransition(L13_UI.JOB.PATROL, L13_UI.JOB.IDLE, (_machine) => {
                let container = _machine.getContainer();
                ƒ.Time.game.setTimer(3000, 1, (_event) => {
                    container.chooseTargetPosition();
                    _machine.transit(L13_UI.JOB.PATROL);
                });
            });
            return setup;
        }
    }
    ComponentStateMachineEnemy.instructions = ComponentStateMachineEnemy.setupStateMachine();
    L13_UI.ComponentStateMachineEnemy = ComponentStateMachineEnemy;
})(L13_UI || (L13_UI = {}));
//# sourceMappingURL=StateMachine.js.map