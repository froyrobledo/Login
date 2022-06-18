const express = require('express')
const { engine, hbs} =  require('express-handlebars')
const myconnection = require('express-myconnection')
const mysql = require('mysql')
const session = require('express-session')
const bodyParser = require('body-parser')
const morgan =require('morgan')
const loginRouter =require('./routes/login')
const app = express();
app.set('port', 4000);
app.use(morgan('dev'))

app.set('views', __dirname + '/views')
app.engine('.hbs', engine({
    extname: '.hbs',

}))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({
    extended: true 
}))
app.use(bodyParser.json())

app.use(myconnection(mysql,{
    localhost: 'localhost',
    user: 'root',
    password: '',
    port: '3306',
    database: 'loginnode'

}))

app.listen(app.get('port'), ()=>{
    console.log(`Example app listening on port`, app.get('port'));
})
app.use('/', loginRouter)

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))


app.get('/', (req, res)=>{
    res.render('home')
})