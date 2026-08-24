// express is a frame work on top of node js http module 
// makes the writing of the code more simpler

// sample express server

// normal node js

const http = require("http");

const server = http.createServer((req,res)=>{

    if(req.url === "/" && req.method === "GET"){
        res.writeHead(200,{"Content-type": "text/plain"});
        res.end("Home page");
    }
    else if(req.url === "/users" && req.method === "GET"){
        res.writeHead(200,{"content-type" : "text/plain"});
        res.end("List of users");
    }
    else{
        res.writeHead(404);
        res.end("Not found");
    }

});

server.listen(3000,() => console.log("Server on port 3000"));


// same thing in express

const express = require("express");

const app =  express();


app.get("/",(req,res)=> res.send("Home page"));

app.get("/users",(req,res)=> res.send("List of users"));

app.listen(4000,()=>console.log("Server running at port 4000"));


// cors - cross origin resource sharing