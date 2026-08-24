const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/",(req,res)=>{

    res.status(200).json({message: "API is running", version: "1.0.0"});

});


app.get("/health",(req,res)=>{

    res.status(200).json({status:"ok",uptime: process.uptime()});

});

app.get("/echo",(req,res)=>{

    res.status(200).json(req.query);

});


app.post("/echo",(req,res)=>{

    res.status(200).json(req.body);

});

module.exports = app;