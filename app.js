var express = require("express");
var session = require('express-session');
var route = require("./controller");

var app = express();
var fs = require("fs");
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))


app.set("view engine","ejs");
app.use(express.static("./public"));
app.use(express.static("./upload"));
app.use(express.static("./tx"));
app.get("/",route.showIndex);
app.get("/regedit",route.showRegister);
app.get("/dirpho",route.showxiangce);
 app.post("/dshuo",route.doShuo);
app.post("/doRegedit",route.doRegister);
app.get("/login",route.showLogin);
app.post("/doLogin",route.doLogin);
app.get("/shuoshuo",route.shuoshuo);
app.get("/page:count",route.shuoshuo);
app.get("/:photoname",route.showphpto);
app.get("/up",route.showup);
app.post("/up",route.photoup);
app.get("/deletedir:dirid",route.deteledir);
app.get("/creatdir",route.insertdir);
app.get("/fengmian:imgid",route.fengmian);
app.get("/personal",route.showpersonal);
app.post("/personal",route.uptx);
app.get("/leavew",route.showdata);
app.get("/addmessage",route.insertdata);
app.get("/delete:_id",route.deletedata);
app.get("/page:count",route.showdata);
app.get("/exit",route.exit);
// app.post("/post",route.doPost);

app.listen(4500);