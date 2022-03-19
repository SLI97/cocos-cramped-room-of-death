import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import StateMachine from '../../Base/StateMachine'
import { DIRECTION_ENUM } from '../../Enum'
import State from '../../Base/State'

const BASE_URL = 'texture/player/blockturnleft'

export default class BlockTurnLeftSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm.animationComponent, `${BASE_URL}/top/blockturnleft`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm.animationComponent, `${BASE_URL}/bottom/blockturnleft`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm.animationComponent, `${BASE_URL}/left/blockturnleft`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm.animationComponent, `${BASE_URL}/right/blockturnleft`))
  }
}
