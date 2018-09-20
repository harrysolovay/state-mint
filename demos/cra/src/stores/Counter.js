const DEFAULT_STATE = {
  count: 0,
}

export default class Counter {

  state = DEFAULT_STATE

  persist = { strategy: window.sessionStorage }

  increment = () => {
    this.setState(({ count }) => ({ count: ++count }))
  }

  decrement = () => {
    this.setState(({ count }) => ({ count: --count }))
  }

}