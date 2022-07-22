const mysql = require('mysql2');

//create connection
var option = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "bazinga"
};
const connection = mysql.createConnection(option);



function checkAdmin(email,password){
  return new Promise(function (resolve, reject) { 
    connection.query(
      `SELECT * FROM ADMIN where email =? AND password =?`,[email,password],
      function(err, results){
        if(err) {
          reject(err);}
        else {
          resolve(results);
        }
      }
    )
   })
}

function getAllFeedbacks() {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT * FROM FEEDBACK  ORDER BY date DESC LIMIT 5`,
      function (err, results) {
        if (err) {
          reject(err);
        }
        else {
          resolve(results);
        }
      }
    )
  })
}

function getAllProducts() {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT * FROM product inner join category where product.product_category_id = category.category_id`,
      function (err, results) {
        if (err) {
          reject(err);
        }
        else {
          resolve(results);
        }
      }
    )
  })
}

function addProduct(image, title, price, category, desc, available) {
  return new Promise(function (resolve, reject) {
    connection.query(
      `INSERT INTO PRODUCT(product_image, product_title, product_price, product_category_id, product_desc,available) 
      VALUES(?,?,?,?,?,?)`,
      [image, title, price, category, desc, available],
      function (err, results) {
        if (err) reject(err);
        else resolve();
      }
    )
  })
}

function getAllCategory() {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT * FROM CATEGORY`,
      function (err, results) {
        if (err) reject(err);
        else resolve(results);
      }
    )
  })
}

function getProductByCid(id) {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT * FROM PRODUCT where product_category_id = ${id}`,
      function (err, results) {
        if (err) reject(err);
        else resolve(results);
      }
    )
  })
}


function getProductFindById(id) {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT * FROM PRODUCT WHERE product_id = ${id}`,
      function (err, results) {
        if (err) reject(err);
        else resolve(results);
      }
    )
  })
}

function updateProduct(id, image, title, price, category, desc, available) {
  return new Promise(function (resolve, reject) {
    connection.query(
      `UPDATE PRODUCT SET product_image  = ?, product_title = ?, product_price = ?, product_category_id = ?, product_desc = ?, available = ? where product_id = ?`,
      [image, title, price, category, desc, available, id],
      function (err, results) {
        if (err) reject(err);
        else resolve(results);
      }
    )
  })
}

function deleteProductById(id) {
  return new Promise(function (resolve, reject) {
    connection.query(
      `DELETE FROM PRODUCT WHERE product_id = '${id}'`,
      function (err, results) {
        if (err) {
          reject(err);
        }
        else resolve();
      }
    )
  })
}


function getAllSlots() {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT * FROM slots`,
      function (err, results) {
        if (err) reject(err);
        else resolve(results);
      }
    )
  })
}


function getAllReservations() {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT * FROM reserve order by reservation_id desc limit 48`,
      function (err, results) {
        if (err) reject(err);
        else resolve(results);
      }
    )
  })
}


function deleteReservationById(id) {
  return new Promise(function (resolve, reject) {
    connection.query(
      `DELETE FROM reserve WHERE reservation_id = '${id}'`,
      function (err, results) {
        if (err) {
          reject(err);
        }
        else resolve(results);
      }
    )
  })
}

function getReservationById(id) {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT * FROM reserve WHERE reservation_id = '${id}'`,
      function (err, results) {
        if (err) {
          reject(err);
        }
        else resolve(results);
      }
    )
  })
}

function updateSlotSeatCountUnreserve(slot_id, seats) {
  return new Promise(function (resolve, reject) {
    connection.query(
      `UPDATE slots SET seats = seats + ? WHERE slot_id = ?;`,
      [seats, slot_id],
      function (err, results) {
        if (err) {
          reject(err);
        }
        else resolve(results);
      }
    )
  })
}

function insertIntoReserve(hours,slot_id,email,phone,seats){
  return new Promise(function(resolve,reject){

      if(seats)

      connection.query(`INSERT INTO reserve (slot,slot_id,email,phone,seats) VALUES (?,?,?,?,?)`,
      [hours,slot_id,email,phone,seats],
      function (err, results) {
          if (err) {
            reject(err);
          }
          else resolve(results);
        })
  })
}

function getSeatsBySlotName(hours){
  return new Promise(function(resolve,reject){
      connection.query(`select seats from slots where slot_name='${hours}'`,
      
      function (err, results) {
          if (err) {
            reject(err);
          }
          else resolve(results);
        })
  })
}

function updateSlotSeatsAfterReserve(minus,hours){
  return new Promise(function(resolve,reject){
      connection.query(`UPDATE slots SET seats= ? where slot_name= ?`,
      [minus,hours],
      function (err, results) {
          if (err) {
            reject(err);
          }
          else resolve(results);
        })
  })
}


function revertSlots() {
  return new Promise(function (resolve, reject) {
    connection.query(
      `UPDATE slots SET seats = 16 WHERE slot_id in (1,2,3);`,
      function (err, results) {
        if (err) {
          reject(err);
        }
        else resolve(results);
      }
    )
  })
}

function emptyReservations() {
  return new Promise(function (resolve, reject) {
    connection.query(
      `TRUNCATE reserve;`,
      function (err, results) {
        if (err) {
          reject(err);
        }
        else resolve(results);
      }
    )
  })
}

module.exports = {
  getAllFeedbacks,
  connection,
  getAllProducts,
  addProduct,
  getAllCategory,
  getProductFindById,
  updateProduct,
  deleteProductById,
  getProductByCid,
  getAllSlots,
  getAllReservations,
  deleteReservationById,
  getReservationById,
  updateSlotSeatCountUnreserve,
  checkAdmin,
  option,
  insertIntoReserve,
  getSeatsBySlotName,
  updateSlotSeatsAfterReserve,
  revertSlots,
  emptyReservations
}



