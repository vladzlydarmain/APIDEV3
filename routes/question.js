const test = require('./test.js')

const express = require('express');

const db = require('../db.js')

const router = express.Router(); 

router.post('/', (req, res) => {
    test.checkAPIKey(req, res, (user) => {
        const question = req.body.question
        const correctAnswer = req.body.correctAnswer
        const incorrectAnswers = req.body.incorrectAnswers
        const creator = user[0].id
        const category = req.body.category
        let difficulty = req.body.difficulty
        if(!question){
            return res.json({
                code:400,
                message: "Question must exist"
            }).status(400)
        }
        if(question.length < 7){
            return res.json({
                code:400,
                message: "Question must be at least 7 symbols long"
            }).status(400)
        }
        if(!correctAnswer){
            return res.json({
                code:400,
                message: "Correct answer must exist"
            }).status(400)
        } 
        if(!incorrectAnswers){
            return res.json({ 
                code:400,
                message: "Incorrect answers must exist"
            }).status(400)
        }
        if(typeof incorrectAnswers != "object"){
            return res.json({ 
                code:400,
                message: "Incorrect answers must be Array with 3 str elements"
            }).status(400)
        }
        if(incorrectAnswers.length <= 2){
            return res.json({
                code:400,
                message: "Incorrect answer must have 3 str options"
            }).status(400)
        }
        if(typeof incorrectAnswers[0] != "string" || typeof incorrectAnswers[1] != "string" || typeof incorrectAnswers[2] != "string"){
            return res.json({
                code:400,
                message: "Incorrect answer must have 3 str options"
            }).status(400)
        } 
        if(!Number(category) && category != undefined){  
            return res.json({
                code:400,  
                message: "Category must be int"
            }).status(400) 
        } 
        if(Number(difficulty) > 3 || Number(difficulty) <= 0){
            return res.json({
                code:400,  
                message: "Difficulty must be less or equals 3 and more than 0" 
            }).status(400) 
        }
        if(!difficulty){
            difficulty = 0
        } 
        if (!category){
            return res.json({
                code:400,  
                message: "Category must exits" 
            }).status(400) 
        }
        db.getCategoryById(category,(resDB)=>{
            if(resDB.length < 1){
                return res.json({
                    code:404,
                    message: "Category does not exist"  
                }).status(404)
            }
            db.addQuestion(question, correctAnswer, incorrectAnswers, creator,difficulty, category,(id)=>{
                console.log(id)
                return res.json({
                    code:201,
                    message: `Question has been created with id - ${id[0].id}`
                }).status(201) 
            })  
        })
    })
})

router.get('/', (req, res) => {
    test.checkAPIKey(req, res, (user) => {
        const limit = req.query.limit
        let category = req.query.category
        let difficulty = req.query.difficulty
        if(limit == undefined){
            return res.json({
                code: 400,
                message: "Limit must exist"
            }).status(400)
        }
        if(!Number(limit) && limit != undefined){
            return res.json({
                code:400,
                message: "Limit must be int"
            }).status(400) 
        }
        if(limit > 10 || limit < 1){
            return res.json({
                code:400,
                message: "Limit must be less or equals 10 and more than 0"
            }).status(400)
        }
        if(!Number(difficulty) && difficulty != undefined){
            return res.json({
                code:400,
                message: "Difficulty must be int"
            }).status(400) 
        }
        if(Number(difficulty) > 3 || Number(difficulty) <= 0){
            return res.json({
                code:400,  
                message: "Difficulty must be less or equals 3 and more than 0" 
            }).status(400) 
        }
        if(!difficulty){
            difficulty = 0
        }
        if(category == undefined){
            category = 0
        }
        db.getCategoryById(category,(resDB)=>{
            if(resDB.length < 1){
                if(category != 0){
                    return res.json({
                        code:404,
                        message: "Category does not exist"  
                    }).status(404)
                } 
            }
            db.getRandomQuestions(limit,category,difficulty,(set)=>{
                if(set.length > 0 && set[0] != null){
                    return res.json(set)
                } else {
                    return res.json({
                        code:404,
                        message: "Questions like this don`t exist"  
                    }).status(404)
                }
            })
        })
    })
})

router.get('/:id',(req,res)=>{
    test.checkAPIKey(req,res,(user)=>{
        db.getQuestionById(req.params.id,(resDB)=>{
            if(resDB.length <= 0){
                return res.json({
                    code:404,
                    message: "Question does not exist"  
                }).status(404)
            }
            return res.json(resDB)
        })
    })
})

router.delete('/:id',(req,res)=>{
    test.checkAPIKey(req,res,(user)=>{
        db.getQuestionById(req.params.id,(question)=>{
            if(question.length <= 0){
                return res.json({
                    code:404,
                    message:"Question does not exist"
                }).status(404)
            }
            if (user[0].isadmin || question[0].creator == user[0].id){  
                db.deleteQuestionById(req.params.id)
                return res.json({
                    code:200,
                    message:"Question has been deleted successfully"
                }).status(200)
            } else {
                return res.json({
                    code:403,
                    message:"You don't have access"
                }).status(403)           
            }
        })
    })
})

router.put('/:id',(req,res)=>{
    test.checkAPIKey(req,res,(user)=>{
        const id = req.params.id 
        const question = req.body.question
        const correctAnswer = req.body.correctAnswer
        const incorrectAnswers = req.body.incorrectAnswers
        const creator = user[0].id
        let category = req.body.category
        let difficulty = req.body.difficulty
        if(question){
            if(question.length < 7){
                return res.json({
                    code:400,
                    message: "Question must be at least 7 symbols long"
                }).status(400)
            }
        }
        if(incorrectAnswers){
            if(typeof incorrectAnswers != "object"){
                return res.json({ 
                    code:400,
                    message: "Incorrect answers must be Array with 3 str elements"
                }).status(400)
            }
        }
        if(category){
            if(!Number(category) && category != undefined){  
                return res.json({
                    code:400,  
                    message: "Category must be int"
                }).status(400) 
            } 
        } else {
            category = 0
        }
        if(difficulty){
            if(Number(difficulty) > 3 || Number(difficulty) <= 0){
                return res.json({
                    code:400,  
                    message: "Difficulty must be less or equals 3 and more than 0" 
                }).status(400) 
            }
        }
        db.getCategoryById(category,(resDB)=>{
            if(resDB.length < 1){
                if(category != 0){
                    return res.json({
                        code:404,
                        message: "Category does not exist"  
                    }).status(404)
                } 
            }
            db.updateQuestion(id,question, correctAnswer, incorrectAnswers,difficulty, category)
            return res.json({
                code:200,
                message: `Question has been updated`
            }).status(200) 
             
        })
    })
})

module.exports = router