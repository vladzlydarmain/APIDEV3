const { Client } = require('pg')

const app = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT1
})

app.connect()

function getRandomInt(min, max,callback) {

    min = Math.ceil(min);
    max = Math.floor(max);

    let number = Math.floor(Math.random() * (max - min + 1)) + min
    callback(number)
}

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

function createTableQuestions(){
    const query = `CREATE TABLE "Questions"(
        id SERIAL PRIMARY KEY,
        question VARCHAR(255),
        correctAnswer VARCHAR(255),
        incorrectAnswers text[],
        creator INT,
        difficulty INT,
        category INT,
        creationDate VARCHAR(255), 
        updateDate VARCHAR(255)
    );`
    app.query(query) 
}

function addUser(username,firstName,lastName,APIKey,isAdmin){
    const query = `INSERT INTO "User"(username, firstName, lastName, APIKey, isAdmin) VALUES('${username}','${firstName}','${lastName}','${APIKey}',${isAdmin});`
    app.query(query)
}

function getUserByApiKey(APIKey, callback){
    const query = `SELECT * FROM "User" WHERE APIKey = '${APIKey}'`
    app.query(query,(_err,res)=>{
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
    app.query(query, (_err,res)=>{
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
        app.query(query,(err,_res)=>{
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
    app.query(query,(_err,res)=>{
        callback(res.rows)
    })
} 
 
function deleteCategory(id){
    const query = `DELETE FROM "Categories" WHERE id = ${id}`
    app.query(query,(err,_res)=>{
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
   
function addQuestion(question, correctAnswer, incorrectAnswers, creator,difficulty, category,callback){
    const date = new Date()
    const updateDate = new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds()).toUTCString() 
    const creationDate = new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds()).toUTCString()
    const query = `INSERT INTO "Questions"(question, correctAnswer, incorrectAnswers, creator,difficulty, category, creationDate, updateDate) VALUES('${question}', '${correctAnswer}', '{${incorrectAnswers[0]},${incorrectAnswers[1]},${incorrectAnswers[2]}}', '${creator}','${difficulty}','${category}', '${creationDate}', '${updateDate}') RETURNING id`
    app.query(query,(err,res)=>{
        console.log(err)
        // console.log(res)
        callback(res.rows) 
    })    
} 

function getRandomQuestions(limit, category, difficulty, callback){
    const array = []
    console.log(category)
    console.log(difficulty)
    let query = `SELECT * FROM "Questions" WHERE category = '${category}' AND difficulty = '${difficulty}'`
    if(difficulty == 0 && category == 0){
        query = `SELECT * FROM "Questions"`
    } else if(difficulty == 0){
        query = `SELECT * FROM "Questions" WHERE category = '${category}'`
    } else if(category == 0){
        query = `SELECT * FROM "Questions" WHERE difficulty = '${difficulty}'`
    }
    app.query(query,(err, res) => {
        console.log(err)
        console.log(1)
        console.log(res.rows)
        for(let i = 0; i < limit;i++){
            getRandomInt(0,res.rows.length-1,(id)=>{
                array.push(res.rows[id])
            })
        }
        callback(array)
    })
}

function getQuestionById(id, callback){
    const query = `SELECT * FROM "Questions" WHERE id = '${id}'`
    app.query(query, (err, res) => {
        console.log(err)
        callback(res.rows)
    })
}

function deleteQuestionById(id){
    const query = `DELETE FROM "Questions" WHERE id = '${id}'`
    app.query(query)
}

function updateQuestion(id, question, correctAnswer, incorrectAnswers, difficulty, category){
    const date = new Date()
    const updateDate = new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds()).toUTCString() 
    getQuestionById(id,(resDB)=>{
        if(!question){
            question = resDB[0].question
        }
        if(!correctAnswer){
            correctAnswer = resDB[0].correctanswer
        }
        if(!incorrectAnswers){
            incorrectAnswers = resDB[0].incorrectanswers
        }
        console.log(incorrectAnswers.length)
        if(incorrectAnswers.length < 3 && incorrectAnswers.length > 0){
            for(let i in resDB[0].incorrectanswers){
                if(!incorrectAnswers[i]){
                    incorrectAnswers.push(resDB[0].incorrectanswers[i])
                }
            }
        }
        if(!difficulty){
            difficulty = resDB[0].difficulty
        }
        if(!category){
            category = resDB[0].category
        }
        const query = `UPDATE "Questions" SET question = '${question}', correctAnswer = '${correctAnswer}', incorrectAnswers = '{${incorrectAnswers[0]},${incorrectAnswers[1]},${incorrectAnswers[2]}}', difficulty = '${difficulty}', category = '${category}', updateDate = '${updateDate}' WHERE id = ${id}`
        app.query(query,(err,res)=>{
            console.log(err)
        })
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
    addQuestion:addQuestion,
    getRandomQuestions:getRandomQuestions,
    getQuestionById:getQuestionById,
    deleteQuestionById:deleteQuestionById,
    updateQuestion:updateQuestion
}