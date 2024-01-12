import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import express, { json, urlencoded } from 'express'
import routes from '../routes'
import cookieParser from 'cookie-parser'
import deserializeUser from '../middleware/deserializeUser'
import http from 'http'
const app = express()
const server = http.createServer(app)
import { Server } from 'socket.io'

const io = new Server(server, {
  cors: {
    origin: ['http://172.16.255.21:5173', 'http://localhost:5173']
  }
})

io.on('connection', (socket: any) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })
})

io.on('newRequestTransaction', (data: any) => {
  console.log('newRequestTransaction', data)
})

app.use(cookieParser())
app.use(json())
app.use(
  cors({
    origin: ['http://172.16.255.21:5173', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'X-Access-Token',
      'X-Key',
      'Cookies',
      'Cache-Control',
      'Set-Cookie'
    ],
    credentials: true
  })
)

app.use(function (req, res, next) {
  const allowedOrigins = ['http://172.16.255.21:5173', 'http://localhost:5173']
  const origin = req.headers.origin as string
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.header('Access-Control-Allow-Credentials', true as any)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
)
app.use(urlencoded({ extended: true }))
app.use('/image', express.static(path.join(__dirname, '../../public/uploads')))
app.use(deserializeUser)
app.use(routes(io))

export default server
