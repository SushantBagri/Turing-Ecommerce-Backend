module.exports=(tax,knex)=>{
    tax.get('/tax',(req,res)=>{
        knex.select('*')
        .from('tax')
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    //tax by tax id
    tax.get('/tax/:taxID',(req,res)=>{
        knex.select('*')
        .from('tax')
        .where('tax_id',req.params.taxID)
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })
}