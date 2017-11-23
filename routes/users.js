var express = require('express');
var db = require('../modules/db.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.isLogin != "1"){
    next();
    return;
  }
  var json; //传到前端
    db.find("teamAll",{"tName":req.session.tName},function (err,result) {
        json = result[0];
        db.find("Inn",{"school":json.school},function (err, result2) {
            json.jiudian = result2;
            console.log(result2);
            db.find("Inn",{},function (err, result3) {
                json.bianjiang = 40;
                json.meiyu1 = 40;
                json.meiyu2 = 20;
                json.meiyu3 = 25;
                json.meiyu4 = 7;
                json.meiyu5 = 8;

                for(var i = 0;i < result3.length; i++){
                    if(result3[i].hotel == "边疆宾馆")
                        json.bianjiang -= Number(result3[i].number);
                    if(result3[i].hotel == "美玉大酒店 普通标间")
                        json.meiyu1 -= Number(result3[i].number);
                    if(result3[i].hotel == "美玉大酒店 普通单间")
                        json.meiyu2 -= Number(result3[i].number);
                    if(result3[i].hotel == "美玉大酒店 商务标间")
                        json.meiyu3 -= Number(result3[i].number);
                    if(result3[i].hotel == "美玉大酒店 商务单间")
                        json.meiyu4 -= Number(result3[i].number);
                    if(result3[i].hotel == "美玉大酒店 豪华套房")
                        json.meiyu5 -= Number(result3[i].number);
                }
                if(result[0].uPhotoPath4 == undefined) result[0].uPhotoPath4 = null;
                console.log(json);
                res.render("user",json);
            })

        })
    });
});

module.exports = router;