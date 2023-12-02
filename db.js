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

// createTableUser()

module.exports = {
    addUser:addUser,
    getUserByApiKey: getUserByApiKey,
    getAllUsers: getAllUsers,
    getUserById:getUserById,
    deleteUserById:deleteUserById,
    updateUser: updateUser
}