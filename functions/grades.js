//TODO: fucntion,consumer,model,middleware


const request = require("request")
const login_new = require("./login_new")



const grade_extractor = function(uid, pwd) {
    return new Promise((resolve, reject) => {
      login_new(uid, pwd, cookie => {
        console.log(cookie);
  
        let option = {
          url:
            "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/myCourses/docList1.php",
          headers: {
            Cookie: cookie,
            Referer: "https://hib.iiit-bh.ac.in/m-ums-2.0/start/here/aisMenu.php"
          }
        };
  
        request.get(option, (err, res, html) => {
          if (err) {
            return reject(err);
          }
          const $ = cheerio.load(html);
          // console.log(html);
          // console.log("\n\n\n\n\n\n\n\n\n");
  
          let test = $("tr")
            .next()
            .html();
  
  
  
            console.log(test);
            
            const sem  = $(test).find('p').eq(2).html()
            console.log(sem);
            
              console.log('holaaa');
              
          const link = $(test).find('a').attr('href')
          console.log(link);
          
            const subject  = $(test).find("td")
            .eq(2)
            .text()
            .replace(/\s\s+/g, "")
  
            const credit = $(test).find("td")
            .eq(0)
            .text()
            .replace(/\s\s+/g, "")
  
          //   console.log(sem);
          //   console.log(subject);
          //   console.log(credit);
            
            
          resolve("data");
        });
      });
    });
  };
  
//   grade_extractor("uid", "pwd*")
//     .then(data => console.log(data))   //testing
//     .catch(err => console.log(err));