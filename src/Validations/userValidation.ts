import z from 'zod'

interface userData {
  username: string,
  password: string,
  confirm_password: string
}

interface movieData { 
  video_id: string, 
  watch_time: string 
}

const userSchema = z.object({
  username: z.string({ required_error: 'Error, username is required' }),
  password: z.string({ required_error: 'Error, password is required' }).min(6),
  confirm_password: z.string({ required_error: 'Error, confirm your password' }).min(6)
})

const preferenceSchema = z.object({
  video_id: z.number({ required_error: 'Error, insert video id' }), 
  watch_time: z.number({ required_error: 'Error, insert watch time' })
})

export const userValidation = (data: userData) => {
  return userSchema.refine(data => data.password === data.confirm_password, {
    message: "Passwords don't match"
  }).safeParse(data)
}

export const userValidationPartial = (data: userData) => {
  return userSchema.partial().safeParse(data)
}

export const videoValidation = (data: movieData) => {
  return preferenceSchema.safeParse(data)
}