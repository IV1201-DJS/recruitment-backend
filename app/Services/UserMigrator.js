'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const Availability = use('App/Models/Availability')
const LegacyDatabaseHandler = use('App/Services/LegacyDatabaseHandler')
const Hash = use('Hash')

/**
 * Service for migrating old users to the new database
 *
 * @class UserMigrator
 */
class UserMigrator {
  /**
   * Creates an instance of UserMigrator.
   * @memberof UserMigrator
   */
  constructor (legacyDB = new LegacyDatabaseHandler(), newDB = use('Database')) {
    this.legacyDB = legacyDB
    this.newDB = newDB
  }

  /**
   * Determines if a legacy user has a complete profile
   *
   * @param {Object} legacyData
   * @returns {boolean}
   * @memberof UserMigrator
   */
  async isCompleteUser(legacyData) {
    const validation = await validate(legacyData, {
      name: 'required',
      surname: 'required',
      ssn: 'required',
      email: 'required',
      role_id: 'required',
      username: 'required'
    })

    return !validation.fails()
  }

  /**
   * Migrates a complete user, with competences
   * and availabilities to the new database
   *
   * @param {Object} legacyData {name, surname, ssn, email, password, role_id, username}
   * @memberof UserMigrator
   */
  async migrate (legacyData) {
    await this.newDB.transaction(async trx => {
      const user = await this.migrateUser(trx, legacyData)
      await this.migrateCompetences(trx, user, legacyData)
      await this.migrateAvailabilities(trx, user, legacyData)
    })
  }

  /**
   * Migrates a complete user to the new database
   *
   * @param {Transaction} trx
   * @param {Object} legacyData {name, surname, ssn, email, password, role_id, username}
   * @returns {User}
   * @memberof UserMigrator
   */
  async migrateUser (trx, legacyData) {
    const userMapping = {
      firstname: legacyData.name,
      lastname: legacyData.surname,
      ssn: legacyData.ssn,
      email: legacyData.email,
      password: await Hash.make(legacyData.password),
      role_id: legacyData.role_id,
      username: legacyData.username,
      created_at: new Date().toLocaleString('sv-SE'),
      updated_at: new Date().toLocaleString('sv-SE')
    }
    const [ id ] = await trx.insert(userMapping).into('users').returning('id')
    return await trx.table('users').where({ id }).first()
  }

  /**
   * Migrates the availabilites of a legacy user to the new database
   *
   * @param {Transaction} trx
   * @param {User} user
   * @param {Object} legacyData { person_id }
   * @memberof UserMigrator
   */
  async migrateAvailabilities (trx, user, legacyData) {
    const availabilities = await this.legacyDB.getAvailabilities(legacyData.person_id)
    for (let a of availabilities) {
      const availabilityMapping = {
        user_id: user.id,
        from: a.from_date.toLocaleString('sv-SE'),
        to: a.to_date.toLocaleString('sv-SE')
      }
      await trx.insert(availabilityMapping).into('availabilities')
    }
  }

  /**
   * Migrates the competences of a legacy user to the new database
   *
   * @param {Transaction} trx
   * @param {User} user
   * @param {Object} legacyData
   * @memberof UserMigrator
   */
  async migrateCompetences (trx, user, legacyData) {
    const competenceProfiles = await this.legacyDB.getCompetenceProfiles(legacyData.person_id)
    for (let p of competenceProfiles) {
      const pivotMapping = {
        user_id: user.id,
        competence_id: p.competence_id,
        experience_years: p.years_of_experience
      }
      await trx.insert(pivotMapping).into('competence_user')
    }
  }
}

module.exports = UserMigrator