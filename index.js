// require('dotenv').config()
const express = require('express')
const db = require('./db.js')

const app = express();

const routerUser = require('./routes/user.js')
const routerCategory = require('./routes/category.js')
const routerQuestion = require('./routes/question.js')

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/user', routerUser)
app.use('/category', routerCategory)
app.use('/question', routerQuestion)


app.listen(port, () => {
    console.log('listening on port')
})



 