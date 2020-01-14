const mongoose = require("mongoose")

const intraNoticeSchema = new mongoose.Schema({
    date: {
		default: "",
		type: String
	},
	id: {
		default: "",
		unique: true,
		type: String
	},
	id_link: {
		default: "",
		type: String
	},
	posted_by: {
		default: "",
		type: String
	},
	title: {
		default: "",
		type: String
	}
})

intraNoticeSchema.pre("save",async function(next){
    const curr = this;
	const now = new Date();
	curr.last_updated = now;
	next();
})

const intraNotice = mongoose.model("IntraNotice_data",intraNoticeSchema,"intraNotices")

module.exports = intraNotice