const mongoose              = require('mongoose');
const request 				= require('request');
const bvalid                = require("bvalid");
const mongo                 = require('../../services').Mongo;
const to                    = require('../../services').Utility.to;
const moment                = require('moment-timezone');
const helper                = require('../../helper');
const httpResponse          = helper.HttpResponse;
const constants             = helper.Constants;
const errorCodes            = helper.Errors;
const sendError 		    = httpResponse.sendError;
const sendSuccess			= httpResponse.sendSuccess;


exports.modifyUser = async function(req,res,next){
    
    req.checkBody('u_name',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkBody('e_mail',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkBody('role',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkBody('stts',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkBody('user_id',errorCodes.invalid_parameters[1]);

    if(req.validationErrors()){
		return sendError(res,req.validationErrors(),"invalid_parameters",constants.HTTP_STATUS.BAD_REQUEST);
    }
    
    var u_name  = req.body.u_name;   
    var e_mail  = req.body.e_mail;
    var role    = parseInt(req.body.role);
    var stts    = parseInt(req.body.stts);
    var user_id = req.body.user_id ?  req.body.user_id : null;

    if(!bvalid.isEmail(e_mail)){
        return sendError(res,"invalid_email","invalid_email",constants.HTTP_STATUS.BAD_REQUEST);
    }
    if(!bvalid.isNumber(role) || !(bvalid.isNumber(stts))){
        return sendError(res,"invalid_parameters","invalid_parameters",constants.HTTP_STATUS.BAD_REQUEST);
    }
    var obj = {
        u_name  : u_name,   
        e_mail  : e_mail,
        role    : role,
        stts    : stts,
        act     : true
    }

    var query_string = {
        e_mail  : e_mail,
        act     : true
    }
    var option      = {};
    var projection  = {};

    var [err,user] = await to(mongo.Model('user').findOne(query_string, projection, option));
    if(err){
        return sendError(res,"server_error","server_error");
    }
   
    if(user_id){
        if(user._id != user_id){
            return sendError(res,"user_already_exists","user_already_exists",constants.HTTP_STATUS.BAD_REQUEST);
        }else{
            var new_query_string = {
                _id : user_id,
                act : true
            }

            mongo.Model('user').updateOne( new_query_string, {$set : obj} ,function(err,updateddata){
                if(err){
                    return sendError(res,"server_error","server_error");
                }
                return sendSuccess(res,{});
            }) 
        }
    }else{
        if(user){
            return sendError(res,"user_already_exists","user_already_exists",constants.HTTP_STATUS.BAD_REQUEST);
        }else{
            mongo.Model('user').insert(obj,function(err,saveddata){
                if(err){
                    return sendError(res,"server_error","server_error");
                }
                return sendSuccess(res,{});
            }) 
        }
    }
}

exports.fetchUsers = async function(req,res,next){
    
    req.checkQuery('sort_order',errorCodes.invalid_parameters[1]).notEmpty();
    req.checkQuery('searchval',errorCodes.invalid_parameters[1]);

    if(req.validationErrors()){
		return sendError(res,req.validationErrors(),"invalid_parameters",constants.HTTP_STATUS.BAD_REQUEST);
    }

    var sort_order = req.query.sort_order;
    // console.log(sort_order);
    var [err1,getUserCount] = await to(mongo.Model('user').count({act : true}));
    if(err1){
        return sendError(res,err,"server_error",constants.HTTP_STATUS.SERVER_ERROR);
    }

    // console.log(getUserCount);
    if(getUserCount == 0){
        return sendSuccess(res,{
            total_users : getUserCount,
            users       : []
        }) 
    }else{
       
        var query_string = {
            act : true
        }
        var option      = { 
            sort : {
                u_name : sort_order
            }
        };

        if(req.query.searchval && req.query.searchval != undefined && req.query.searchval != ''){
            query_string.u_name =  new RegExp('^' + req.query.searchval , 'i');
        }
        var projection  = {};
    
        var [err,users] = await to(mongo.Model('user').find(query_string, projection, option));
        if(err){
            return sendError(res,err,"server_error",constants.HTTP_STATUS.SERVER_ERROR);
        }
        // console.log(JSON.stringify(users));
        return sendSuccess(res,{
            total_users : getUserCount,
            users       : users
        })  
    }
}

exports.removeUser = async function(req,res,next){
    
    req.checkBody('user_id',errorCodes.invalid_parameters[1]).notEmpty();

    if(req.validationErrors()){
		return sendError(res,req.validationErrors(),"invalid_parameters",constants.HTTP_STATUS.BAD_REQUEST);
    }
    
    var user_id = req.body.user_id ;
    var query_string = {
        _id : user_id,
        act : true
    }
    var option      = {};
    var projection  = {};

    var [err,user] = await to(mongo.Model('user').findOne(query_string, projection, option));
    
    if(err){
        return sendError(res,err,"server_error",constants.HTTP_STATUS.SERVER_ERROR);
    }else if(!user){
        console.log("user not exist");
        return sendError(res,err,"invalid_parameters",constants.HTTP_STATUS.BAD_REQUEST);
    }else{
        
        var obj =  {act : false}
        mongo.Model('user').updateOne( query_string, {$set : obj} ,function(err,updateddata){
            if(err){
                return sendError(res,"server_error","server_error");
            }
            return sendSuccess(res,{});
        }) 
    }
}
