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
        db.getCategoryById(category,(resDB)=>{
            if(resDB.length < 1){
                return res.json({
                    code:404,
                    message: "Category does not exist"
                }).status(404)
            }
            db.addQuestion(question, correctAnswer, incorrectAnswers, creator, category)
            res.json({
                code:201,
                message: "Question has been created"
            }).status(201) 
        })
    })
})

module.exports = router