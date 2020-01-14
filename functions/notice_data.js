const request = require("request")
const cheerio = require("cheerio")
const login_new = require("./login_new")
const ND = require("../models/notice_data")

function data_writer({ notice_data, attachment, n_id }) {
	const now = new Date()
	return ND.updateOne({ id: n_id }, { link: attachment, notice_data: notice_data, lock: false, last_updated: now })
}

const notice_data_extractor = function(uid, pwd, n_id) {
	return new Promise((resolve, reject) => {
		login_new(uid, pwd, (cookie) => {
			console.log(cookie)

			let option = {
				url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/nb/docDet.php?docid=" + n_id,
				headers: {
					Cookie: cookie,
					Referer: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/nb/docList.php"
				}
			}

			request.get(option, (err, res, html) => {
				if (err) {
					return reject(err)
				}
				const $ = cheerio.load(html)
				// console.log($.html());

				const notice_html = $("table").html()
				// console.log(notice_html);

				let attachment = $("a").attr("href")

				// console.log(attachment);

				if (attachment == "docList.php") {
                    a_html_final = ""
                    resolve({ notice_data: notice_html, attachment: a_html_final, n_id })

				} else {
					a_html = "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/nb/" + attachment //.slice(5)
					option1 = {
						url: a_html,
						headers: {
							Cookie: cookie,
							Referer: a_html
						}
					}
					request.get(option1, (err, res, html) => {
                        // console.log(html)
                        
                        const _$=cheerio.load(html)
                        let src_link  = _$('iframe').attr('src')
                        src_link=src_link.slice(5)
                        a_html_final='https://hib.iiit-bh.ac.in/m-ums-2.0'+src_link
                        // console.log(a_html);
                        resolve({ notice_data: notice_html, attachment: a_html_final, n_id })


					})
				}


				// resolve({ notice_data: notice_html, attachment: a_html_final, n_id })
			})
		})
	})
}

// notice_data_extractor("uid", "pwd", "n_id")
// 	.then((data) => {
// 		console.log(data) //while testing
// 	})
// 	.catch((e) => console.log(e))

module.exports = { scraper: notice_data_extractor, data_writer }
