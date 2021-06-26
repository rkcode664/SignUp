// modules
const express = require("express");
const bodyParser= require("body-parser");
const request= require("request");
const https=require("https");
const app=express();

app.use(express.static("public"));// server to access  static files(css,images)

app.use(bodyParser.urlencoded({extended:true}));// for bodyparser

  app.get("/",function(req,res){//routing to home
    res.sendFile(__dirname + "/signup.html")
});

app.post("/",function(req,res){
   const firstname =req.body.fname;  //use of bodyparser
   const lastname =req.body.lname;
   const email =req.body.email;
   
   const data={//javascript object
       members:[{
         email_address:email,
         status: "subscribed",
         merge_fields:{
              FNAME:firstname,
              LNAME:lastname }
       }]
   };
   const jsonData=JSON.stringify(data);//converted to JSON object

   const url="https://us6.api.mailchimp.com/3.0/lists/7dc56a7d97"; //url of posting data to external server
   

   const options={
     method:"POST",
     auth:"Ramkumar:c4b535df1255a96ae24051c9f8c7c529-us6" //authentication anyname:API key
   };
  
   const request=https.request(url,options,function(response){
     if(response.statusCode==200){
       res.sendFile(__dirname +"/success.html");
     }
     else
     res.sendFile(__dirname +"/failure.html");
       
    response.on("data",function(data){
      console.log(JSON.parse(data))
       });
   });
  request.write(jsonData);
  request.end();

});

app.post("/failure",function(req,res){
  res.redirect("/");
})
//process.env.PORT for deploying on heroku
//3000 for local host
  app.listen(process.env.PORT|| 3000,function(){  //port setup
    console.log("server is running on port 3000");
});
// API KEY
//c4b535df1255a96ae24051c9f8c7c529-us6
//list id
//7dc56a7d97