import level1 from './level1';
import level2 from './level2';
import level3 from './level3';
import level4 from './level4';
import level5 from './level5';
import level6 from './level6';
import level7 from './level7';
import level8 from './level8';
import level9 from './level9';
import level10 from './level10';
import level11 from './level11';
import level12 from './level12';
import level13 from './level13';
import level14 from './level14';
import level15 from './level15';
import level16 from './level16';
import level17 from './level17';
import level18 from './level18';
import level19 from './level19';
import level20 from './level20';
import level21 from './level21';
import { DIRECTION_ENUM, ENTITY_TYPE_ENUM, ENTITY_STATE_ENUM, TILE_TYPE_ENUM } from '../Enum';

export interface ITile {
  src: number | null;
  type: TILE_TYPE_ENUM | null;
}

export interface ILevel {
  mapInfo: Array<Array<ITile>>;
  player: IEntity;
  enemies: Array<IEntity>;
  spikes: Array<ISpikes>;
  bursts: Array<IEntity>;
  door: IEntity;
}

export interface IEntity {
  x: number;
  y: number;
  direction: DIRECTION_ENUM;
  state: ENTITY_STATE_ENUM;
  type: ENTITY_TYPE_ENUM;
}

export interface ISpikes {
  x: number;
  y: number;
  type: ENTITY_TYPE_ENUM;
  count: number;
}

const levels: Record<string, ILevel> = {
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  level12,
  level13,
  level14,
  level15,
  level16,
  level17,
  level18,
  level19,
  level20,
  level21,
};

export default levels;
