'use strict'

module.exports = (app) => {

    // load sources, and take the functions 
    const fn = require('../src/index')(app, __dirname)
    
    // apply routes to the function
    fn.router(require('./routes'))
    
    // if route not found
    app.use((req, res) => {
        res.notfound("Page not found!")
    })

    
    
    
}