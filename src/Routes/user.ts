import { Router } from 'express'
import UserController from '../Controllers/UserController'

export const user = Router()

// user.get('/', UserController.insertUser)
user.post('/register', UserController.insertUser)
user.post('/login', UserController.findUser)
user.post('/prefers', UserController.updatePrefers)
