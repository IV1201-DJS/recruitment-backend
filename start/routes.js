'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')
const Language = use('App/Models/Language')
const GraphqlAdonis = use('ApolloServer')
const schema = use('App/Data/GraphQL/schema')
const User = use('App/Models/User')


Route.get('/', ({ request }) => {
  return { greeting: 'Hello world in JSON' }
})


/**
 * Authenticate the user
 *
 * @returns A token used to authenticate the user via graphql
 */
Route.post('/api/login', 'UserController.login')


/**
 * Create a new user
 *
 * @returns A User object
 */
Route.post('/api/register', 'UserController.store')


/**
 * Migrate an old user
 *
 * @returns A User object
 */
Route.post('/api/migrate', 'UserController.migrate')


/**
 * Restore the password of an old user
 *
 * @returns A User object
 */
Route.post('/api/restore-password', 'UserController.restorePassword')



Route.get('/loaderio-a9b251eb435d5b91436946be86917042/', async () => {
  return 'loaderio-a9b251eb435d5b91436946be86917042'
})


/**
 * Bind jwt-protected graphql endpoint
 *
 * @returns Requested JSON-data
 */
Route.route('/graphql', async ({ request, auth, response }) => {
  const headerLanguage = request.header('language') || 'en'
  const language = await new Language().setOrDefault(headerLanguage)
  return GraphqlAdonis.graphql({
    schema,
    context: {
      auth,
      language
    }
  }, request, response)
}, ['GET', 'POST'])
.middleware(['auth-jwt'])


  /**
 * Bind graphiql endpoint
 *
 * @returns Requested JSON-data
 */
Route.get('/graphiql', ({ request, response }) => {
  return GraphqlAdonis.graphiql({ endpointURL: '/graphql' }, request, response)
})
