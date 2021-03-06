'use strict'

const Env = use('Env')

class AuthJwt {
  /**
   * Intercepts a request and authenticates the user
   *
   * @param {Object} { request, auth }
   * @param {function} next
   * @memberof AuthJwt
   */
  async handle ({ request, auth }, next) {
    await auth.check()
    await next()
  }
}

module.exports = AuthJwt
