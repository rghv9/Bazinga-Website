var express  = require('express');
var router = express.Router();
var page = require('./pages');
const db = require('../database');


router.get('/',page.isAuth ,(req,res)=>{
    db.getAllFeedbacks()
    .then((feedbacks)=>{
        res.render('adminHomePage',
        {
            feeds: feedbacks,
            title: 'Admin Home'
        })
    }).catch((err)=>{
        res.send(err);
    })
}) 



//exports
module.exports = router;