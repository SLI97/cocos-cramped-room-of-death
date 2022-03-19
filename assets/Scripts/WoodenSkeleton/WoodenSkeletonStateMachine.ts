import { _decorator, Animation } from 'cc'
import StateMachine, { getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine'
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../../Enum'
import IdleSubStateMachine from './IdleSubStateMachine'
import AttackSubStateMachine from 'db://assets/Scripts/WoodenSkeleton/AttackSubStateMachine'
import DeathSubStateMachine from 'db://assets/Scripts/WoodenSkeleton/DeathSubStateMachine'
import { EntityManager } from 'db://assets/Base/EntityManager'
const { ccclass, property } = _decorator

@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.node.addComponent(Animation)

    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, e => {
      this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
    })
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
  }

  /***
   * 根据当前所在状态（currentState）和参数（params）决定怎么切换状态机
   */
  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
        if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        break
    }
  }
}
