import { Schema, model, Document } from 'mongoose'

interface IMovie extends Document {
  name: string,
  genre: string,
  url: string,
  duration: number
}

const MovieSchema = new Schema<IMovie>({
  name: { type: String, required: true},
  genre: { type: String, required: true},
  url: { type: String, required: true},
  duration: { type: Number, required: true}
})

const Movie = model<IMovie>('Movie', MovieSchema)

export default Movie