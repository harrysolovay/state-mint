import mint from 'state-mint'

import Account from './Account'
import Counter from './Counter'
import Hello from './Hello'

mint({
  account: Account,
  counter: Counter,
})

setTimeout(() => {
  mint({ hello: Hello })
}, 1000)