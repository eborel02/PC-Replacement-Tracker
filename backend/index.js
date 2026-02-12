import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import employeeRoutes from './routes/employeeRoutes.js'
import computersRoutes from './routes/computersRoutes.js'

const app = express();
const PORT = 4000;

//mongo connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/PCReplacement')
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


app.use('/employees', employeeRoutes)
app.use('/computers', computersRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the PC Replacement Management System API')
})

app.listen(PORT, () =>
    console.log(`Your application server is running on port ${PORT}`)
)