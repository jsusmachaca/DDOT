import express from 'express'
import cors from 'cors'
import './Config/config'

import { movie } from './Routes/movie'
import { user } from './Routes/user'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/', movie)
app.use('/user', user)



const PORT = process.env.PORT!
app.listen(PORT, () => {
  console.log(`App listen on http://localhost:${PORT}`)
})