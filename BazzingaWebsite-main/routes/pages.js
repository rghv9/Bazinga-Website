var express = require('express');
var router = express.Router();
var db = require('../database');
var connection = db.connection;
const { check, validationResult } = require('express-validator');
const { urlencoded } = require('body-parser');
const bodyParser = require("body-parser");
const url = require('url'); 


const urlencodedParser = bodyParser.urlencoded({ extended: false })



const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    }
    else {
        res.redirect('/adminlogin');
    }
}
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home'
    });
})

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us'
    })
})

router.get('/adminlogin', (req, res) => {
    if(!(Object.entries(req.query).length === 0 && req.query.constructor === Object)){
        req.alert=req.query.a; // req.alert=1
    }
    res.render('adminlogin', {
        title: 'Admin Login Page',
        alert:req.alert
    })
})

router.post('/adminlogin', async (req, res) => {
    const user = req.body.username;
    const password = req.body.password;
    // search database
    let result = await db.checkAdmin(user, password);
    //then render adminhome page
    if (result.length > 0) {
        req.session.isAuth = true;
        req.alert = 0; //initial
        res.redirect('/admin/homepage');
    }
    //start...........................................................
    else{
        //alert("something wrong");
        req.alert = 1;
        res.redirect(url.format({
            pathname:'/adminlogin',
            query :{
                a:req.alert//a=1
            } 
        }));
    }
    //end...............................................................
});
router.get('/feedback', (req, res) => {
    res.render('feedback', {
        title: 'Feedback'
    })
})


var today = new Date();       // DATE
// var today = new Date(2021, 12, 23, 17, 0, 0, 0);
var hour = today.getHours();
var minutes = today.getMinutes();
var seconds = today.getSeconds();


router.get('/reserve-table', async (req, res) => {
    if (hour >= 17 && minutes >= 0 && seconds > 0) {  // Closed reservation
        res.render("closed");
    }
    else {
        let slot1 = 0, slot2 = 0, slot3 = 0;
        try {
            let slots = await db.getAllSlots();
            slot1 = slots[0].seats;
            slot2 = slots[1].seats;
            slot3 = slots[2].seats;
           
            res.render('bookTable', { title: 'book table', slot1: slot1, slot2: slot2, slot3: slot3 });
        }
        catch (err) {
            res.send(err);
        }
    }



})


//var currentSeats = 0;
router.post("/reserve-table", urlencodedParser,
    [
        check('email', 'Please enter valid e-mail address').isEmail(),
        check('phone', 'Please enter 10 digit valid phone number').isNumeric().isLength({ min: 10, max: 10 })],
    async function (req, res) {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            var hours = req.body.hours;
            var email = req.body.email;
            var phone = req.body.phone;
            var seats = req.body.scount;
            let slot_id = 0;
            if (hours === "6:30PM - 8PM") { slot_id = 1; }
            else if (hours === "8:30PM - 10PM") { slot_id = 2; }
            else if (hours === "10PM - 12PM") { slot_id = 3; }
            if (slot_id === 1 || slot_id === 2 || slot_id === 3) {    //valid slot check
                try {
                    let results = await db.getSeatsBySlotName(hours);
                    if (seats > results[0].seats) {
                        res.render('successfullBooking', {
                            bookingStatus: '✖',
                            b_status: 'Failure',
                            s: 'Failed',
                            numOfSeats: results[0].seats
                        });
                    }
                    else {
                        let currentSeats = 0;
                        currentSeats = results[0].seats;
                        let minus = currentSeats - seats;

                        await db.insertIntoReserve(hours, slot_id, email, phone, seats);
                        await db.updateSlotSeatsAfterReserve(minus, hours);
                        res.render('successfullBooking', {
                            bookingStatus: '✓',
                            b_status: 'Success',
                            s: 'Successfull',
                            numOfSeats: -1
                        });
                    }
                }
                catch (err) {
                    res.send(err);
                }
            }
            else{
                res.redirect("/reserve-table");
            }
        }
        else{
            res.redirect('/reserve-table');
        }
    });


router.post("/feedback", function (req, res) {
    let feedString = req.body.feedback;
    db.connection.query(`insert into feedback (feedback) values (?)`, [feedString], function (err, results) {
        if (err) throw err;
    });
    res.redirect("/feedback");
});




//admin logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        else {
            res.redirect('/');
        }
    })
})


router.get('/products', async (req, res) => {
    let stor = [];
    try {
        let categories = await db.getAllCategory();

        for (const category of categories) {
            let cid = category.category_id;
            let products = await db.getProductByCid(cid);
            // if(products.length>0)
            stor.push(products);
        }
        res.render('menu', { title: 'User Menu', store: stor, categories: categories });
    }
    catch (err) {
        console.log('inside erro of getProducts');
        console.log(err);
    }

})


//exports.router=router;
//exports.isAuth=isAuth;
//module.exports = router;
module.exports = { router, isAuth };
//module.exports = {isAuth};