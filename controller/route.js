/**
 * Created by Administrator on 2017/7/4.
 */
var opeardb = require("./operadb.js");
var foridable = require("formidable");
var file = require("../model/file.js");
var object = require("mongodb").ObjectID;
var md5 = require("./md5.js");
var path = require("path");
var fs = require("fs");
var silldatetime = require("silly-datetime");
exports.showIndex = function (req, res, next) {
  var uname=req.session.login=="1"?req.session.username:"";
  var login = req.session.login =="1"?true:false;
  opeardb.finddata("shuoshuo",function (err, doc) {
      if(doc){
              opeardb.finddata("introl",function (err,dirname) {
                  res.render("index",{
                      "username":uname,
                      "login":login,
                      "active":"首页",
                      "shuoshuo":doc,
                      "personal":dirname
                  })
              })
      }

  })
}
exports.showRegister = function (req, res, next) {
    res.render("register",{
        "username":req.session.login =="1"?req.session.username:"",
        "login":req.session.login =="1"?true:false,
        "active":"注册"
    })
}
exports.doRegister = function (req, res, next) {
    var form = new foridable.IncomingForm();
    var nowtime=silldatetime.format(new Date(),"YYYY-MM-DD：HH/mm/ss");
    form.parse(req, function (err, fields) {
        var username = fields.uname;
        var password = fields.upass;
        //要对用户这次输入的密码，进行相同的加密操作。然后与数据库中的密码进行比对
        password = md5(md5(password) + "cxq");
        var introl = fields.intro;
        var json = {
            "uname": username,
            "upass": password,
            "intro": introl,
            "rtime": nowtime,
            "tx":"2017071517582953509.jpg"
        }
            //比对数据库，按登录名检索数据库，查看密码是否匹配
            opeardb.finddata("message",username, function (err, result) {
                if (err) {
                    res.send("-3");
                    return;
                }
                if (result.length != 0) {
                    res.send("-1");
                    return;
                } else {
                    req.session.login = "1";
                    req.session.username = username;
                    opeardb.insertdata("introl", json, function (err, doc) {
                        if (err) {
                            res.send("-2");
                        }
                        res.send("1");
                    })
                }
            })


    })
}
exports.shuoshuo=function (req,res,next) {
    var username=req.session.login=="1"?req.session.username:"";
    var login=req.session.login =="1"?true:false;
    var count=0;
    if(req.params.count){
       count=req.params.count;
    }
    var size=2;
    var array=[size,count];
    var prepage=0;
    var nextpage=0;
    if(count){
        prepage=count-1;
        prepage=prepage>-1?prepage:0;
        nextpage=parseInt(count)+1;
    }
    opeardb.finddata("shuoshuo",username,array,function (err,doc,counts) {
        var pagecount=Math.ceil(counts/size);
        if(err){
            console.log("1"+err);
            return;
            next();
        }
        nextpage=nextpage>=pagecount-1?pagecount-1:nextpage;
        opeardb.finddata("introl",function (err,dirname) {
            res.render("shuo",{
                "username":req.session.login =="1"?req.session.username:"",
                "login":req.session.login =="1"?true:false,
                "active":"说说",
                "shuodata":doc,
                "counts":counts,
                "pagecounts":pagecount,
                "prepage":prepage,
                "nextpage":nextpage,
                "personal":dirname
            })
        })

    })
}
exports.showLogin=function (req,res,next) {
    res.render("login",{
        "username":req.session.login =="1"?req.session.username:"",
        "login":req.session.login =="1"?true:false,
        "active":"登录"
    })
}
exports.doLogin=function (req,res,next) {
    var form = new foridable.IncomingForm();
    form.parse(req, function(err, fields) {
        var username = fields.uname;
        var password = fields.upass;
        //要对用户这次输入的密码，进行相同的加密操作。然后与数据库中的密码进行比对
        password = md5(md5(password)+"cxq");
        //比对数据库，按登录名检索数据库，查看密码是否匹配
        opeardb.findone("introl",username,function(err,result){
            if(result.length == 0){
                res.send("-1");
                return;
            }
            if(password == result[0].upass){
                req.session.login = "1" ;
                req.session.username = username;
                res.send("1");
                return;
            }else{
                res.send("-2");
                return;
            }
        });
    });
}
exports.doShuo=function (req,res,next) {
   var usename=req.session.username;
    var nowtime=silldatetime.format(new Date(),"YYYY-MM-DD：HH/mm/ss");
   var form=new foridable.IncomingForm();
   form.parse(req,function (err,fields) {
       var content=fields.content;
       console.log(content);
       var json={
           "uname":usename,
           "content":content,
           "uptime":nowtime
       }
       if(usename){
           opeardb.insertdata("shuoshuo",json,function (err,doc) {
               if (err) {
                   res.send("-1");
               }
               res.send("1");
           })
       }
   })
}
// 创建相册
exports.insertdir=function (req,res) {
    var username=req.session.login=="1"?req.session.username:"";
    file.makedir("./upload/"+req.query.phname,07777,function (err) {
        if(err){
            console.log("创建目录出错！")
        }
        var leavetime=silldatetime.format(new Date(),"YYYY-MM-DD:HH-mm-ss");
        var json={
            "pname":req.query.phname,
            "decrible":req.query.phcontent,
            "pholocation":"./upload/"+req.query.phname,
            "ctime":leavetime,
            "fengmian":"null",
            "uname":username
        }
        opeardb.insertdata("phodir",json,function (err,doc) {
            if(err){
                console.log("1"+err);
            }
            console.log("创建相册成功");
            res.redirect("/");
            res.end();
        })
    })
}
exports.showxiangce=function (req,res) {
    var username=req.session.login=="1"?req.session.username:"";
    var login=req.session.login =="1"?true:false;
    opeardb.showphodir("phodir",username,function (err,result) {
                if(err){
                    console.log("查询错误！");
                    next();
                }
                if(result){
                    res.render("phodir",{
                        "username":req.session.login =="1"?req.session.username:"",
                        "login":req.session.login =="1"?true:false,
                        "active":"相册",
                        "photodir":result
                    })

                }
            })
        }

exports.showphpto=function (req,res,next) {
    var username=req.session.login=="1"?req.session.username:"";
    var login=req.session.login =="1"?true:false;
    file.getPhoto(req.params.photoname,function (ptotos) {
        res.render("photo",{
            "username":req.session.login =="1"?req.session.username:"",
            "login":req.session.login =="1"?true:false,
            "active":"相册",
            "photoname":req.params.photoname,
            "photos":ptotos
        })
    },next)
}
exports.fengmian=function (req,res,next) {
    var imgsrc=req.params.imgid;
    opeardb.showpho("photos",imgsrc,function (err,result) {
        if(result){
            var ojson={
                "pname":result[0].phodir
            }
            var njson={
                $set:{
                    "fengmian":imgsrc
                }
            }
            opeardb.updatefm("phodir",ojson,njson,function (err,doc) {
                if(err){
                    console.log("设置失败");
                }
                res.redirect("/dirpho");
            })
        }
    })
}
exports.showup=function (req,res,next) {
    var username=req.session.login=="1"?req.session.username:"";
    var login=req.session.login =="1"?true:false;
    opeardb.showphodir("phodir",username,function (err,dirname) {
        res.render("up",{
            "username":req.session.login =="1"?req.session.username:"",
            "login":req.session.login =="1"?true:false,
            "active":"相册",
            "photodir":dirname
        })
    })
}
exports.photoup=function (req,res,next) {
    var form=new foridable.IncomingForm();
    form.uploadDir="./temp";
    var nowtime=silldatetime.format(new Date(),"YYYYMMDDHHmmss");
    var ran=parseInt(Math.random()*89999+10000);
    form.parse(req,function (err,fields,files){
        console.log(fields);
        console.log(files);
        var extname=path.extname(files.imgSrc.name);
        var oldpath="./"+files.imgSrc.path;
        var newpath="./upload/"+fields.dirname+"/"+nowtime+ran+extname;
        var json={
            "name":nowtime+ran+extname,
            "phodir":fields.dirname,
            "pholocat":newpath,
            "uptime":nowtime,
        }
        file.rename(oldpath,newpath,function (err) {
            if(err){
                console.log("照片命名错误");
            }
            opeardb.insertdata("photos",json,function (err,doc) {
                if(err){
                    console.log("1"+err);
                }
                console.log("照片上传成功");
                res.redirect("/" + fields.dirname);
                res.end();
            })

        })

    })
}
exports.deteledir=function (req,res) {
    var json={
        "pname":req.params.dirid
    };
    var path="./upload/"+req.params.dirid;
    file.delete(path,function (err) {
        if(err){
            console.log("删除失败！");
        }
        opeardb.deleteMany("phodir",json,function (err, doc) {
            if(err){
                console.log("删除数据失败！");
            }
            res.redirect("/");
        })
    })
}

exports.showpersonal=function (req,res) {
    var username=req.session.login=="1"?req.session.username:"";
    var login=req.session.login =="1"?true:false;
    var count=0;
    if(req.params.count){
        count=req.params.count;
    }
    var size=10;
    var array=[size,count];
    var prepage=0;
    var nextpage=0;
    if(count){
        prepage=count-1;
        prepage=prepage>-1?prepage:0;
        nextpage=parseInt(count)+1;
    }
    opeardb.finddata("shuoshuo",username,array,function (err,doc,counts) {
        var pagecount=Math.ceil(counts/size);
        if(err){
            console.log("1"+err);
            return;
            next();
        }
        nextpage=nextpage>=pagecount-1?pagecount-1:nextpage;
        if(counts){
            opeardb.showphodir("introl",username,function (err,dirname) {
                res.render("personal",{
                    "username":req.session.login =="1"?req.session.username:"",
                    "login":req.session.login =="1"?true:false,
                    "active":"个人",
                    "personal":dirname,
                    "shuodata":doc,
                    "counts":counts,
                    "pagecounts":pagecount,
                    "prepage":prepage,
                    "nextpage":nextpage
                })
            })
        }
    })
}
exports.uptx=function (req,res,next) {
    var username=req.session.login=="1"?req.session.username:"";
    var form=new foridable.IncomingForm();
    form.uploadDir="./temp";
    var nowtime=silldatetime.format(new Date(),"YYYYMMDDHHmmss");
    var ran=parseInt(Math.random()*89999+10000);
    form.parse(req,function (err,fields,files){
        var extname=path.extname(files.txSrc.name);
        var oldpath="./"+files.txSrc.path;
        var newpath="./tx/"+nowtime+ran+extname;
        var ojson={
            "uname":username
        }
        var njson={
            $set:{
                "tx":nowtime+ran+extname,
            }
        }
        file.rename(oldpath,newpath,function (err) {
            if(err){
                console.log("照片命名错误");
            }
            opeardb.updatefm("introl",ojson,njson,function (err,doc) {
                if(err){
                    console.log("1"+err);
                }
                console.log("头像修改成功");
                res.redirect("/personal" );
                res.end();
            })

        })

    })
}
exports.showdata=function (req,res,next) {
    var username=req.session.login=="1"?req.session.username:"";
    var login=req.session.login =="1"?true:false;
    var count=0;
    if(req.params.count){
        count=req.params.count;
    }
    var size=10;
    var json=[size,count];
    var prepage=0;
    var nextpage=0;
    if(count){
        prepage=count-1;
        prepage=prepage>-1?prepage:0;
        nextpage=parseInt(count)+1;
    }
   opeardb.finddata("leavedata",username,json,function (err,doc,count) {
        var pagecount=Math.ceil(count/size);
        if(err){
            console.log("1"+err);
            next();
        }
        nextpage=nextpage>=pagecount-1?pagecount-1:nextpage;
       opeardb.finddata("introl",function (err,dirname) {
           res.render("leavew",{
               "username":req.session.login =="1"?req.session.username:"",
               "login":req.session.login =="1"?true:false,
               "active":"留言",
               "leavedata":doc,
               "counts":count,
               "pagecounts":pagecount,
               "prepage":prepage,
               "nextpage":nextpage,
               "personal":dirname
           })
           res.end();
       })

    })
}
exports.insertdata=function (req,res) {
    var username=req.session.login=="1"?req.session.username:"";
    var leavetime=silldatetime.format(new Date(),"YYYY-MM-DD:HH-mm-ss");
    var json={
        "name":username,
        "lcontent":req.query.lcontent,
        "leavetime":leavetime
    }
    opeardb.insertdata("leavedata",json,function (err,doc) {
        if(err){
            console.log("1"+err);
        }
        res.redirect("/leavew");
        res.end();
    })
}
exports.deletedata=function (req,res) {
    var json={
        "_id":new object(req.params._id)
    }
    opeardb.deleteMany("leavedata",json,function (err,doc) {
        if(err){
            console.log("1"+err);
        }
        console.log("删除成功！");
        res.redirect("/leavew");
        res.end();
    })
}
exports.exit=function (req,res) {
    if("/exit"==req.url){
        req.session.login=false;
    }
    var username="";
    var login=false;
    res.render("index",{
        "username":username,
        "login":login,
        "active":"首页",
    })
}