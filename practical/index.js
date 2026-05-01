const express = require('express')
const session = require('express-session')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:'mysecretkey',
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}
}))

const USER = {username:'admin' , password:'1234'}

function checkLogin(req,res,next){
    if(req.session.user){
        next()
    }else{
        res.send('please login first')
    }
}

app.post('/login' , (req,res)=>{
    const username = req.body.username
    const password = req.body.password

    if(username == USER.username && password == USER.password){
        req.session.user = username
        res.send('Login Successful')
    }
    else{
        res.send('Invalid Credentials')
    }
})

app.get('/dashboard',checkLogin,(req,res)=>{
    res.send("welcome to the dashboard,"+req.session.user)
})

app.get('/logout',(req,res)=>{
    req.session.destroy()
    res.send('logged out successfully')
})
app.listen(3000,()=>{
    console.log('server is running on port 3000')
})








































