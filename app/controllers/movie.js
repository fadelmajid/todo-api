"use strict"

const _ = require('underscore')
const request = require('axios')
const validator = require('validator')
const moment = require('moment')

let obj = (rootpath) => {
    const fn = {}
    const config = require(rootpath + '/config/config.json')

    fn.searchMovie = async (req, res, next) => {
        try {
            let search = req.query.s || ''
            let p = req.query.page || 1

            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }

            // validate search
            if(validator.isEmpty(search)){
                throw getMessage('mov002')
            }

            let data = {
                url: config.movie_url,
                options: {
                    headers: {
                        'Content-Type': 'application/json;'
                    }
                }
            }

            let result = await request.get(`${data.url}?apikey=${config.api_key}&s=${search}&page=${p}`, data.options);

            let log = {
                url: data.url,
                method: 'GET',
                type: "SUCCESS",
                request: {
                    s: search,
                    page: p
                },
                response: JSON.stringify(result.data),
                created_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            // validate response
            if(result.data.Response == "False"){
                log.type = "ERROR"
                await req.model('movie').insertMovieLog(log);
                throw getMessage('mov004')
            }

            // log to database
            await req.model('movie').insertMovieLog(log);

            res.success(result.data)
        } catch (e) {next(e)}
    }


    fn.getMovie = async (req, res, next) => {
        try {
            let movie_id = req.query.i || ''
            let title = req.query.t || ''

            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }

            // validate search
            if(validator.isEmpty(movie_id) && validator.isEmpty(title)){
                throw getMessage('mov003')
            }

            let data = {
                url: config.movie_url,
                options: {
                    headers: {
                        'Content-Type': 'application/json;'
                    }
                }
            }

            let result = await request.get(`${data.url}?apikey=${config.api_key}&i=${movie_id}&t=${title}`, data.options);

            let log = {
                url: data.url,
                method: 'GET',
                type: "SUCCESS",
                request: {
                    i: movie_id,
                    t: title
                },
                response: JSON.stringify(result.data),
                created_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            // validate response
            if(result.data.Response == "False"){
                log.type = "ERROR"
                await req.model('movie').insertMovieLog(log);
                throw getMessage('mov004')
            }

            // log to database
            await req.model('movie').insertMovieLog(log);

            res.success(result.data)
        } catch (e) {next(e)}
    }

    return fn;
}

module.exports = obj