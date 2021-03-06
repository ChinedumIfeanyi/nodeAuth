const { Schema, model } = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


const UserSchema = new Schema({
	name: String,
	username: String,
	email: String,
	password: String
}, {
	timestamps: true
})

UserSchema.plugin(passportLocalMongoose)

module.exports = model('User', UserSchema)