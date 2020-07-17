module.exports=(categories,knex)=>{

    //route for get all categories
    categories.get('/categories',(req,res)=>{
        knex.select('*')
        .from('category')
        .then((data)=>{
            res.json(data)
            console.log(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    //route for getting category by categories id
    categories.get('/categories/:id',(req,res)=>{
        knex.select('*')
        .from('category')
        .where('category_id',req.params.id)
        .then((data)=>{
            res.json(data)
            console.log(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    //routes for getting categories of products
    categories.get('/categories/inProducts/:productID',(req,res)=>{
        knex.select('category.category_id','name','department_id')
        .from('category')
        .join('product_category',function(){
            this.on('category.category_id','product_category.product_id')
        })
        .where('product_category.product_id',req.params.productID)
        .then((data)=>{
            res.json(data)
            console.log(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    //route of getting category by department id
    categories.get('/categories/inDepartment/:departmentID',(req,res)=>{
        knex.select('*')
        .from('category')
        .where('department_id',req.params.departmentID)
        .then((data)=>{
            res.json(data)
            console.log(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    


}