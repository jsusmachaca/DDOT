import { Request, Response } from 'express'
import Movie from '../Models/Movie'
import User, { IUser, Preferences } from '../Models/User'
import { validateToken } from '../Config/jwt'
import { movieValidation } from '../Validations/movieValidation'
import { cryptoNamed } from '../Config/uuidName'
import { uploadS3Images, getS3Images } from '../Config/s3'

export default class MovieController {
  static async getMovieForUser (req: Request, res: Response) {
    const authorization = req.headers.authorization
    let token: string

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')

      token = authorization.substring(7)
      const decodedToken = validateToken(token)

      if (decodedToken === null) throw new Error('invalid token')
        
      const user = await User.findById(decodedToken.user_id) as IUser
  
      if (!user) throw new Error('User not found')
  
      const preferences = user.preferences
  
      const videos = await Movie.find()

      const weightedVideos = await Promise.all(videos.map(async video => {
        video.url = await getS3Images(video.url)
        const preferenceScore = preferences[video.genre as keyof Preferences] || 0
        return {
          video,
          preferenceScore
        }
      }))
  
      weightedVideos.sort((a, b) => b.preferenceScore - a.preferenceScore)
  
      const sortedVideos = weightedVideos.map(item => item.video)
  
      return res.json(sortedVideos)
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message })
    }
  }

  static async insertMovie (req: Request, res: Response) {
    try {
      let file: Express.Multer.File

      if (req.file) {
        file = req.file
        req.body.url = cryptoNamed(file.originalname)
      } else {
        throw new Error('File is require')
      }
      
      req.body.duration = parseInt(req.body.duration)

      const results = movieValidation(req.body)

      if (results.error) 
        return res.status(400).json({ error: results.error.issues[0].message })
      
      let { data } = results
      data = {
        ...data,
        genre: data.genre.toLowerCase()
      }
      const newMovie = new Movie(data)
      await uploadS3Images(data.url, file.buffer)
      newMovie.save()
      return res.json({ success: true })
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message })
    }
  }
}