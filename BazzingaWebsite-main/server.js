const express = require('express');
const path = require('path');
const db = require('./database');
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(express.urlencoded({extended:true}));

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set public folder
app.use(express.static(path.join(__dirname,'/public')));

setInterval(function(){ 
    var today = new Date();       // DATE
    //var today = new Date(2021, 12, 23, 23, 59, 1, 0);
    var hour = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();

    if (hour >= 23 && minutes >= 59 && seconds > 0) {  
       db.revertSlots();
       db.emptyReservations();
    }
}, 3600000);

var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:sessionStore
}));
var MySQLStore = require('express-mysql-session')(session);//
var sessionStore = new MySQLStore(db.option);//


//star .......................

function myMiddleware(req, res, next) {
    req.alert = 0;
    next();
}
  // Using it in an app for all routes (you can replace * with any route you want)
app.use('/adminlogin', myMiddleware)

//end..........................


//user routes
var pages = require('./routes/pages.js');

//admin routes
var adminHomePage = require('./routes/admin_homepage.js');
var adminProducts = require('./routes/admin_products.js');
var adminReservations = require('./routes/admin_reservations.js');

//admin route middlewares
app.use('/admin/homepage', adminHomePage);
app.use('/admin/products', adminProducts);
app.use('/admin/reservations', adminReservations);

//user route middlewares
app.use('/', pages.router);

app.get('/admin/*', function (req, res) {
    res.render('page404',{
        title:404,
        link: '/admin/homepage'
    })
})

app.get('*', function (req, res) {
    res.render('page404',{
        title: 404,
        link:'/'
    })
})


app.listen(PORT, function(){
    console.log('listening to port ' + PORT);
    db.connection.connect(function(err){
        if(err) throw err;
        console.log("Database connected");
    });

});


