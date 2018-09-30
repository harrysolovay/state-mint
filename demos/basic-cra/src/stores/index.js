import mint from 'state-mint'

import Account from './Account'
import Counter from './Counter'
import Hello from './Hello'

mint({
  account: Account,
  counter: Counter,
  hello: Hello,
})