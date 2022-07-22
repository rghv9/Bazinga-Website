var express = require('express');
var router = express.Router();
var db = require('../database');
var page = require('./pages');

router.get('/', page.isAuth, async (req, res) => {
    let slots = await db.getAllSlots();
    let reservations = await db.getAllReservations();
    let bseatsA = 16 - slots[0].seats;
    let bseatsB = 16 - slots[1].seats;
    let bseatsC = 16 - slots[2].seats;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');  
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    let current_date = mm + '/' + dd + '/' + yyyy;
    let trsf = reservations.length; //total reservations so far

    res.render('adminReservationPage', {
        title: 'Admin Reservations',
        reservations,
        slots,
        bseatsA,
        bseatsB,
        bseatsC,
        trsf,
        current_date
    });
})


router.get('/unreserve-booking/:id', page.isAuth, async (req, res) => {
    let id = req.params.id;
    try {
        let r_details = await db.getReservationById(id);
        await db.deleteReservationById(id);
        await db.updateSlotSeatCountUnreserve(r_details[0].slot_id, r_details[0].seats);
        res.redirect('/admin/reservations');
    }
    catch (err) {
        res.send(err);
    }

})



//exports
module.exports = router;