require('dotenv').config()
const express = require('express')
const db = require('./db.js')

const app = express();

const routerTest = require('./routes/test.js')
const routerUser = require('./routes/user.js')

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/user', routerUser)
app.use('/test', routerTest)

const port = process.env.PORT

app.listen(port, () => {
    console.log('listening on port')
})



