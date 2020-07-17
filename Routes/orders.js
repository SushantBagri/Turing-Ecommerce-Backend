const { decode } = require("jsonwebtoken");

module.exports = (order, knex, jwt) => {
    order.post('/orders', (req, res) => {
        if (req.headers.cookie !== undefined && req.headers.cookie !== '') {
            let token = (req.headers.cookie).slice(6);
            jwt.verify(token, 'sushant', (err, decoded_data) => {
                if (!err) {
                    knex
                        .select('')
                        .from('shopping_cart')
                        .where('cart_id', req.body.cart_id)
                        .join('product', function () {
                            this.on('shopping_cart.product_id', 'product.product_id')
                        })
                        .then((data) => {
                            knex('orders')
                                .insert({
                                    'total_amount': data[0].price * data[0].quantity,
                                    'created_on': new Date(),
                                    'customer_id': decoded_data.id,
                                    'shipping_id': req.body.shipping_id,
                                    'tax_id': req.body.tax_id
                                })
                                .then((data1) => {
                                    knex('order_detail')
                                        .insert({
                                            'order_id': data1[0],
                                            'product_id': data[0].product_id,
                                            'attributes': data[0].attributes,
                                            'product_name': data[0].name,
                                            'quantity': data[0].quantity,
                                            'unit_cost': data[0].price
                                        })
                                        .then((data2) => {
                                            knex('shopping_cart')
                                                .delete()
                                                .where('cart_id', req.body.cart_id)
                                                .then((data3) => {
                                                    res.send({ 'order_id': data1[0] })
                                                })
                                                .catch((err) => {
                                                    console.log(err)
                                                })
                                        })
                                        .catch((err) => {
                                            console.log(err)
                                        })
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
                else {
                    res.sendStatus(401)
                }
            })
        }
        else {
            res.sendStatus(401)
        }
    })
    //get orders detaiasil by order id
    order.get('/orders/:orderID',(req,res)=>{
        if(req.headers.cookie!==undefined && req.headers.cookie!==''){
            let token=(req.headers.cookie).slice(6)
            jwt.verify(token,'sushant',(err,decoded_data)=>{
                knex
                .select('*')
                .from('order_detail')
                .where('order_id',req.params.orderID)
                .then((data)=>{
                    delete data[0].item_id;
                    data[0]["subtotal"]=data[0].unit_cost*data[0].quantity;
                    console.log(data);
                    res.send(data)
                })
                .catch((err)=>{
                    console.log(err)
                })
            })
        }
        else{
            res.sendStatus(401)
        }
    })

    //get orders by customer
    order.get('/orders/inCustomers/detail', (req, res) => {
        if (req.headers.cookie !== undefined && req.headers.cookie !== '') {
            let token = (req.headers.cookie).slice(6);
            jwt.verify(token, 'sushant', (err, decoded_data) => {
                if (!err) {
                    knex.select('*')
                        .from('orders')
                        .where('customer_id', decoded_data.id)
                        .then((data) => {
                            console.log(data);
                            res.send(data)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
                else {
                    res.sendStatus(401)
                }
            })
        }
        else {
            res.sendStatus(401)
        }
    })

    //get short detials of order
    order.get('/orders/shortDetail/:orderID', (req, res) => {
        if (req.headers.cookie !== undefined && req.headers.cookie !== '') {
            let token = (req.headers.cookie).slice(6)
            jwt.verify(token, 'sushant', (err, decoded_data) => {
                if (!err) {
                    knex
                        .select('orders.order_id',
                            'total_amount',
                            'created_on',
                            'shipped_on',
                            'status',
                            'order_detail.product_name as name')
                        .from('orders')
                        .join('order_detail', function () {
                            this.on('orders.order_id', 'order_detail.order_id')
                        })
                        .where('orders.order_id',req.params.orderID)
                        .then((data) => {
                            res.send(data)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
                else {
                    res.sendStatus(401)
                }
            })
        }
        else {
            res.sendStatus(401)
        }
    })
}