'use strict'

const Model = use('Model')

class User extends Model {
  /**
   * Retrieves the user's availabilities
   *
   * @returns {Collection}
   * @memberof User
   */
  availabilities () {
    return this.hasMany('App/Models/Availability')
  }

  /**
   * Retrieves the user's competences
   *
   * @returns {Collection}
   * @memberof User
   */
  competences () {
    return this
      .belongsToMany('App/Models/Competence')
      .withPivot(['experience_years'])
  }

  applications () {
    return this.hasMany('App/Models/Application')
  }

  /**
   * Retrieves the user's role
   *
   * @returns {Role}
   * @memberof User
   */
  role () {
    return this.belongsTo('App/Models/Role')
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @returns {Object}
   * @memberof User
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  async hasPendingApplication (trx) {
    const pending = await this.applications()
    .transacting(trx)
    .forShare()
    .doesntHave('status')
    .fetch()

    return pending.toJSON().length != 0
  }

  static get hidden () {
    return ['password']
  }

  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.hashPassword')
    this.addHook('beforeCreate', async (userInstance) => {
      userInstance.role_id = userInstance.role_id || 2
    })
  }
}

module.exports = User
