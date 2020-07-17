const express=require('express');
const app=express();
const mysql= require('mysql');
const jwt =require('jsonwebtoken');
const bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

var knex=require('knex')({
    client:'mysql',
    connection:{
        host : 'localhost',
        user : 'sushant',
        password : 'password',
        database : 'turing'
    }
})

const port=3030;


//for departments
let department=express.Router();
app.use('/',department)
require('./Routes/department')(department,knex)


//for categories
let categories=express.Router();
app.use('/',categories)
require('./Routes/categories')(categories,knex)

//for attribute
let attribute=express.Router();
app.use('/',attribute)
require('./Routes/attribute')(attribute,knex)


//for tax
let tax=express.Router()
app.use('/',tax);
require('./Routes/tax')(tax,knex)


//for shipping
let shipping=express.Router()
app.use('/',shipping);
require('./Routes/shipping')(shipping,knex)

//for product
let product=express.Router()
app.use('/',product);
require('./Routes/products')(product,knex,jwt)

//for Customer
let customer=express.Router()
app.use('/',customer);
require('./Routes/customer')(customer,knex,jwt)


// for shoppingcart
let shoppingcart=express.Router()
app.use('/',shoppingcart);
require('./Routes/shoppingcart')(shoppingcart,knex)


//for orders
let order=express.Router()
app.use('/',order);
require('./Routes/orders')(order,knex,jwt)


app.listen(port,()=>{
    console.log(`your app is running ${port} at port`)
})