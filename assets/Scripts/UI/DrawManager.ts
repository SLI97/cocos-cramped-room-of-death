import { BlockInputEvents, Color, Component, game, Graphics, UITransform, view, _decorator } from 'cc'
const { ccclass } = _decorator
const SCREEN_WIDTH = view.getVisibleSize().width
const SCREEN_HEIGHT = view.getVisibleSize().height

export const DEFAULT_FADE_DURATION = 200

enum FadeStatus {
  IDLE,
  FADE_IN,
  FADE_OUT,
}

@ccclass('DrawManager')
export class DrawManager extends Component {
  oldTime: number = 0
  duration: number = DEFAULT_FADE_DURATION
  fadeStatus: FadeStatus = FadeStatus.IDLE
  fadeResolve: (value: PromiseLike<null>) => void
  faderNode: Node
  ctx: Graphics
  block: BlockInputEvents

  init() {
    this.block = this.addComponent(BlockInputEvents)
    this.ctx = this.addComponent(Graphics)
    const transform = this.getComponent(UITransform)
    transform.setAnchorPoint(0.5, 0.5)
    transform.setContentSize(SCREEN_WIDTH, SCREEN_HEIGHT)
    this.setAlpha(1)
  }

  private setAlpha(percent: number) {
    this.ctx.clear()
    this.ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    this.ctx.fillColor = new Color(0, 0, 0, 255 * percent)
    this.ctx.fill()
    this.block.enabled = percent === 1
  }

  update() {
    const fadePercent = (game.totalTime - this.oldTime) / this.duration
    switch (this.fadeStatus) {
      case FadeStatus.FADE_IN:
        if (fadePercent < 1) {
          this.setAlpha(fadePercent)
        } else {
          this.fadeStatus = FadeStatus.IDLE
          this.setAlpha(1)
          this.fadeResolve(null)
        }
        break
      case FadeStatus.FADE_OUT:
        if (fadePercent < 1) {
          this.setAlpha(1 - fadePercent)
        } else {
          this.fadeStatus = FadeStatus.IDLE
          this.setAlpha(0)
          this.fadeResolve(null)
        }
        break
      default:
        break
    }
  }

  fadeIn(duration: number = DEFAULT_FADE_DURATION) {
    this.setAlpha(0)
    this.duration = duration
    this.fadeStatus = FadeStatus.FADE_IN
    this.oldTime = game.totalTime
    return new Promise(resolve => {
      this.fadeResolve = resolve
    })
  }

  fadeOut(duration: number = DEFAULT_FADE_DURATION) {
    this.setAlpha(1)
    this.duration = duration
    this.fadeStatus = FadeStatus.FADE_OUT
    this.oldTime = game.totalTime
    return new Promise(resolve => {
      this.fadeResolve = resolve
    })
  }

  mask() {
    this.setAlpha(1)
    return new Promise(resolve => {
      setTimeout(resolve, DEFAULT_FADE_DURATION)
    })
  }
}
