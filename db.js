const { Client } = require('pg')

const app = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT1
})

app.connect()

const createTableUser = () => {
    const query = `CREATE TABLE "User"(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        APIKey VARCHAR(64),
        isAdmin BOOL
    );`
    app.query(query)
}

function createTableCategories(){
    const query = `CREATE TABLE "Categories"(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)
    );`
    app.query(query)
}



function addUser(username,firstName,lastName,APIKey,isAdmin){
    const query = `INSERT INTO "User"(username, firstName, lastName, APIKey, isAdmin) VALUES('${username}','${firstName}','${lastName}','${APIKey}',${isAdmin});`
    app.query(query)
}

function getUserByApiKey(APIKey, callback){
    const query = `SELECT * FROM "User" WHERE APIKey = '${APIKey}'`
    app.query(query,(err,res)=>{
        // console.log(err)
        // console.log(res)
        callback(res.rows)
    })
}

function getUserById(id, callback){
    const query = `SELECT * FROM "User" WHERE id = ${id}`
    app.query(query, (err, res) => {
        console.log(err)
        console.log(res.rows)
        callback(res.rows)
    })
}

function getAllUsers(callback){
    const query = `SELECT * FROM "User"`
    app.query(query, (err,res)=>{
        console.log(res)
        callback(res.rows)
    })
}

function deleteUserById(id){
    const query = `DELETE FROM "User" WHERE id = ${id}`
    app.query(query, (err, res) => {
        console.log(err)
        console.log(res.rows)
    })
}
  
function updateUser(id,username,firstName,lastName,isAdmin){
    getUserById(id,(res)=>{
        if(!username){
            username = res[0].username
        }
        if(!firstName){
            console.log(res[0])
            firstName = res[0].firstname
        }
        if(!lastName){
            lastName = res[0].lastname
        }
        if(`${isAdmin}`=='undefined'){
            isAdmin = res[0].isadmin
        }
        const query = `UPDATE "User" SET username = '${username}', firstName = '${firstName}', lastName = '${lastName}', isAdmin = ${isAdmin} WHERE id = ${id}`
        app.query(query,(err,res)=>{
            console.log(err)
        })
    })
    
}

function getAllCategories(callback){
    const query = `SELECT * FROM "Categories"`
    app.query(query, (err,res)=>{
        console.log(err)
        callback(res.rows)
    }) 
} 

function addCategory(name,callback){
    const query = `INSERT INTO "Categories"(name) VALUES('${name}') RETURNING id`
    app.query(query,(err,res)=>{
        callback(res.rows)
    })
} 
 
function deleteCategory(id){
    const query = `DELETE FROM "Categories" WHERE id = ${id}`
    app.query(query,(err,res)=>{
        console.log(err) 
    }) 
} 

function getCategoryById(id,callback){
    const query = `SELECT * FROM "Categories" WHERE id = ${id}`
    app.query(query,(err,res)=>{
        console.log(err) 
        callback(res.rows)
    }) 
}  

function updateCategory(id, name){
    const query = `UPDATE "Categories" SET name = '${name}' WHERE id = ${id}`
    app.query(query)
}

function createTableQuestions(){
    const query = `CREATE TABLE "Questions"(
        id SERIAL PRIMARY KEY,
        question VARCHAR(255),
        correctAnswer VARCHAR(255),
        incorrectAnswers text[],
        creator INT,
        category INT,
        creationDate VARCHAR(255), 
        updateDate VARCHAR(255)
    );`
    app.query(query) 
}   
   
function addQuestion(question, correctAnswer, incorrectAnswers, creator, category){
    const date = new Date()
    const updateDate = new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds()).toUTCString() 
    const creationDate = new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds()).toUTCString()
    const query = `INSERT INTO "Questions"(question, correctAnswer, incorrectAnswers, creator, category, creationDate, updateDate) VALUES('${question}', '${correctAnswer}', '{${incorrectAnswers[0]},${incorrectAnswers[1]},${incorrectAnswers[2]}}', '${creator}', '${category}', '${creationDate}', '${updateDate}')`
    app.query(query,(err,res)=>{
        console.log(err)
    })    
} 
 
// createTableUser()
// createTableCategories()    
// createTableQuestions()        
 
module.exports = {
    addUser:addUser,
    getUserByApiKey: getUserByApiKey,
    getAllUsers: getAllUsers,
    getUserById:getUserById,
    deleteUserById:deleteUserById,
    updateUser: updateUser,
    getAllCategories: getAllCategories,
    addCategory: addCategory, 
    deleteCategory: deleteCategory,
    getCategoryById:getCategoryById,
    updateCategory: updateCategory,
    addQuestion:addQuestion
}