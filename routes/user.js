const express = require('express');

const db = require('../db.js')

const { v4 } = require('uuid')

const router = express.Router();

function checkAPIKey(callback){
    if(req.headers.apikey){
        db.getUserByApiKey(req.headers.apikey, (user) => {
            if(user.length > 0){
                callback(user)
            } else {
                res.json({
                    code:403,
                    message:"APIKey is invalid"
                }).status(403)
            }
        })
    } else {
        res.json({
            code:403,
            message:"APIKey required"
        }).status(403)
    }
}

router.post('/', (req, res) => {
    checkAPIKey((user)=>{
        const apiKey = v4()
        const username  = req.body.username
        const firstName  = req.body.firstname
        const lastName = req.body.lastname
        const isAdmin = req.body.isAdmin
        if (username){
            db.addUser(username,firstName,lastName,apiKey,isAdmin)
            res.json({
                code:201,
                key: apiKey
            }).status(201)
        } else {
            res.json({
                code:400,
                message:"Username must exist"
            }).status(400)
        }
    })
})

router.get('/', (req, res) => {
    checkAPIKey((user)=>{
        if (user[0].isadmin){
            db.getAllUsers((resDB) => {
                res.json(resDB).status(200)
            })
        } else {
            res.json({
                code:403,
                message:"You don't have access"
            }).status(403)
        }
    })
})

router.get('/:id', (req, res) => {
    checkAPIKey((user)=>{
        if (user[0].isadmin){
            db.getUserById(req.params.id,(resDB)=>{
                if(resDB.length > 0){
                    res.json(resDB).status(200)
                }else{
                    res.json({
                        code:404,
                        message:"User does not exist"
                    }).status(404)
                }
            })
        } else {
            res.json({
                code:403,
                message:"You don't have access"
            }).status(403)
        }
    })
})

router.delete('/:id', (req, res) => {
    checkAPIKey((user)=>{
        if (user[0].isadmin){
            db.getUserById(req.params.id,(resDB)=>{
                if(resDB.length > 0){
                    db.deleteUserById(req.params.id)
                    res.json({
                        code:200,
                        message:"User has been deleted successfully"
                    }).status(200)
                }else{
                    res.json({
                        code:404,
                        message:"User does not exist"
                    }).status(404)
                }
            })
        } else {
            res.json({
                code:403,
                message:"You don't have access"
            }).status(403)
        }
    })
})

router.put('/:id', (req, res) => {
    checkAPIKey((user)=>{
        if (user[0].isadmin){
            db.getUserById(req.params.id,(resDB)=>{
                if(resDB.length > 0){
                    const username  = req.body.username
                    const firstName  = req.body.firstname
                    const lastName = req.body.lastname
                    const isAdmin = req.body.isAdmin
                    if(typeof isAdmin==="boolean"){
                        db.updateUser(req.params.id,username,firstName,lastName,isAdmin)
                        res.json({
                            code:200,
                            message: 'User has been updated'
                        }).status(200)
                    }else{
                        res.json({
                            code:400,
                            message:'isAdmin must be boolean'
                        }).status(400)
                    }
                    
                    
                }else{
                    res.json({
                        code:404,
                        message:"User does not exist"
                    }).status(404)
                }
            })
        } else {
            res.json({
                code:403,
                message:"You don't have access"
            }).status(403)
        }
    })
})

router.put('/', (req, res) => {
    if(req.headers.apikey){
        db.getUserByApiKey(req.headers.apikey, (user) => {
            if(user.length > 0){       
                const username  = req.body.username
                const firstName  = req.body.firstname
                const lastName = req.body.lastname
                
                db.updateUser(user[0].id,username,firstName,lastName)
                res.json({
                    code:200,
                    message: 'User has been updated'
                }).status(200) 

            } else {
                res.json({
                    code:403,
                    message:"APIKey is invalid"
                }).status(403)
            }
        })
    } else {
        res.json({
            code:403,
            message:"APIKey required"
        }).status(403)
    }
})



module.exports = router;


// Radieyshn - f3af6abb-4f29-4fc3-b8fa-f9d3fd0f7e46
// Admin - dba963a2-d81d-423c-a6c8-efebaf584525