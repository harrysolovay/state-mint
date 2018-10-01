const NAMES = [ 'mom', 'dad', 'sis', 'daniel', 'max' ]
const DEFAULT_STATE = {
  currentNameIndex: 0,
  currentName: NAMES[0]
}

export default class Counter {

  names = NAMES
  state = DEFAULT_STATE

  persistence = {
    strategy: document.cookie,
    options: {
      days: 1 / 24 / 60 / 60 * 10,
    },
  }

  next = () => {
    this.setState((lastState) => {
      const newState = { ...lastState }
      if (newState.currentNameIndex + 1 === this.names.length) {
        newState.currentNameIndex = 0
      } else {
        newState.currentNameIndex++
      }
      newState.currentName = this.names[newState.currentNameIndex]
      return newState
    })
  }

}