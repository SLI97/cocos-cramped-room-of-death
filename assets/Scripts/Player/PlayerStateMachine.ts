import { _decorator, AnimationClip, animation, Sprite, SpriteFrame, resources, Animation } from 'cc'
import StateMachine, { getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine'
import { PARAMS_NAME_ENUM } from '../../Enum'
import IdleSubStateMachine from './IdleSubStateMachine'
const { ccclass, property } = _decorator

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
  // start() {
  //   const animationClip = new AnimationClip()
  //   const track = new animation.ObjectTrack()
  //   track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
  //   resources.load(`texture/bg/${`bg (${1})`}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
  //     if (err) {
  //       console.error(err)
  //       return
  //     }
  //     track.channel.curve.assignSorted([[0.1, spriteFrame]])
  //     // sprite.spriteFrame = spriteFrame
  //     // transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
  //     // this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
  //     animationClip.addTrack(track)
  //     const animationComponent = this.getComponent(Animation)
  //     console.log(animationClip.name)
  //     animationComponent.defaultClip = animationClip
  //     animationComponent.play()
  //   })
  // }

  init() {
    this.node.addComponent(Sprite)
    this.animationComponent = this.node.addComponent(Animation)

    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()
  }

  initAnimationEvent() {
    // spriteAnimation.on('complete', () => {
    //   if (!this.gameObject || !this.gameObject.getComponent(PlayerManager)) {
    //     return
    //   }
    //   const list = ['player_turn', 'player_block', 'player_attack']
    //   if (list.some(item => spriteAnimation.resource.startsWith(item))) {
    //     this.gameObject.getComponent(PlayerManager).state = ENTITY_STATE_ENUM.IDLE
    //   }
    // })
    //
    // spriteAnimation.on('frameChange', () => {
    //   //攻击动画第五帧的时候震动屏幕
    //   if (spriteAnimation.resource.startsWith('player_attack') && spriteAnimation.currentFrame === 4) {
    //     switch (spriteAnimation.resource) {
    //       case 'player_attack_top':
    //         EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.TOP)
    //         break
    //       case 'player_attack_bottom':
    //         EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.BOTTOM)
    //         break
    //       case 'player_attack_left':
    //         EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.LEFT)
    //         break
    //       case 'player_attack_right':
    //         EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, SHAKE_TYPE_ENUM.RIGHT)
    //         break
    //       default:
    //         break
    //     }
    //   }
    // })
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNRIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKBACK, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.AIRDEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    // this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
    // this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this, spriteAnimation))
    // this.stateMachines.set(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightSubStateMachine(this, spriteAnimation))
    // this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKFRONT, new BlockFrontSubStateMachine(this, spriteAnimation))
    // this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKBACK, new BlockBackSubStateMachine(this, spriteAnimation))
    // this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKLEFT, new BlockLeftSubStateMachine(this, spriteAnimation))
    // this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKRIGHT, new BlockRightSubStateMachine(this, spriteAnimation))
    // this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, new BlockTurnLeftSubStateMachine(this, spriteAnimation))
    // this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, new BlockTurnRightSubStateMachine(this, spriteAnimation))
    // this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this, spriteAnimation))
    // this.stateMachines.set(PARAMS_NAME_ENUM.AIRDEATH, new AirDeathSubStateMachine(this, spriteAnimation))
  }

  /***
   * 根据当前所在状态（currentState）和参数（params）决定怎么切换状态机
   */
  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH):
        if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        } else if (this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH)
        } else if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKBACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT)
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
