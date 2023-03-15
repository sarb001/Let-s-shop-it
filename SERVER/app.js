const express = require('express');
const app = express();
const PORT = 5000;
const mongoose  = require('mongoose');
const dotenv = require('dotenv');

const UserRoutes = require('./Routes/auth')
const PostRoutes = require('./Routes/Post')
const UsersRoutes = require('./Routes/Users')

dotenv.config();
app.use(express.json());

app.use('/',UserRoutes);            // For Routes 
app.use('/',PostRoutes);            // For Post  Routes 
app.use('/',UsersRoutes);                    // For Users  Routes 


const mongourl = process.env.MONGO_URL;

mongoose.connect(mongourl)
mongoose.set('strictQuery',false);

mongoose.connection.on('connected' , () => {
    console.log('Connected to databasessss ');
})

mongoose.connection.on('error' , (err) => {
    console.log(' Error !!!!! ',err);
})

app.get('/',(req,res) => {
    res.send('Hello Worlkd')
})

app.listen(PORT,() => {
    console.log('Server is Running on BRO ',PORT);
})