"use strict"
let obj = () => {
    const fn = {}

    fn.index = (req, res, next) => {
        try{
            const successObj = {
                "message" : 'success running',            
            }
            res.success(successObj)
        }catch(e) {next(e)}
    }

    return fn
}

module.exports = obj