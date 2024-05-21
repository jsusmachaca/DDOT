import { Router } from 'express'
import MovieController from '../Controllers/MovieController'

export const movie = Router()

movie.get('/', MovieController.getMovieForUser)
movie.post('/insert-movie', MovieController.insertMovie)
