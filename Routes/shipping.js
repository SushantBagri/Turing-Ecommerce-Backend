module.exports=(shipping,knex)=>{
    shipping.get('/shipping/regions',(req,res)=>{
        knex.select('*')
        .from('shipping_region')
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    //get data by region id
    shipping.get('/shipping/regions/:shipping_region_id',(req,res)=>{
        knex.select('*')
        .from('shipping')
        .where('shipping_region_id',req.params.shipping_region_id)
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })
}