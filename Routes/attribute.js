module.exports=(attribute,knex)=>{
    //getting attribute
    attribute.get('/attribute',(req,res)=>{
        knex.select('*')
        .from('attribute')
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    //attribute get by id
    attribute.get('/attribute/:attribute_id',(req,res)=>{
        knex.select('*')
        .from('attribute')
        .where('attribute_id',req.params.attribute_id)
        .then((data)=>{
            res.json(data)
            console.log(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    //get attribute value
    attribute.get('/attribute/values/:attribute_id',(req,res)=>{
        knex
        .select('attribute_value_id','value')
        .from('attribute_value')
        .where('attribute_id',req.params.attribute_id)
        .then((data)=>{
            res.json(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    //route for getting attribute_value attribute_value attribute_id by prorduct_id
    attribute.get('/attribute/inProduct/:product_id',(req,res)=>{
        knex
        .select('*')
        .from('attribute')
        .join('attribute_value',function(){
            this.on('attribute.attribute_id','attribute_value.attribute_id')
        })
        .join('product_attribute',function(){
            this.on('attribute_value.attribute_value_id','product_attribute.attribute_value_id')
        })
        .where('product_id',req.params.product_id)
        .then((data)=>{
            result=[]
            for(let i of data){
                result.push({
                    'attribute_name':i.name,
                    'attribute_value_id':i.attribute_value_id,
                    'attribute_value':i.value
                })
            }
            res.send(result)
        })
        .catch((err)=>{
            console.log(err)
        })
    })
}