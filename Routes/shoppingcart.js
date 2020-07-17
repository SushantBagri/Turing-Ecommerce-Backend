const { text } = require("body-parser");

module.exports = (shoppingcart, knex) => {
    shoppingcart.get('/shoppingcart/genrateUniqueId', (req, res) => {
        let key = '';
        let stock = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        for (let i = 0; i < 11; i++) {
            key += stock.charAt(Math.floor(Math.random() * stock.length))
        }
        res.send({
            "cart_id": key
        })
    })

    //adding a item in cart
    shoppingcart.post('/shoppingcart/add', (req, res) => {
        knex
            .select('quantity')
            .from('shopping_cart')
            .where('cart_id', req.body.cart_id)
            .andWhere('product_id', req.body.product_id)
            .andWhere('attributes', req.body.attributes)
            .then((result) => {
                if (result.length < 1) {
                    knex('shopping_cart')
                        .insert({
                            'cart_id': req.body.cart_id,
                            'attributes': req.body.attributes,
                            'product_id': req.body.product_id,
                            'added_on': new Date(),
                            'quantity': 1
                        })
                        .then((result) => {
                            knex.select(
                                'name',
                                'price',
                                'image',
                                'cart_id',
                                'attributes',
                                'shopping_cart.product_id',
                                'quantity'
                            )
                                .from('shopping_cart')
                                .join('product', function () {
                                    this.on('shopping_cart.product_id', 'product.product_id')
                                })
                                .then((data) => {
                                    data[0]["subtotal"] = data[0]['price'] * data[0]['quantity']
                                    console.log(data[0])
                                    res.send(data[0])
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        })
                }
                else {
                    knex('shopping_cart')
                        .update({quantity: result[0].quantity + 1})
                        .where('cart_id', req.body.cart_id)
                        .andWhere('product_id', req.body.product_id)
                        .andWhere('attributes', req.body.attributes)
                        .then((data_1)=>{
                            knex.select(
                                'name',
                                'price',
                                'image',
                                'cart_id',
                                'attributes',
                                'shopping_cart.product_id',
                                'quantity'
                            )
                                .from('shopping_cart')
                                .join('product', function () {
                                    this.on('shopping_cart.product_id', 'product.product_id')
                                })
                                .then((data2) => {
                                    data2[0]["subtotal"] = data2[0]['price'] * data2[0]['quantity']
                                    console.log(data2[0])
                                    res.send(data2[0])
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        })
                        .catch((err)=>{
                            console.log(err)
                        })
                }
            })
            .catch((err) => {
                console.log(err)
            })

    })

    //getting list of product by cart id
    shoppingcart.get('/shoppingcart/:cardID',(req,res)=>{
        knex.select(
            'item_id',
            'name',
            'price',
            'image',
            'attributes',
            'shopping_cart.product_id',
            'quantity'
        )
            .from('shopping_cart')
            .join('product', function () {
                this.on('shopping_cart.product_id', 'product.product_id')
            })
            .where('cart_id',req.params.cardID)
            .then((data) => {
                data[0]["subtotal"] = data[0]['price'] * data[0]['quantity']
                console.log(data[0])
                res.send(data[0])
            })
            .catch((err) => {
                console.log(err)
            })
    })

    //update an item by his item id
    shoppingcart.put('/shoppingcart/update/:itemID',(req,res)=>{
        knex('shopping_cart')
        .update('quantity',req.body.quantity)
        .where('item_id',req.params.itemID)
        .then((data)=>{
            knex.select(
                'item_id',
                'name',
                'price',
                'attributes',
                'shopping_cart.product_id',
                'quantity'
            )
                .from('shopping_cart')
                .join('product', function () {
                    this.on('shopping_cart.product_id', 'product.product_id')
                })
                .where('item_id',req.params.itemID)
                .then((data) => {
                    data[0]["subtotal"] = data[0]['price'] * data[0]['quantity']
                    console.log(data[0])
                    res.send(data[0])
                })
                .catch((err) => {
                    console.log(err)
                })
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    //delete a cart by its id
    shoppingcart.delete('/shoppingcart/empty/:cartID',(req,res)=>{
        knex('shopping_cart')
        .delete()
        .where('cart_id',req.params.cartID)
        .then((data)=>{
            console.log('cart is delted successfully')
            res.send('cart is delted')
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    //get total amount of all your products
    shoppingcart.get('/shoppingcart/totalAmount/:cartID',(req,res)=>{
        knex
        .select('price','quantity')
        .from('shopping_cart')
        .join('product',function(){
            this.on('shopping_cart.product_id','product.product_id')
        })
        .where('cart_id',req.params.cartID)
        .then((data)=>{
            let totalAmount=0
            for(i of data){
                totalAmount+=i.price*i.quantity
            }
            console.log(totalAmount)
            res.send({'total_amount':totalAmount})
        })
        .catch((err)=>{
            console.log(err)
        })
    })
    
    //delete a item from a cart by item_id
    shoppingcart.delete('/shoppingcart/removeProduct/:itemID',(req,res)=>{
        knex('shopping_cart')
        .delete()
        .where('item_id',req.params.itemID)
        .then((data)=>{
            console.log('item is removed')
            res.send({'message':'item is deleted'})
        })
        .catch((err)=>{
            console.log(err)
        })
    })
}