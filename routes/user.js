const express = require('express');

const test = require('./test.js')

const db = require('../db.js')

const { v4 } = require('uuid')

const router = express.Router();

router.post('/', (req, res) => {
    test.checkAPIKey(req,res,(user)=>{
        if (user[0].isadmin){
            const apiKey = v4()
            const username  = req.body.username
            const firstName  = req.body.firstname
            const lastName = req.body.lastname
            const isAdmin = req.body.isAdmin
            if (!username){
                return res.json({
                    code:400,
                    message:"Username must exist"
                }).status(400)
                
            } else if(`${isAdmin}` == 'undefined'){
                return res.json({
                    code:400,
                    message:"isAdmin must exist"
                }).status(400)
            } else if(typeof isAdmin != "boolean"){
                return res.json({
                    code:400,
                    message:"isAdmin must be bool" 
                }).status(400)
            }   
            db.addUser(username,firstName,lastName,apiKey,isAdmin)
            res.json({
                code:201,
                key: apiKey 
            }).status(201)
        } else {
            res.json({
                code:403,
                message:"You don't have access"
            }).status(403)
        }
        
    })
})

router.get('/', (req, res) => {
    test.checkAPIKey(req,res,(user)=>{
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

router.get("/questions",(req,res) => {
    console.log("/questions5")
    test.checkAPIKey(req, res, (user)=>{
        console.log("CHECKED")
        console.log(user[0].id)
        db.getUserQuestions(user[0].id,(questions) => {
            if(questions.length > 0){
                return res.json(questions).status(200);
            } else {
                return res.json({
                    code:404,
                    message: "Questions don't exist"  
                }).status(404);   
            }
        })
    })
})

router.get('/:id', (req, res) => {
    test.checkAPIKey(req,res,(user)=>{
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
    test.checkAPIKey(req,res,(user)=>{
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
    test.checkAPIKey(req,res,(user)=>{
        if (user[0].isadmin){
            db.getUserById(req.params.id,(resDB)=>{
                if(resDB.length > 0){
                    const username  = req.body.username
                    const firstName  = req.body.firstname
                    const lastName = req.body.lastname
                    let isAdmin = req.body.isAdmin
                    if(typeof isAdmin==="boolean" || isAdmin == undefined){
                        isAdmin = false
                        db.updateUser(req.params.id,username,firstName,lastName,isAdmin)
                        res.json({
                            code:200,
                            message: 'User has been updated'
                        }).status(200)
                    }else if(typeof isAdmin !="boolean" && isAdmin != undefined){
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
    test.checkAPIKey(req,res,(user)=>{
        const username  = req.body.username
        const firstName  = req.body.firstname
        const lastName = req.body.lastname
        
        db.updateUser(user[0].id,username,firstName,lastName)
        return res.json({
            code:200,
            message: 'User has been updated'
        }).status(200)
    })
})
 
router.get("/:id/questions",(req,res)=>{
    test.checkAPIKey(req, res, (user) => {
        if(user[0].isadmin){
            db.getUserById(req.params.id, (tgUser) => {
                if(tgUser.length > 0){
                    db.getUserQuestions(req.params.id, (questions)=>{
                        if(questions.length > 0){
                            return res.json(questions).status(200);
                        } else {
                            return res.json({
                                code:404,
                                message: "Questions don't exist"  
                            }).status(404);   
                        }
                    })
                } else {
                    return res.json({
                        code:404,
                        message: "User does not exist"  
                    }).status(404);  
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

module.exports = router
 

// Radieyshn - f3af6abb-4f29-4fc3-b8fa-f9d3fd0f7e46
// Admin - dba963a2-d81d-423c-a6c8-efebaf584525