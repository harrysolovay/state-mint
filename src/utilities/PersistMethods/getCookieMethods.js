// @flow

type cookieType = typeof document.cookie
type optionsType = {|
  days?: number,
|}

export default (strategy: cookieType, options: optionsType={ days: 14 }) => ({

  set: (key: string, data: any, callback?: () => void): void => {
    const stringified = JSON.stringify(data)
    const { days } = options
    let expiration: string
    if (days) {
      const currentDate = new Date()
      const expirationTime = currentDate.getTime() + (days * 24 * 60 * 60 * 1000)
      const expirationString = new Date(expirationTime).toUTCString()
      expiration = `; expires=${ expirationString }`
    } else {
      expiration = ''
    }
    document.cookie = `${ key }=${ stringified }${ expiration }; path=/`
    callback && callback()
  },

  get: (key: string, callback?: (any) => void): void => {
    const cookies = document.cookie
      ? document.cookie.split('; ')
      : []
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split('=')
      if (parts[0] === key) {
        callback && callback(
          JSON.parse(parts[1])
        )
      }
    }
  },

  remove: (key: string, callback?: () => void): void => {
    document.cookie = `${ key }=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    callback && callback()
  },

})