const { decode } = require("jsonwebtoken");

module.exports = (customer, knex, jwt) => {
    //update customer
    customer.put('/customer', (req, res) => {
        if (req.headers.cookie !== undefined && req.headers.cookie !== '') {
            let token=(req.headers.cookie).slice(6)
            jwt.verify(token, 'sushant', (err, decode_data) => {
                if (!err) {
                    let user = req.body;
                    knex('customer')
                        .update({
                            'name': user.name,
                            'email': user.email,
                            'password': user.password,
                            'day_phone': user.day_phone,
                            'eve_phone': user.eve_phone,
                            'mob_phone': user.mob_phone
                        })
                        .where('customer_id', decode_data.id)
                        .then((data) => {
                            res.json({ message: 'data is inserted' })
                            console.log('customer is updated')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
                else {
                    res.json({ message: 'need to login' })
                }
            })
        }
        else {
            res.json({ message: 'need to login' })
        }
    })

    //get customer by id(from token)
    customer.get('/customer', (req, res) => {
        if (req.headers.cookie !== undefined && req.headers.cookie !== '') {
            let token=(req.headers.cookie).slice(6)
            jwt.verify(token, 'sushant', (err, decoded_data) => {
                if (!err) {
                    knex
                        .select('*')
                        .from('customer')
                        .where('customer_id', decoded_data.id)
                        .then((data) => {
                            res.json(data);
                            console.log(data)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
                else {
                    res.json({ message: 'need to login' })
                }
            })
        }
        else {
            res.json({ message: 'need to login' })
        }
    })

    //register a customer
    customer.post('/customers', (req, res) => {
        console.log(req.body)
        knex
            .select('*')
            .from('customer')
            .where('email', req.body.email)
            .then((data) => {
                if (data.length < 1) {
                    knex('customer')
                        .insert(req.body)
                        .then((result) => {
                            knex
                                .select('*')
                                .from('customer')
                                .where('email', req.body.email)
                                .then((data) => {
                                    delete data[0].password
                                    let accessToken = jwt.sign({ id: data[0].customer_id, name: data[0].name }, 'sushant', { expiresIn: "24h" });
                                    let userData = { 'customer': { 'schema': data[0] }, 'accessToken': accessToken, 'expires_in': "24h" }
                                    res.send(userData)
                                    console.log(userData)
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
                    res.json({ message: 'go to login' })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    })

    //customer login
    customer.post('/customer/login', (req, res) => {
        knex
            .select('*')
            .from('customer')
            .where('email', req.body.email)
            .then((data) => {
                if (data.length > 0) {
                    if (data[0].password === req.body.password) {
                        let token = jwt.sign({ id: data[0].customer_id, name: data[0].name }, 'sushant', { expiresIn: "24h" })
                        delete data[0].password;
                        let userData = { "customer": { "schema": data }, "accessToken": token, "expires_in": "24h" }
                        res.cookie("token", token).send(userData)
                    }
                    else {
                        res.send({ "message": "password is incorrect" })
                    }
                }
                else {
                    res.send({ "message": "email is not exist" })
                }
            })
    })

    //Updating customer adress
    customer.put('/customer/address', (req, res) => {
        if (req.headers.cookie !== undefined && req.headers.cookie !== '') {
            let token=(req.headers.cookie).slice(6);
            jwt.verify(token, 'sushant', (err, decoded_data) => {
                if (!err) {
                    knex('customer')
                    .update({
                        'address_1': req.body.address_1,
                        'address_2': req.body.address_2,
                        'city': req.body.city,
                        'region': req.body.region,
                        'postal_code': req.body.postal_code,
                        'country': req.body.country,
                        'shipping_region_id': req.body.shipping_region_id
                    })
                    .where('customer_id', decoded_data.id)
                    .then((data) => {
                        knex
                        .select('*')
                        .from('customer')
                        .where('customer_id',decoded_data.id)
                        .then((result)=>{
                            delete result[0].password
                            res.send(result[0])
                        })
                        .catch((err)=>{
                            console.log(err)
                        })

                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }
                else{
                    res.send({"message":"need to logn"})
                }
            })
        }
        else {
            res.send({ "message": "need to login" })
        }
    })

    //updating customer credit card details
    customer.put('/customer/creditCard',(req,res)=>{ 
        if(req.headers.cookie!==undefined && req.headers.cookie!==''){
            let token=(req.headers.cookie).slice(6);
            jwt.verify(token,'sushant',(err,decoded_data)=>{
                knex('customer')
                .update({
                    'credit_card': req.body.credit_card
                })
                .where('customer_id',decoded_data.id)
                .then((data)=>{
                    knex
                    .select('*')
                    .from('customer')
                    .where('customer_id',decoded_data.id)
                    .then((result)=>{
                        delete result[0].password;
                        res.send(result[0])
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                })
                .catch((err)=>{
                    console.log(err)
                })
            })
        }
        else{
            res.send({"message":"need to login"})
        }
    })

}