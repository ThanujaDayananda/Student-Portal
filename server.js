const express = require('express')
const app = express()
const mysql = require('mysql2')

app.set('view engine','ejs')
app.use(express.static('views'))
app.use(express.urlencoded({extended : false}))


 //_______________________________________
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '2405',
    database : 'student'
})

db.connect((err)=>{
    if(err){
        throw err
    }
    console.log("Database is connected successfully ")
})
 //_______________________________________

 app.get("/",(req,res)=>{
    res.render('intro',{ status : false });
  }).listen(5500);
  
  console.log("listening to port 5500");

 
 //_______________________________________

app.get('/registration', (req,res)=>{
    res.render('registration', { status : false })
})

app.post('/register', (req,res)=>{
    let post = {
        
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        gender: req.body.gender,
        email_address : req.body.email_address, 
        password : req.body.password
    }
    let sql = 'INSERT INTO students SET ?'
        let query = db.query(sql, post, (err, result)=>{
            //if(err) throw err
            if(err){
                if(err.errno === 1062)
                    res.render('registration', { status : true })
                else
                    throw err
            } else{
                res.redirect('/login')
                console.log(result)
            }
        })
})

 //_______________________________________


app.get('/login', (req,res)=>{
    res.render('login', { status : false })
})

app.post('/login',(req,res)=>{
    let sql = `SELECT * FROM students WHERE email_address = "${req.body.email_address}" AND password = "${req.body.password}" `
    let query = db.query(sql, (err, result)=>{
        if(err) throw err
        if(result.length > 0){
            const first_name = result[0].first_name
            res.redirect(`/home?info=${first_name}`)
            
        }
        else {
            res.render('login', { status : true })
            
        }
    })
})

//______________________________________

app.get('/home',(req,res)=>{
    const name = req.query.info
    res.render('home', { name : name });
})

  //_______________________________________



