const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded( {extended : true} ));
app.use(express.static(__dirname + "/dosyalar"));
const mongoose = require("mongoose");
const Schema=mongoose.Schema;


mongoose.connect("mongodb+srv://emre:1234@cluster0.3flyb.mongodb.net/Cluster0?retryWrites=true&w=majority",{useNewUrlParser: true , useUnifiedTopology : true});


const guzelSozSema={

kategori:String,
icerik:String

};
const GuzelSoz =mongoose.model("GuzelSoz",guzelSozSema);


app.get("/", function(req,res){
  GuzelSoz.find({}, function(err, gelenSozler){
    res.render("anasayfa", {sozler : gelenSozler});
  });
});


app.route("/api/guzelsoz/:id")
    .get(function(req, res){
      GuzelSoz.findOne({_id : req.params.id} , function(err, gelenVeri){
        res.send(gelenVeri);
      });
    })
    .put(function(req, res){
      var kategoriGelen = req.body.kategori;
      var icerikGelen   = req.body.icerik;
      GuzelSoz.update({_id : req.params.id} , {kategori : kategoriGelen, icerik : icerikGelen}, {overwrite: true}, function(err){
        if(!err)
          res.send("Kayıt başarıyla güncellendi.");
        else
          res.send(err);
      });
    })
    .patch(function(req, res){
      GuzelSoz.update({_id : req.params.id} , {$set : req.body}, function(err){
        if(!err)
          res.send("Kayıt başarıyla güncellendi.");
        else
          res.send(err);
      })
    })
    .delete(function(req, res){
      GuzelSoz.deleteOne({_id : req.params.id}, function(err){
        if(!err)
          res.send("Kayıt başarıyla silindi.");
        else
          res.send(err);
      })
    });


    app.route("/api/guzelsozler")
        .get(function(req, res){
          GuzelSoz.find({}, function(err, gelenVeri){
            if(!err)
              res.send(gelenVeri);
            else
               res.send(err);
          });
        })
        .post(function(req, res){
           var guzelSoz = new GuzelSoz({
             kategori : req.body.kategori,
             icerik : req.body.icerik
           });
           guzelSoz.save(function(err){
              if(!err)
                res.send("Kayıt başarıyla oluşturuldu.");
              else
                res.send(err);
           });
        })
        .delete(function(req, res){
          GuzelSoz.deleteMany({}, function(err){
            if(!err)
              res.send("Tüm kayıtlar başarıyla silindi.");
            else
              res.send(err);
          });
        });


    app.listen(5000,function(){

      console.log("5000 portuna bağlandık");
    });
