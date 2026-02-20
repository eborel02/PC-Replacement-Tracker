import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import employeeRoutes from './routes/employeeRoutes.js'
import computersRoutes from './routes/computersRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

const app = express();
const PORT = process.env.PORT || 4000;

//mongo connection
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json())

//bodyparser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//cors
app.use(cors())

// Add this **before** your route definitions:
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// routes
app.use('/employees', employeeRoutes)
app.use('/computers', computersRoutes)
app.use('/dashboard', dashboardRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the PC Replacement Management System API')
})

app.listen(PORT, () =>
    console.log(`Your application server is running on port ${PORT}`)
)