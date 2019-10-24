const express=require('express')
const router=new express.Router()
require('../db/mongoose.js')
const blogs= require('../models/blogs.js')

router.get('/myapp', async (req, res)=>{
    try{
        const data=await blogs.find({})
        res.render('index.hbs', {data})
    } catch{
        res.status(400).send()
    }
})

router.post('/server', async (req, res)=>{
    try{
        blogs.findOneAndUpdate({title: req.body.blog}, {description: req.body.describe}, ()=>{
        console.log('1 document is updated')
        res.redirect('/myapp');
        })
    }catch{
        res.status(400).send();
    }
})

router.get('*', (req, res)=>{
    res.send('404 page');
})

module.exports=router