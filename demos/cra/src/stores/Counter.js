const DEFAULT_STATE = {
  count: 0,
}

export default class Counter {

  state = DEFAULT_STATE

  persist = true

  increment = () => {
    this.setState(({ count }) => ({ count: ++count }))
  }

  decrement = () => {
    this.setState(({ count }) => ({ count: --count }))
  }

}