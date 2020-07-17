

module.exports = (product, knex, jwt) => {

    //getting all product
    product.get('/products', (req, res) => {
        knex.select('*')
            .from('product')
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                console.log(err)
            })
    })

    //get product by search name of product or finding same thing in description
    product.get('/product/search', (req, res) => {
        let search = req.query.search;
        knex.select('*')
            .from('product')
            .where('name', 'like', '%' + search + '%')
            .orWhere('description', 'like', '%' + search + '%')
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                console.log(err)
            })
    })

    //get product by product id
    product.get('/product/:productID', (req, res) => {
        knex.select('*')
            .from('product')
            .where('product_id', req.params.productID)
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                console.log(err)
            })
    })

    //get product by category id
    product.get('/product/inCategory/:categoryID', (req, res) => {
        knex.select('*')
            .from('product')
            .join('product_category', function () {
                this.on('product.product_id', 'product_category.category_id')
            })
            .where('product_category.category_id', req.params.categoryID)
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                console.log(err)
            })
    })

    //get product by department id
    product.get('/product/inDepartment/:departmentID', (req, res) => {
        knex
            .select('*')
            .from('product')
            .join('product_category', function () {
                this.on('product.product_id', 'product_category.product_id')
            })
            .join('category', function () {
                this.on('product_category.category_id', 'category.category_id')
            })
            .where('department_id', req.params.departmentID)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                console.log(err)
            })
    })

    //get product details by product id
    product.get('/product/:productID/details', (req, res) => {
        knex
            .select(
                'name',
                'description',
                'price',
                'discounted_price',
                'image',
                'image_2'
            )
            .from('product')
            .where('product_id', req.params.productID)
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                console.log(err)
            })
    })

    //get product location from where it is belong by entering product id
    product.get('/product/:productID/location', (req, res) => [
        knex
            .select(
                'category.category_id',
                'category.name as category_name',
                'category.department_id',
                'department.name as department_name'
            )
            .from('category')
            .join('product_category', function () {
                this.on('category.category_id', 'product_category.   category_id')
            })
            .join('department', function () {
                this.on('category.department_id', 'department.department_id')
            })
            .where('product_id', req.params.productID)
            .then((data) => {
                console.log(data);
                res.json(data);
            })
            .catch((err) => {
                console.log(err)
            })
    ])

    //get reviews
    product.get('/products/:productID/reviews',(req,res)=>{
        knex.select(
            'customer.name',
            'review',
            'rating',
            'review.created_on'
        )
        .from('review')
        .join('customer',function(){
            this.on('review.customer_id','customer.customer_id')
        })
        .where('product_id',req.params.productID)
        .then((data)=>{
            console.log(data)
            res.send(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    //post a review
    product.post('/products/:productID/reviews', (req, res) => {
        if (req.headers.cookie !== undefined && req.headers.cookie !== '') {
            let token = (req.headers.cookie).slice(6)
            jwt.verify(token, 'sushant', (err, decoded_data) => {
                if (!err) {
                    knex('review')
                        .insert({
                            'customer_id': decoded_data.id,
                            'review': req.body.review,
                            'rating': req.body.rating,
                            'product_id': req.body.product_id,
                            'created_on': new Date()
                        })
                        .then((data) => {
                            console.log('review is created')
                            res.send('review is created')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
                else {
                    res.send("please login")
                }
            })

        }
        else {
            res.send("please log in")
        }
    })

}