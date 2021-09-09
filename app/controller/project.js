"use strict"

let obj = () =>{
    const md5 = require("md5");
    const moment = require("moment");
    const validator = require("validator");
    const getMessage = require("../../src/errors")

    const fn = {}

    fn.getAllProject = async (req, res, next) => {
        try {
            let access_token = req.headers["access-token"] || "";

            // validate access token
            if (validator.isEmpty(access_token)) {
              throw { message: "Your access token is invalid or already expired." };
            }
      
            // get detail token by access token
            let detailToken = await req
              .model("auth")
              .getValidAccessToken(access_token);
      
            // validate access token
            if (detailToken == null) {
              throw { message: "Your access token is invalid or already expired." };
            }
      
            // validate customer login
            if (detailToken.customer_id <= 0) {
              throw { message: "You are not authorized to access this page." };
            }
      
            // get customer detail
            let detailCustomer = await req
              .model("account")
              .getUser(detailToken.customer_id);
            // if customer not found, throw error
            if (detailCustomer == null) {
              // inactive token by device id
              await req.model("auth").setTokenInactive(detailToken.atoken_device);
              throw { message: "User not found, please re-login." };
            }
            
            let result = await req.model('project').getAllProject(customer_id);

            res.success(result)
            
        } catch (e) {
            next(e)
        }
    };

    fn.getProject = async (req, res, next) => {
        try {
            let access_token = req.headers["access-token"] || "";

            // validate access token
            if (validator.isEmpty(access_token)) {
              throw { message: "Your access token is invalid or already expired." };
            }
      
            // get detail token by access token
            let detailToken = await req
              .model("auth")
              .getValidAccessToken(access_token);
      
            // validate access token
            if (detailToken == null) {
              throw { message: "Your access token is invalid or already expired." };
            }
      
            // validate customer login
            if (detailToken.customer_id <= 0) {
              throw { message: "You are not authorized to access this page." };
            }
      
            // get customer detail
            let detailCustomer = await req
              .model("account")
              .getUser(detailToken.customer_id);
            // if customer not found, throw error
            if (detailCustomer == null) {
              // inactive token by device id
              await req.model("auth").setTokenInactive(detailToken.atoken_device);
              throw { message: "User not found, please re-login." };
            }

            let projectid = parseInt(req.params.projectid)
            
            let result = await req.model('project').getProject(projectid, customer_id);

            res.success(result)
            
        } catch (e) {
            next(e)
        }
    };
    fn.createProject = async(req, res, next) => {
        try {
            let now = moment().format('YYYY-MM-DD HH:mm:ss')

            let user_id = req.body.user_id
            if(user_id <= 0){
                throw getMessage('udf001')
            }
            //get parameter
            let mp_title = req.body.project_id
            if(validator.isEmpty(mp_title)){
                throw getMessage('udf006')
            }
            let mp_desc = (req.body.project_desc || '').trim()
            let mp_status = req.body.project_status
            if(validator.isEmpty(mp_status)){
                throw getMessage('udf008');
            }
            //validate deadline
            let mp_deadline = req.body.project_deadline
            if(validator.isEmpty(mp_deadline)){
                throw getMessage('udf009')
            }
            //validate if account exists
            let user = await req.model('account').getUser(user_id)
            if(!user){
                throw getMessage('udf004')
            }
            //validate if account belongs to loggedin user
            if(user.u_id != user_id){
                throw getMessage('udf001')
            }
            let data = {
                mp_u_fk : user_id,
                mp_status : mp_status,
                mp_title : mp_title,
                mp_desc : mp_desc,
                mp_deadline : mp_deadline,
                mp_created_at : now
            }
            let main_project = await req.model('project').insertProject(data)
            let result = await req.model('project').getProject(main_project.mp_id)
            res.success(result)            
        } catch (e) {next(e)}
    }
    
    fn.updateProject = async (req, res, next) => {
        try {
            let user_id = req.body.user_id
            if(user_id <= 0){
                throw getMessage('udf001');
            }
            //validate if user account exist
            let user = await req.model('account').getUser(user_id)
            if(!user){
                throw getMessage('udf004');
            }
            //validate if user account belongs to loggedin user
            if(user.u_id != user_id){
                throw getMessage('udf005');
            }
            let project_id = req.body.project_id
            if(project_id <= 0){
                throw getMessage('udf002');
            }
            let detailProject = await req.model('project').getProject(project_id);
            if(isEmpty(detailProject)){
                throw getMessage('udf004');
            }
            //validate input
            let mp_title = (req.body.title || '').trim()
            let mp_desc = (req.body.desc || '').trim()
            let now = moment().format('YYYY-MM-DD HH:mm:ss')
            let mp_deadline = req.body.deadline
            if(mp_deadline < now){
                throw getMessage('');
            }

            let data = {
                mp_u_fk: user_id || detailProject.mp_u_fk,
                mp_status: req.body.status || detailProject.mp_status,
                mp_title: mp_title || detailProject.mp_title,
                mp_desc : mp_desc || detailProject.mp_desc,
                mp_deadline : mp_deadline || detailProject.mp_deadline,
                mp_updated_at : moment().format('YYYY-MM-DD HH:mm:ss')
            }
            //validate title
            if(validator.isEmpty(data.mp_title)){
                throw getMessage('udf006')
            }
            //validate status
            if(validator.isEmpty(data.mp_status)){
                throw getMessage('udf007')
            }
            if(validator.isEmpty(data.mp_desc)){
                throw getMessage('udf008')
            }
            if(validator.isEmpty(data.mp_deadline)){
                throw getMessage('udf009')
            }
            //insert data & get detail
            await req.model('project').updateProject(project_id, data)
            let result = await req.model('project').getProject(project_id)
            res.success(result)
        } catch (e) {next(e)}
    }
    return fn
}

module.exports = obj
