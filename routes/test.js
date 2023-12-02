const express = require('express');

const db = require('../db.js')

const router = express.Router();

router.get('/', (req, res) => {
    if(req.headers.apikey){
        db.getUserByApiKey(req.headers.apikey, (user) => {
            console.log(user)
            if(user.length > 0){
                res.json({
                    code:200
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


module.exports = router
