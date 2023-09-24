const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')

const app = express()

//Parse any incoming request having json data and the reach next middlewares in line. Moves from top -> bottom
app.use(bodyParser.json())

app.use('/uploads/images', express.static(path.join('uploads', 'images')))
//Statically serve frontend
app.use(express.static(path.join('public')))

//Forward to placesRoutes only if request starts with /places
app.use('/places', placesRoutes)

//Forward to usersRoutes only if request starts with /users
app.use('/users', usersRoutes)
app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})


//To avoid code duplication for error handling each time as have to set header to 404 and send message each time. Middleware taking 4 arg. is treated by express as special middleware for error handling
app.use((error, req, res, next) => {
    //Link file to user in data. But rollback process in case of error
    if(req.file){
        fs.unlink(req.file.path, err => console.log(err))
    }

    //Headers set means already send a response
    if(res.headerSent){
        return next(error)
    }
    //Othewise set header and error msg
    res.status(error.code || 500).json({message: error.message || 'An unknown error occurred'})
})

//Connect to db
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mjodwc6.mongodb.net/${process.env.DB_NAME}?authSource=admin&readPreference=primary`).then(() =>  app.listen(5000)).catch(err => console.log(err))
