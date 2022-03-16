import { _decorator, Component, Node, Sprite, resources, SpriteFrame, UITransform } from 'cc';
import { TILE_TYPE_ENUM } from '../Enum';
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 50;
export const TILE_HEIGHT = 50;

@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM;
  moveable: boolean;
  turnable: boolean;

  init(type: TILE_TYPE_ENUM, imgSrc: string, i: number, j: number) {
    const sprite = this.node.addComponent(Sprite);
    const transform = this.getComponent(UITransform);
    resources.load(`texture/bg/${imgSrc}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
      if (err) {
        console.error(err);
        return;
      }
      sprite.spriteFrame = spriteFrame;
      transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);
      this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
    });

    this.type = type;
    if (
      this.type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
      this.type === TILE_TYPE_ENUM.WALL_ROW ||
      this.type === TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
      this.type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
      this.type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM ||
      this.type === TILE_TYPE_ENUM.WALL_COLUMN
    ) {
      this.moveable = false;
      this.turnable = false;
    } else if (
      this.type === TILE_TYPE_ENUM.CLIFF_LEFT ||
      this.type === TILE_TYPE_ENUM.CLIFF_CENTER ||
      this.type === TILE_TYPE_ENUM.CLIFF_RIGHT
    ) {
      this.moveable = false;
      this.turnable = true;
    } else if (this.type === TILE_TYPE_ENUM.FLOOR) {
      this.moveable = true;
      this.turnable = true;
    }
  }
}