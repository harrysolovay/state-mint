// @flow

import type { Node } from 'react'

type SFC<Props> =
  (props: Props) => Node

type instantiateArgs = {|
  [string]: (): {
    prototype: any,
  } => {},
|}

type wrapArgs = [
  SFC<{}>,
  Array<string>,
  ?storesType,
]

type cType =
  | instantiateArgs
  | wrapArgs