import { Animation, animation, AnimationClip, resources, Sprite, SpriteAtlas, SpriteFrame } from 'cc'
import { ResourceManager } from '../Runtime/ResourceManager'
import { sortSpriteFrame } from '../Utils'
import StateMachine from './StateMachine'

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
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
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
    const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item, index) => [
      index * ANIMATION_SPEED,
      item,
    ])
    track.channel.curve.assignSorted(frames)

    //动画添加轨道
    this.animationClip = new AnimationClip()
    this.animationClip.name = this.spriteFrameDir
    this.animationClip.duration = frames.length * ANIMATION_SPEED
    this.animationClip.addTrack(track)
    this.animationClip.wrapMode = this.wrapMode
  }

  run() {
    const state = this.fsm.animationComponent.getState(this.animationClip.name)
    //当前动画正在播放
    if (state && state.isPlaying) {
      return
    }
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}
