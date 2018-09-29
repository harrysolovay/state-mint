!config &&
  error(MISSING_CONFIG)

typeof config !== 'object' &&
  error(INVALID_CONFIG)

args.length > 0 &&
  error(TOO_MANY_ARGS)

Object.keys(config).length < 1 &&
  error(MISSING_CONFIG_VALUES)

stores[key] &&
  error(
    STORE_KEY_ALREADY_EXISTS,
    key,
  )

!WrapTarget &&
  error(MISSING_WRAP_TARGET)

!isComponent(WrapTarget) &&
  error(INVALID_WRAP_TARGET)

!keys &&
  error(MISSING_KEYS)

!Array.isArray(keys) &&
  error(INVALID_KEYS)

for (let key of keys) {
  !Object
    .keys(stores)
    .includes(key) &&
      error(NONEXISTENT_KEY, key)
}

args.length > 0 &&
  error(TOO_MANY_ARGS)

const { $ } = props
$ &&
  error(OVERRIDING_STORES)

typeof Store !== 'function' &&
  error(INVALID_CONFIG_VALUE, key)