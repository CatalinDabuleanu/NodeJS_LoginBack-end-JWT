const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Import Public Routes
const authRoute = require('./src/routes/auth');

//Import Private Routes
const postRoute = require('./src/routes/posts');

//PROCESS ENV CONFIG
dotenv.config();


//CONNECT TO DB
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true },
    ()=>{ console.log('connected to db');
})

//Middleware

app.use(express.json());

//Public Route Middlewares
app.use('/api/user',authRoute);

//Private Route Middlewares
app.use('/api/posts',postRoute);

app.listen(process.env.PORT,()=> console.log('This is where everything started'));