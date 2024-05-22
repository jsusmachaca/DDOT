import { Router } from 'express'
import MovieController from '../Controllers/MovieController'
import { multerMiddleware } from '../Middlewares/multer'

export const movie = Router()

movie.get('/', MovieController.getMovieForUser)
movie.post('/insert-movie', multerMiddleware() , MovieController.insertMovie)
