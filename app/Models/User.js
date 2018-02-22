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

  applications() {
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

  async hasPendingApplication() {
    const pending = await this.applications().whereHas('status', builder => {
      builder
        .where('name', 'PENDING')
    }).count()
    return pending[0].count != 0
  }

  static get hidden () {
    return ['password']
  }

  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.hashPassword')
    this.addHook('beforeCreate', (user) => user.role_id = 1 )
  }
}

module.exports = User
