const test = require('./test.js')

const express = require('express');

const db = require('../db.js')

const router = express.Router();
 
router.get('/', (req, res) => {
    test.checkAPIKey(req, res, (user)=>{
        db.getAllCategories((categories)=>{
            if(categories.length <= 0){
                return res.json({
                    code:404,
                    message:"Categories don't exist"
                }).status(404)
            }
            res.json({
                code: 200,
                categories: categories
            }).status(200)
        })
    })
}) 

router.post('/', (req, res) => {
    test.checkAPIKey(req, res, (user) => {
        if(!user[0].isadmin){
            return res.json({
                code:403,
                message: "You don't have access"
            }).status(403)
        } 
        const name = req.body.name
        if(!name){
            return res.json({
                code:400,
                message: "Name must exist"
            }).status(400)
        }
        if(name.length <= 2){
            return res.json({
                code:400,
                message: "Name must be at least 3 symbols long"
            }).status(400)
        }
        db.addCategory(name,(id)=>{
            res.json({ 
                code:201, 
                message:`Category has been added with id - ${id[0].id}` 
            })
        }) 
    }) 
}) 

router.delete('/:id', (req, res) => {
    test.checkAPIKey(req, res, (user) => {
        if(!user[0].isadmin){
            return res.json({
                code:403,
                message: "You don't have access"
            }).status(403)
        }    
        if(!Number(req.params.id)){
            return res.json({
                code:400,
                message: "Id must be int"
            }).status(400)
        }
        db.getCategoryById(req.params.id, (category) => {
            if(!category){
                return res.json({
                    code:404,
                    message: "Category does not exist"
                }).status(404)
            }
            db.deleteCategory(req.params.id) 
            res.json({
                code:201,
                message: "Category has been deleted"
            }).status(201)
        })  
    })
})

router.put('/:id', (req, res) => {
    test.checkAPIKey(req, res, (user) => {
        if(!user[0].isadmin){
            return res.json({
                code:403,
                message: "You don't have access"
            }).status(403)
        }
        const name = req.body.name
        if(name.length <= 2){
            return res.json({
                code:400,
                message: "Name must be at least 3 symbols long"
            }).status(400)
        }
        
        db.getCategoryById(req.params.id, (category) => {
            if(category.length <= 0){
                return res.json({
                    code:404,
                    message: "Category does not exist"
                }).status(404)
            }
            db.updateCategory(req.params.id,name) 
            res.json({
                code: 200,
                message: "Category has been updated"
            })
        })
    })
}) 



module.exports = router