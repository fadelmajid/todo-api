"use strict"

const getMessage = require("../../src/errors");

let obj = () =>{
    const md5 = require("md5");
    const moment = require("moment");
    const validator = require("validator");

    const fn = {}

    fn.getAllTasks = async (req, res, next) => {
        try {
            let projectid = parseInt(req.params.projectid)

            if(projectid <= 0) throw getMessage("udf002")
            let result = await req.model('task').getAllTask(projectid);
            res.send(result);
        } catch (e) {
            next(e);
        }
    };

    fn.getTask = async (req, res, next) => {
        try {
            let taskid = parseInt(req.params.taskid)

            if(taskid <= 0) throw getMessage("udf003")
            let result = await req.model('task').getTask(taskid);
            res.send(result);
        } catch (e) {
            next(e);
        }
    };

    fn.createTask = async (req, res, next) => {
        try {
            let now = moment().format('YYYY-MM-DD HH:mm:ss')

            let user_id = req.body.user_id
            if(user_id <= 0){
                throw getMessage('udf001')
            }
            let project_id = req.body.project_id
            if(project_id <= 0){
                throw getMessage('udf002')
            }
            //get parameter
            let t_title = req.body.task_id
            if(validator.isEmpty(t_title)){
                throw getMessage('udf006')
            }
            let t_desc = (req.body.task_desc || '').trim()
            let t_status = req.body.task_status
            if(validator.isEmpty(t_status)){
                throw getMessage('udf008');
            }
            //validate deadline
            let t_deadline = req.body.task_deadline
            if(validator.isEmpty(t_deadline)){
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
                t_mp_fk : project_id,
                t_status : t_status,
                t_deadline : t_deadline,
                t_title : t_title,
                t_desc : t_desc,
                t_created_at : now
            }
            let tasks = await req.model('task').insertTask(data)
            let result = await req.model('task').getProject(tasks.t_id)
            res.success(result) 
        } catch (error) {
            
        }
    }

    fn.updateTask = async (req, res, next) => {
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
                throw getMessage('udf002')
            }
            let task_id = req.body.task_id
            if(task_id <= 0){
                throw getMessage('udf003');
            }
            let detailTask = await req.model('task').getProject(task_id);
            if(isEmpty(detailTask)){
                throw getMessage('udf004');
            }
            //validate input
            let t_title = (req.body.title || '').trim()
            let t_desc = (req.body.desc || '').trim()
            let now = moment().format('YYYY-MM-DD HH:mm:ss')
            let t_deadline = req.body.deadline
            if(t_deadline < now){
                throw getMessage('');
            }

            let data = {
                t_mp_fk: project_id || detailTask.t_mp_fk,
                t_status: req.body.status || detailTask.t_status,
                t_deadline : t_deadline || detailTask.t_deadline,
                t_title: t_title || detailTask.t_title,
                t_desc : t_desc || detailTask.t_desc,
                t_updated_at : moment().format('YYYY-MM-DD HH:mm:ss')
            }
            //validate title
            if(validator.isEmpty(data.t_title)){
                throw getMessage('udf010')
            }
            //validate status
            if(validator.isEmpty(data.t_status)){
                throw getMessage('udf011')
            }
            if(validator.isEmpty(data.t_desc)){
                throw getMessage('udf012')
            }
            if(validator.isEmpty(data.t_deadline)){
                throw getMessage('udf013')
            }
            //insert data & get detail
            await req.model('task').updateTask(task_id, data)
            let result = await req.model('task').getTask(task_id)
            res.success(result)
        } catch (e) {next(e)}
    }

    return fn
}

module.exports = obj
