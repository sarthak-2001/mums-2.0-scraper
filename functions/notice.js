const request = require("request")
const cheerio = require("cheerio")
const login_new = require("./login_new")
const Notice_data = require("../models/notice")
const Lock = require("../models/global_lock")

// console.log("extracting notices...")

const data_writer = async (data) => {
	let promiseArray = []
	for (let index = 0; index < data.length; index++) {
		promiseArray.push(
			Notice_data.updateOne(
				{ id: data[index].id },
				{ $set: { attention: data[index].attention, date: data[index].date, id_link: data[index].id_link, posted_by: data[index].posted_by, title: data[index].title } },
				{ upsert: true }
			)
		)
	}
	const now = new Date()
	await Lock.updateOne({ name: "scraper_lock" }, { global_lock: false, last_updated: now })
	return Promise.all(promiseArray)
}

const notice = async function(uid, pwd) {
	return new Promise((resolve, reject) => {
		login_new(uid, pwd, (cookie) => {
			console.log(cookie)
			let option = {
				url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/nb/docList.php",
				headers: {
					Cookie: cookie,
					Referer: "https://hib.iiit-bh.ac.in/m-ums-2.0/start/here/?w=866&h=694"
				}
			}

			request.get(option, (err, res, html) => {
				if (err) {
					return reject(err)
				}
				// console.log(html);
				let data = { Notices: [] }
				const $ = cheerio.load(html)

				$(".col-lg-8, .well, .col-md-8").each((i, elem) => {
					// if (i>10) {
					// 	return false;	//while testing
					// }

					const id = $(elem)
						.find("a")
						.attr("href")
						.slice(17)

					const id_link = $(elem)
						.find("a")
						.attr("href")

					let title = $(elem)
						.find("font[color=red]")
						.text()
					// console.log(title)

					let elem1 = $(elem)
						.find("footer[class=text-left]")
						.html()
					let attention = $(elem1)
						.next()
						.html()
					let posted_by = $(elem1)
						.next()
						.next()
						.html()
					let date = $(elem1)
						.next()
						.next()
						.next()
						.html()

					// console.log(i)
					// console.log(attention)
					// console.log(posted_by);
					// console.log(date);
					// console.log(id);
					// console.log(id_link);

					data.Notices.push({
						date: date,
						title: title,
						id: id,
						id_link: id_link,
						posted_by: posted_by,
						attention: attention
					})
				})

				resolve(data.Notices)
			})
		})
	})
}

// notice("uid", "pwd")
// 	.then((data) => {
// 		console.log(data)			//while testing
// 	})
// 	.catch((e) => console.log(e))

module.exports = { scraper: notice, data_writer: data_writer }
