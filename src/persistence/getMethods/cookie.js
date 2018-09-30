export default (strategy, options={ days: 14 }) => ({

  set: (key, data, callback) => {
    const stringified = JSON.stringify(data)
    const { days } = options
    let expiration
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

  get: (key, callback) => {
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

  remove: (key, callback) => {
    document.cookie = `${ key }=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    callback && callback()
  },

})