const express = require('express'),
			bodyParser = require('body-parser'),
			mongoose = require('mongoose'),
			dotenv = require('dotenv'),
			cors = require('cors'),
			passport = require('passport'),		
			jwt = require('jsonwebtoken')

let config = require('./config/utils')
let User = require('./model/user')
const authenticate = require('./config/passport')

dotenv.config()

const PORT = config.port || 5500

//initialize server
let app = express()

//database connection
mongoose.connect(	config.db,
	{useNewUrlParser: true}, (err, db)=>{
 if(err){
 	console.log(err)
 }else{
 	console.log('database connected')
 }
})

app.use(cors() )
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: false
}))


app.use(passport.initialize() )



app.post('/register', (req,res)=>{

	User.findOne({email: req.body.email}, (err,user)=>{
		if(err){
			throw err
		}
		if(user) {
			res.json({message: 'user already exists'})
		}else{
			User.register(new User({
				name: req.body.name,
				username: req.body.username,
				email: req.body.email
			}), req.body.password, (err,user)=>{
				if(err) {
					throw err
				}else{
					passport.authenticate('local')(req,res,()=>{
						return res.json({
							message: "User registered"
						})
					})
				}
			})
		}
	})

})

app.post("/login", (req,res)=>{
	passport.authenticate('local')(req,res, ()=>{

		const payload = {
			id: req.user._id,
			name: req.user.username
		}
		jwt.sign(payload, config.secret, (err,token) =>{
			if(err) {
				throw err
			}else{
				return res.json({
					message: "Login Success",
					token
				})
			}
		})
	})
})

app.get("/secure",authenticate.verifyUser, (req,res)=>{
	return res.json({
		message: 'User verified'
	})
})

app.listen(PORT, ()=>{
	console.log(`server booted @ ${PORT}`)
})