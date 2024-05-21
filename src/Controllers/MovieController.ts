import { Request, Response } from "express"
import Movie from "../Models/Movie"
import User, { IUser, Preferences } from "../Models/User"
import { validateToken } from "../config/jwt"

interface Body {
  name: string,
  genre: string,
  url: string,
  duration: number
}

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
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' })
      }
  
      const preferences = user.preferences
  
      const videos = await Movie.find()

      const weightedVideos = videos.map(video => {
        const preferenceScore = preferences[video.genre as keyof Preferences] || 0
        return {
          video,
          preferenceScore
        }
      })

      console.log(weightedVideos)
  
      weightedVideos.sort((a, b) => b.preferenceScore - a.preferenceScore)
  
      const sortedVideos = weightedVideos.map(item => item.video)
  
      return res.json(sortedVideos)
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Server error' })
    }
  }

  static insertMovie (req: Request, res: Response) {
    let data: Body = req.body

    data = {
      ...data,
      genre: data.genre.toLowerCase()
    }

    const newMovie = new Movie(data)

    newMovie.save()
    return res.json({ success: true })
  }
}