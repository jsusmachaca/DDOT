import z from 'zod'

interface movieData {
  name: string,
  genre: string,
  url: string,
  duration: number
}

const movieSchema = z.object({
  name: z.string({ required_error: 'Error, name is required' }),
  genre: z.string({ required_error: 'Error, genre is required' }),
  url: z.string({ required_error: 'Error, url is required' }),
  duration: z.number({ required_error: 'Error, movie duration is required' })
})

export const movieValidation = (data: movieData) => {
  return movieSchema.safeParse(data)
}