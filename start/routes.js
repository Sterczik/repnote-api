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

// App Frontend
Route.group(() => {
  // Users
  Route.post('users/register', 'UserController.register')
  Route.post('users/login', 'UserController.login')
  Route.post('users/authenticated/:provider', 'UserController.socialLoginCallback')
  Route.post('users/refreshToken', 'UserController.refreshToken')
  Route.put('users/change-password', 'UserController.changePassword')
  Route.get('users/:name', 'AccountController.getUserProfile')

  // Trainings
  Route.get('trainings', 'TrainingController.getAll')
  Route.get('trainings/:id', 'TrainingController.getOne')

  // Training Categories
  Route.get('trainingCategories', 'TrainingCategoryController.getTrainingCategories')

  // Exercise Categories
  Route.get('exerciseCategories', 'ExerciseCategoryController.getExerciseCategories')

  // Training Advancement Levels
  Route.get('trainingAdvancementLevels', 'TrainingAdvancementLevelController.getAdvancementLevels')

  // Contact
  Route.post('contactMessages', 'ContactController.sendMessage')
}).prefix('api/app')

// App Frontend with auth
Route.group(() => {
  // Users
  Route.get('users/profile/user', 'AccountController.getProfile')
  Route.put('users/profile', 'AccountController.editProfile')
  Route.post('users/profile/avatar', 'AccountController.changeAvatar')
  Route.put('users/profile/avatar/reset', 'AccountController.resetAvatar')
  Route.post('users/logout', 'UserController.logout')
  Route.post('users/:id/follow', 'AccountController.follow')
  Route.delete('users/:id/follow', 'AccountController.unfollow')

  // Trainings
  Route.post('trainings', 'TrainingController.create')
  Route.put('trainings/:id', 'TrainingController.update')
  Route.put('trainings/:id/status', 'TrainingController.switchStatus')
  Route.delete('trainings/:id', 'TrainingController.remove')
  Route.post('trainings/:id/like', 'TrainingLikeController.create')
  Route.delete('trainings/:id/like', 'TrainingLikeController.remove')
}).prefix('api/app').middleware('auth:user')

// Admin Frontend
Route.group(() => {
  Route.post('admins/login', 'Admin/AdminController.login')
  Route.post('admins/refreshToken', 'Admin/AdminController.refreshToken')
}).prefix('api/admin')

// Admin Frontend with auth
Route.group(() => {
  Route.post('admins/logout', 'Admin/AdminController.logout')

  Route.get('users', 'Admin/UserController.getUsers')
  Route.get('users/:id', 'Admin/UserController.getUser')
  Route.delete('users/:id', 'Admin/UserController.removeUser')

  Route.get('trainings', 'Admin/TrainingController.getTrainings')
  Route.get('trainings/:id', 'Admin/TrainingController.getTraining')
  Route.delete('trainings/:id', 'Admin/TrainingController.remove')

  Route.get('trainingCategories', 'Admin/TrainingCategoryController.getTrainingCategories')
  Route.get('trainingCategories/:id', 'Admin/TrainingCategoryController.getTrainingCategory')
  Route.post('trainingCategories', 'Admin/TrainingCategoryController.addTrainingCategory')
  Route.put('trainingCategories/:id', 'Admin/TrainingCategoryController.editTrainingCategory')
  Route.delete('trainingCategories/:id', 'Admin/TrainingCategoryController.removeTrainingCategory')

  Route.get('exerciseCategories', 'Admin/ExerciseCategoryController.getExerciseCategories')
  Route.get('exerciseCategories/:id', 'Admin/ExerciseCategoryController.getExerciseCategory')
  Route.post('exerciseCategories', 'Admin/ExerciseCategoryController.addExerciseCategory')
  Route.put('exerciseCategories/:id', 'Admin/ExerciseCategoryController.editExerciseCategory')
  Route.delete('exerciseCategories/:id', 'Admin/ExerciseCategoryController.removeExerciseCategory')

  Route.get('contactMessages', 'Admin/ContactController.getMessages')
  Route.get('contactMessages/:id', 'Admin/ContactController.getMessage')
  Route.delete('contactMessages/:id', 'Admin/ContactController.removeMessage')

  Route.get('tokens', 'Admin/TokenController.getTokens')
  Route.delete('tokens/:id', 'Admin/TokenController.removeToken')
}).prefix('api/admin').middleware('auth:admin')
