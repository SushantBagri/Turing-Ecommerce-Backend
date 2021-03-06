module.exports=(department,knex)=>{
    department.get('/departments',(req,res)=>{
        knex
        .select('*')
        .from('department')
        .then((data)=>{
            res.json({department:data})
            console.log(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    department.get('/departments/:id',(req,res)=>{
        knex
        .select('*')
        .from('department')
        .where({department_id:req.params.id})
        .then((data)=>{
            res.json(data)
            console.log(data)
        })
        .catch((err)=>{
            console.log(err)
        })
        
    })
}