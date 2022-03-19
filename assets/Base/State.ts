import { Animation, animation, AnimationClip, resources, Sprite, SpriteFrame } from 'cc'
import { ResourceManager } from '../Runtime/ResourceManager'
import { sortSpriteFrame } from 'db://assets/Utils'
import StateMachine from 'db://assets/Base/StateMachine'

/***
 * unit:milisecond
 */
export const ANIMATION_SPEED = 1 / 8

/***
 * 状态（每组动画的承载容器，持有SpriteAnimation组件执行播放）
 */
export default class State {
  private animationClip: AnimationClip
  constructor(
    private fsm: StateMachine,
    private spriteFrameDir: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Loop,
  ) {
    this.init()
  }

  async init() {
    //生成动画轨道属性
    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    const waiting = ResourceManager.Instance.loadDir(this.spriteFrameDir, SpriteFrame)
    this.fsm.waitingList.push(waiting)
    const spriteFrames = await waiting
    sortSpriteFrame(spriteFrames)
    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [index * ANIMATION_SPEED, item])
    track.channel.curve.assignSorted(frames)

    //动画添加轨道
    this.animationClip = new AnimationClip()
    this.animationClip.name = this.spriteFrameDir
    this.animationClip.duration = frames.length * ANIMATION_SPEED
    this.animationClip.addTrack(track)
    this.animationClip.wrapMode = this.wrapMode
  }

  run() {
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}
