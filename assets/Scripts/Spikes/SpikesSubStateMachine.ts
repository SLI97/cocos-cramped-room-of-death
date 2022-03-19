import SubStateMachine from '../../Base/SubStateMachine'
import { PARAMS_NAME_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from '../../Enum'

export default abstract class SpikesSubStateMachine extends SubStateMachine {
  run() {
    const { value: newCount } = this.fsm.params.get(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT)
    this.currentState = this.stateMachines.get(SPIKES_COUNT_MAP_NUMBER_ENUM[newCount as number])
  }
}
