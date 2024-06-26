import { Request, Response } from 'express'
import { generateToken, validateToken } from '../Config/jwt'
import bcrypt from 'bcrypt'
import User from '../Models/User'
import Movie from '../Models/Movie'
import { Preferences, IUser } from '../Models/User'
import { userValidation, userValidationPartial, videoValidation } from '../Validations/userValidation'

const saltRounds = 10

export default class UserController {
  static async insertUser (req: Request, res: Response) {
    try {
      const results = userValidation(req.body)

      if (results.error) 
        return res.status(400).json({ error: results.error.issues[0].message })
  
      const data = results.data
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash(data.password, salt)

      const newUser = new User({
        username: data.username,
        password: hash
      })
      newUser.save()

      return res.json({ success: true })
    } catch (error) {
      return res.status(400).json({ succsess: false, error: 'Error to insert user' })
    }
  }
  
  static async findUser (req: Request, res: Response) {
    try {
      const results = userValidationPartial(req.body)

      if (results.error) 
        return res.status(400).json({ error: results.error.issues[0].message })
      
      const data = results.data
      
      const user = await User.findOne({
        username: data.username!
      })

      const comparePassword = await bcrypt.compare(data.password!, user!.password)

      if (comparePassword) {
        return res.json({ 
          success: true, 
          sesion_data: {
            access_token: generateToken({ username: user!.username, user_id: user!.id })
          } 
        })
      }
      throw new Error('username or password don\'t match')
    } catch (error) {
      return res.json({ success: false, error: (error as Error).message })
    }
  }

  static async updatePrefers (req: Request, res: Response) {
    const authorization = req.headers.authorization
    let token: string

    try {
      if (!authorization || !authorization.startsWith('Bearer')) throw new Error('token not provided')
        
      token = authorization.substring(7)
      const decodedToken = validateToken(token)

      if (decodedToken === null) throw new Error('invalid token')
        
      const results = videoValidation(req.body)
        
      if (results.error) 
        return res.status(400).json({ error: results.error.issues[0].message })
      
      const { video_id, watch_time } = results.data

      const user = await User.findById(decodedToken.user_id) as IUser
      const video = await Movie.findById(video_id)

      if (!user || !video) throw new Error('User or video not found')

      const genre = video.genre as keyof Preferences
      const threshold = 10

      if (user.preferences && genre in user.preferences) {
        if (watch_time >= threshold) {
          user.preferences[genre] += 1
        } else {
          user.preferences[genre] -= 1
        }
      } else {
        throw new Error('Invalid genre or preferences not found')
      }
      await user.save()
      return res.json({ message: 'Preferences updated' })
    } catch (error) {
      return res.status(500).json({ success: false, message: (error as Error).message })
    }
  }
}