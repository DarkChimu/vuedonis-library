'use strict'

const { route } = require('@adonisjs/framework/src/Route/Manager')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// GENERALES
Route.group(() => {
    Route.post('/register', 'UserController.register')
    Route.post('/login', 'UserController.login')
    Route.post('/forgot', 'UserController.resetPassword')
    Route.get('/me', 'UserController.me').middleware(['auth'])
}).prefix('api')


// USUARIOS
Route.group(() => {
    Route.get('/', 'UserController.index')
    Route.post('/', 'UserController.register')
    Route.get('/:id/myBooks', 'UserController.myBooks')
    Route.put('/:id', 'UserController.update')
    Route.delete('/:id', 'UserController.delete')
    Route.put('/:id/grantAdmin', 'UserController.grantAdmin')
    Route.post('/reports', 'UserController.createReport')
    Route.get('/:id/reports', 'UserController.reports')
}).prefix('api/users').middleware(['auth'])

// LIBROS
Route.group(() => {
    Route.get('/', 'BookController.index')
    Route.post('/', 'BookController.store').middleware('auth')
    Route.get('/:id', 'BookController.show')
    Route.put('/:id', 'BookController.update').middleware('auth')
    Route.delete('/:id', 'BookController.delete').middleware('auth')
}).prefix('api/books')


// Prestamos

Route.group(() => {
    Route.get('/', 'LoanController.index')
    Route.get('/', 'LoanController.show')
    Route.post('/', 'LoanController.store')
    Route.put('/:id', 'LoanController.update')
    Route.delete('/:id', 'LoanController.delete')
}).prefix('api/loans').middleware('auth')


