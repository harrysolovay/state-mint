export default (strategy, options={ days: 14 }) => ({

  set: (key, data, callback) => {
    console.log(options)
    const stringified = JSON.stringify(data)
    const { days } = options
    if (days) {
      const currentDate = new Date()
      const expirationTime = currentDate.getTime() + (days * 24 * 60 * 60 * 1000)
      const expirationDate = new Date(expirationTime)
      var expiration = `; expires=${ expirationDate.toUTCString() }`
    }
    document.cookie = `${ key }=${ stringified }${ expiration }; path=/`
    if (callback) callback()
  },

  get: (key, callback) => {
    const cookies = document.cookie
      ? document.cookie.split('; ')
      : []
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split('=')
      if (parts[0] === key) {
        callback(
          JSON.parse(parts[1])
        )
      }
    }
  },

  remove: (key) => {
    document.cookie = `${ key }=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  },

})