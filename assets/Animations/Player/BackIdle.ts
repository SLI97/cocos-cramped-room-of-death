import { _decorator, animation } from 'cc';
import { PlayerManager } from '../../Scripts/PlayerManager';
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../Enum';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayerBackIdle
 * DateTime = Wed Mar 16 2022 20:56:15 GMT+0800 (中国标准时间)
 * Author = sli97
 * FileBasename = PlayerBackIdle.ts
 * FileBasenameNoExtension = PlayerBackIdle
 * URL = db://assets/Animations/Player/PlayerBackIdle.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('BackIdle')
export class BackIdle extends animation.StateMachineComponent {
  // /**
  //  * Called when a motion state right after it entered.
  //  * @param controller The animation controller it within.
  //  * @param motionStateStatus The status of the motion.
  //  */
  public onMotionStateEnter(
    controller: animation.AnimationController,
    motionStateStatus: Readonly<animation.MotionStateStatus>,
  ): void {
    for (const [key, value] of controller.getVariables()) {
      if (value.type === animation.VariableType.TRIGGER && key !== PARAMS_NAME_ENUM.IDLE.toLowerCase()) {
        controller.setValue(key, false);
      }
    }
  }
  /**
  //  * Called when a motion state is going to be exited.
  //  * @param controller The animation controller it within.
  //  * @param motionStateStatus The status of the motion.
  //  */
  public onMotionStateExit(
    controller: animation.AnimationController,
    motionStateStatus: Readonly<animation.MotionStateStatus>,
  ): void {
    controller.node.getComponent(PlayerManager).state = ENTITY_STATE_ENUM.IDLE;
  }
  // /**
  //  * Called when a motion state updated except for the first and last frame.
  //  * @param controller The animation controller it within.
  //  * @param motionStateStatus The status of the motion.
  //  */
  // public onMotionStateUpdate(
  //   controller: animation.AnimationController,
  //   motionStateStatus: Readonly<animation.MotionStateStatus>,
  // ): void {
  // }
  // /**
  //  * Called when a state machine right after it entered.
  //  * @param controller The animation controller it within.
  //  */
  // public onStateMachineEnter (controller: animation.AnimationController) {
  //     // Can be overrode
  // }
  // /**
  //  * Called when a state machine right after it entered.
  //  * @param controller The animation controller it within.
  //  */
  // public onStateMachineExit(controller: animation.AnimationController) {
  //   // Can be overrode
  // }
}
