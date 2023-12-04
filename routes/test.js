const db = require('../db.js')

function checkAPIKey(req,res,callback){
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


module.exports = {
    checkAPIKey:checkAPIKey
}
