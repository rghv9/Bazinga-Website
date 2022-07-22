var express = require('express');
var router = express.Router();
var db = require('../database');
var page = require('./pages');



router.get('/',page.isAuth, (req, res) => {
    db.getAllProducts()
        .then((products) => {
            res.render('adminProductPage',
                {
                    items: products,
                    title: 'Admin Products'
                })
        }).catch((err) => {
            res.send(err);
        })
})

router.get('/add-product',page.isAuth,  (req, res) => {
    db.getAllCategory()
        .then((category) => {
            res.render('adminAddProductPage',
                {
                    title: 'Admin AddProduct',
                    categories: category
                })
        }).catch((err) => {
            res.send(err);
        })
})

router.post('/add-product',page.isAuth,  (req, res) => {
    if(req.body.title==='' || req.body.category==='' || req.body.price === ''){
        res.redirect('/admin/products/add-product');
    }
    else{
        db.addProduct(req.body.image, req.body.title, req.body.price, req.body.category, req.body.desc, req.body.available)
        .then(() => {
            res.redirect('/admin/products');
        }).catch((err) => {
            res.send(err);
        })
    }
    
});



router.get('/edit-product/:id',page.isAuth,  (req, res) => {
    let id = req.params.id;
    db.getAllCategory()
        .then((categories) => {
            db.getProductFindById(id)
                .then((product) => {

                    let category_name = "unknown";
                    let category_id = '0';
                    for (let i = 0; i < categories.length; i++) {

                        if (categories[i].category_id === product[0].product_category_id) {
                            category_name = categories[i].category_name;
                            category_id = categories[i].category_id;
                        }
                    }
                    res.render('adminEditProductPage', {
                        product_id: id,
                        title: 'Admin EditProduct',
                        product_title: product[0].product_title,
                        imgs : product[0].product_image,
                        price : product[0].product_price,
                        desc: product[0].product_desc,
                        category_name,
                        category_id,
                        categories
                    })
                })
                .catch((err) => {
                    res.send(err);
                })
        }).catch((err) => {
            res.send(err);
        })
})

router.post('/edit-product/:id', page.isAuth, (req, res) => {
    if(req.body.title==='' || req.body.category==='' || req.body.price === ''){
        let url = `/admin/products/edit-product/${req.params.id}`;
        res.redirect(url);
    }
    else{
        db.updateProduct(req.params.id, req.body.image, req.body.title, req.body.price, req.body.category, req.body.desc,req.body.available)
        .then(() => {
            res.redirect('/admin/products');
        }).catch((err) => {
            res.send(err);
        })
    }
    
})


router.get('/delete-product/:id',page.isAuth,  (req, res) => {
    let id = req.params.id;
    db.deleteProductById(id)
    .then(()=>{
        res.redirect('/admin/products')
    }).catch((err)=>{
        res.send(err);
    })
})



//exports
module.exports = router;