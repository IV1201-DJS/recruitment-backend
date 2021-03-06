'use strict'

const Schema = use('Schema')

class CompetenceTranslationSchema extends Schema {
  up () {
    this.create('competence_translations', (table) => {
      table.increments()
      table.integer('competence_id').unsigned().references('id').inTable('competences').onDelete('CASCADE').notNullable()
      table.integer('language_id').unsigned().references('id').inTable('languages').onDelete('CASCADE').notNullable()
      table.string('translation').notNullable()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.dropTableIfExists('competence_translations')
  }
}

module.exports = CompetenceTranslationSchema
