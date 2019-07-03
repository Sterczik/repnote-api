'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.any('*', ({ view }) => view.render('main'))
Route.group(() => {
  Route.post('users/register', 'UserController.register')
  Route.post('users/login', 'UserController.login')
  Route.post('users/authenticated/:provider', 'UserController.socialLoginCallback')

  Route.get('trainingCategories', 'TrainingCategoryController.getTrainingCategories')
  Route.get('exerciseCategories', 'ExerciseCategoryController.getExerciseCategories')
}).prefix('api/app')

Route.group(() => {
  Route.get('users/profile/my', 'AccountController.getMyProfile')
  Route.get('users/profile/:name', 'AccountController.getProfile')
  Route.get('users/profile/:name/trainings', 'AccountController.getUserTrainings')
}).prefix('api/app').middleware(['auth'])

Route.group(() => {
  Route.get('trainings/my', 'TrainingController.getMyTrainings')
  Route.post('trainings', 'TrainingController.create')
  Route.put('trainings/:id/status', 'TrainingController.switchStatus')
  Route.delete('trainings/:id', 'TrainingController.remove')
}).prefix('api/app').middleware(['auth'])

Route.group(() => {
  Route.get('trainings', 'TrainingController.getAll')
  Route.get('trainings/:id', 'TrainingController.getOne')
}).prefix('api/app')

Route.group(() => {
  Route.get('users', 'Admin/UserController.getUsers')
  Route.get('users/:id', 'Admin/UserController.getUser')

  Route.get('trainings', 'Admin/TrainingController.getTrainings')
  Route.get('trainings/:id', 'Admin/TrainingController.getTraining')

  Route.get('trainingCategories', 'Admin/TrainingCategoryController.getTrainingCategories')
  Route.get('trainingCategories/:id', 'Admin/TrainingCategoryController.getTrainingCategory')
  Route.post('trainingCategories', 'Admin/TrainingCategoryController.addTrainingCategory')
  Route.delete('trainingCategories/:id', 'Admin/TrainingCategoryController.removeTrainingCategory')

  Route.get('exerciseCategories', 'Admin/ExerciseCategoryController.getExerciseCategories')
  Route.get('exerciseCategories/:id', 'Admin/ExerciseCategoryController.getExerciseCategory')
  Route.post('exerciseCategories', 'Admin/ExerciseCategoryController.addExerciseCategory')
  Route.delete('exerciseCategories/:id', 'Admin/ExerciseCategoryController.removeExerciseCategory')
}).prefix('api/admin')
