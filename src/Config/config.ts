import 'dotenv/config'
import mongoose from 'mongoose'

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/crud?authSource=admin`)
  .then(() => console.log('connect'))
  .catch(err => console.error(err))