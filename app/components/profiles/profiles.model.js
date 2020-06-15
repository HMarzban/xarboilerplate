const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { SALTROUNDS } = process.env

const profilesSchema = new mongoose.Schema(
	{
		phone: { type: String, unique: true, index: 1 },
		email: { type: String },
		userName: { type: String },
		name: { type: String },
		password: { type: String },
	},
	{
		timestamps: true,
	},
)

profilesSchema.statics.PROJECT = {
	TOKEN: { password: 0 },
}

profilesSchema.pre("save", function (next) {
	const hashPassword = bcrypt.hashSync(this.password, +SALTROUNDS)
	if (this.password && this.password !== hashPassword) this.password = hashPassword
	next()
})

const Profiles = mongoose.model("profiles", profilesSchema)
module.exports = Profiles
