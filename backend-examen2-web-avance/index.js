import express from "express";
import cors from 'cors'
import helmet from "helmet";
import compression from "compression";
import bodyParser from "body-parser";
import dotenv from 'dotenv'

import database from "./config/connection.js";
import route from "./routes/userRoute.js";
//import { userList } from "./controllers/userController.js";
// database.sync({ alter: true })
import departmentRoute from "./routes/departmentRoute.js";
import roleRoute from "./routes/roleRoute.js";
import authRoute from "./routes/authRoute.js";
import subjectRoute from "./routes/subjectRoute.js";
import laboratoryRoute from "./routes/laboratoryRoute.js";
import equipmentRoute from "./routes/equipmentRoute.js";

const app = express()

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (_req, res) => {
	res.status(200).json({
		message: 'API backend en ligne',
		basePath: '/api',
	});
})

app.get('/api', (_req, res) => {
	res.status(200).json({
		message: 'Racine API disponible',
		endpoints: [
			'/api/login',
			'/api/users',
			'/api/departments',
			'/api/roles',
			'/api/laboratories',
			'/api/equipment',
			'/api/subjects'
		]
	});
})

// Les routes 
// app.get('/api/users',userList)
app.use('/api/users', route)
app.use('/api/departments', departmentRoute)
app.use('/api/roles', roleRoute)
app.use('/api/login', authRoute)
app.use('/api/laboratories',laboratoryRoute)
app.use('/api/equipment',equipmentRoute)
app.use('/api/subjects',subjectRoute)

app.use('/public', express.static('public'))

const PORT = dotenv.config().parsed.PORT

app.listen(PORT, () => console.log(`Le serveur tourne sur le port ${PORT}`))