'use strict'

const Model = use('Model')

/**
 * Models a user from the old database
 * 
 * @class LegacyUser
 */
class LegacyUser extends Model {
  static get hidden () {
    return ['password']
  }
}

module.exports = LegacyUser
