var formidable = require("formidable");
var db = require("../modules/db.js");
var path = require("path");
var fs = require("fs");

exports.doLogin = function (req, res, next) {
    var form = new formidable.IncomingForm();
    console.log(1);
    form.parse(req,function (err, fields) {
        console.log(2);
        var username = fields.username;
        var password = fields.password;

        //console.log(username + password);
        db.find("teamAll",{"phone1" : username}, function (err, result) {
            console.log(result[0]);
            if(err){
                res.end("-1");
                return;
            }
            if(result.length == 0){
                res.end("-2");// -2表示账号错误
                return;
            }
            if(password == result[0].password1){
                req.session.isLogin = "1";
                req.session.tName = result[0].tName;
                //req.session.pName = result[0].pName;
               // req.session.isAdmin = result[0].isadmin;
                res.end("1");//1表示登陆成功
                return;
            }else{
                res.end("-1");//-1表示账号错误
                return;
            }
        });
    });
}

exports.saveInfo = function (req, res, next) {
    if(req.session.isLogin != "1"){
        next();
        return;
    }
    var form = new formidable.IncomingForm();
   // var oldpath = files.zuoye.path;
   // var extname = path.extname(files[0]);
    //var newpath = ;
    form.uploadDir = path.normalize(__dirname + "/../" );// 临时储存

    form.parse(req,function (err, fields,files) {
        console.log(files);
        console.log(fields);
        var tName = req.session.tName;
        var oldpath1;
        var extname1;
        var newpath1;
        var oldpath2 ;
        var extname2;
        var newpath2 ;
        var oldpath3 ;
        var extname3 ;
        var newpath3 ;
        var oldpath4 ;
        var extname4 ;
        var newpath4 ;
        oldpath1 = files.inch_photo1.path;
        extname1 = path.extname(files.inch_photo1.name);
        newpath1 = form.uploadDir + "/uploads/" + fields.school +"_"+ fields.tName +"_"+ fields.tPerson1+extname1;
        oldpath2 = files.inch_photo2.path;
        extname2 = path.extname(files.inch_photo2.name);
        newpath2 = form.uploadDir + "/uploads/" + fields.school +"_"+ fields.tName +"_"+ fields.tPerson2+extname2;
        oldpath3 = files.inch_photo3.path;
        extname3 = path.extname(files.inch_photo3.name);
        newpath3 = form.uploadDir + "/uploads/" + fields.school +"_"+ fields.tName +"_"+ fields.tPerson3+extname3;
        oldpath4 = files.inch_photo4.path;
        extname4 = path.extname(files.inch_photo4.name);
        newpath4 = form.uploadDir + "/uploads/教练_" + fields.school +"_"+ fields.tName +"_"+ fields.coach+extname4;
        //console.log(username + password);
        if(!fs.existsSync(form.uploadDir + "/uploads/")){
            fs.mkdirSync(form.uploadDir + "/uploads/");
        }
        if(files.inch_photo1.size > 0)
            fs.renameSync(oldpath1,newpath1,function (err) {
                if(err){
                    callback("文件重命名错误。");
                }
            });
        else{
            fs.unlinkSync(oldpath1);
        }
        if(files.inch_photo1.size > 0)
            db.updateMany("teamAll",{"tName":tName},{$set:{
                "uPhotoPath1": "/" + fields.school +"_"+ fields.tName +"_"+ fields.tPerson1+extname1
            }},function (err,result) {
               // res.send(err);
            });

        if(files.inch_photo2.size > 0)
            fs.renameSync(oldpath2,newpath2,function (err) {
                if(err){
                    callback("文件重命名错误。");
                }
            });
        else{
            fs.unlinkSync(oldpath2);
        }
        if(files.inch_photo2.size > 0)
            db.updateMany("teamAll",{"tName":tName},{$set:{
                "uPhotoPath2": "/" + fields.school +"_"+ fields.tName +"_"+ fields.tPerson2+extname2
            }},function (err) {

            });
        if(files.inch_photo3.size > 0)
            fs.renameSync(oldpath3,newpath3,function (err) {
                if(err){
                    callback("文件重命名错误。");
                }
            });
        else{
            fs.unlinkSync(oldpath3);
        }
        if(files.inch_photo3.size > 0)
            db.updateMany("teamAll",{"tName":tName},{$set:{
                "uPhotoPath3": "/"+ fields.school +"_"+ fields.tName +"_"+ fields.tPerson3+extname3
            }},function (err) {

            });
        if(files.inch_photo4.size > 0)
            fs.renameSync(oldpath4,newpath4,function (err) {
                if(err){
                    callback("文件重命名错误。");
                }
            });
        else{
            fs.unlinkSync(oldpath4);
        }
        if(files.inch_photo4.size > 0)
            db.updateMany("teamAll",{"tName":tName},{$set:{
                "uPhotoPath4": "/教练_"+ fields.school +"_"+ fields.tName +"_"+ fields.coach+extname4
            }},function (err) {

            });
            console.log(fields);
            console.log(files.inch_photo1.name);

    });
    res.set('refresh', '0;url=/users');
    res.send("1");
}

exports.orderInn = function (req, res, next) {
    if(req.session.isLogin != "1"){
        next();
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields) {
        console.log(fields);
        db.insertOne("Inn",{"school":fields.school,
            "hotel": fields.hotel,
            "inTime": fields.inTime,
            "number": fields.fangjianshu},function (err) {
            console.log(err);
        });
    });
    res.set('refresh', '0;url=/users');
    res.send("1");
}

exports.alterPassword = function (req, res, next) {
    if(req.session.isLogin != "1"){
        next();
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields) {
        console.log(fields);
        db.updateMany("teamAll",{"tName":req.session.tName,"password1":fields.oldpass},{$set:{"password1":fields.newpass}},function (err, resul) {
            if(err){
                console.log(err);
            }
        })

    });
    res.set('refresh', '0;url=/users');
    res.send("1");
}

exports.deleteAllInn = function (req, res, next) {
    if(req.session.isLogin != "1"){
        next();
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields) {
        console.log(fields);
        db.deleteMany("Inn",{"school":fields.school},function (err, result) {
            console.log(result);
        })

    });
    res.set('refresh', '1;url=/users');
    res.send("删除成功");
}

exports.admin = function (req,res,next) {

    var json; //传到前端
    db.find("teamAll",{},function (err,result) {
        json = result[0];
        db.find("Inn",{},function (err, result2) {
            json.jiudian = result2;
           // console.log(result2);
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
                //console.log(json);
                res.render("admin",json);
            })

        })
    });
}