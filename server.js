require('./db/mongoose.js')
const blogs= require('./models/blogs.js')
const User= require('./models/users.js')
const path=require('path')
const express=require('express')
const hbs=require('hbs')
const app=express();
const port=2000;

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(__dirname+'/templates/frontend'))

const viewpath = path.join(__dirname,'/templates/frontend')
app.set('views', viewpath);

const partialspath=path.join(__dirname, '/templates/partials')
hbs.registerPartials(partialspath);

app.get('/signup', async(req, res)=>{
    try{
        msg=req.query.msg
        res.render('signup.hbs', {msg})
    }catch{
        res.status(400).send('it is in catch')
    }
})

app.post('/signup', (req, res)=>{
    u1= new User({
        name: req.body.user,
        email: req.body.email,
        password: req.body.pass
    })
    u1.save().then((value)=>{
        res.redirect(`/myapp/${value._id}?skip=0`);
    }).catch((err)=>{
        console.log(err)
        res.redirect('/signup?msg='+err.errmsg)
    })
})

app.get('/login', async(req, res)=>{
    try{
        msg=req.query.msg
        res.render('login.hbs', {msg})
    }catch{
        res.redirect('/login/something went wrong');
    }
})

app.post('/login', async(req, res)=>{
    try{
        const u1=await User.findOne({email: req.body.email, password: req.body.pass})
        if(u1.name){
            return res.redirect(`/myapp/${u1._id}?skip=0`);
        }
    }catch{
        res.redirect('/login?msg=login credentials did not match');
    }
})

app.get('/myapp/:user_id', async (req, res)=>{
    try{
        let frwd=req.query.skip
        let user_id=req.params.user_id
        if(frwd<0){
            return res.send("skip cannot be negative")
        }
        const data=await blogs.find({author_id: user_id},'title description', {limit:5, skip:parseInt(frwd), sort:{_id:-1}})
        res.render('index.hbs', {data, frwd, user_id})
    } catch{
        res.status(400).send()
    }
})

app.post('/server/:user_id', async (req, res)=>{
    try{
        const data= await blogs.updateMany({title: req.body.blog}, {description: req.body.describe}, {author_id: req.params.user_id})
        res.redirect(`/myapp/${req.params.user_id}?skip=0`);
    }catch{
        res.status(400).send();
    }
})

app.post('/server/add/:user_id', async(req, res)=>{
    try{
        let b1=new blogs({
            author_id: req.params.user_id,
            title:req.body.blog,
            description: req.body.describe
        })
        b1.save()
        res.redirect(`/myapp/${req.params.user_id}?skip=0`)
    } catch{
        res.status(400).send()
    }
})

app.get('*', (req, res)=>{
    res.send('404 page');
})

app.listen(port, ()=>{
    console.log(`server is running on 127.0.0.1:${port}`)
});
