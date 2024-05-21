import jwt, { JwtPayload } from 'jsonwebtoken'

interface JwtCustomPayload extends JwtPayload {
  user_id: string,
  username: string
}

const SECRET_KEY = process.env.SECRET_KEY!

export const generateToken = (data: JwtCustomPayload) => jwt.sign(data, SECRET_KEY, { expiresIn: '1y' })

export const validateToken = (token: string) => {
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY) as JwtCustomPayload
    return decodedToken
  } catch (error) {
    return null
  }
}