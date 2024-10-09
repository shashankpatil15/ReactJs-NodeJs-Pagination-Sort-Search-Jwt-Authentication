const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cookieParser());

const authRoute = express.Router();

const UserSchema = mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type: String,
        require:true
    },
    emailId:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})
const UserModel = mongoose.model("User",UserSchema);

authRoute.post('/signup', async(req,res)=>{
    try{
        //Vaidate Function 
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        const data= new UserModel({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        });
        await data.save();
    }catch(error){
        res.status(400).send("ERROR::"+error.message);
    }
})

authRoute.post('/login', async (req,res)=>{
    try{
        const {emailId, password} = req.body;
        const userData = await UserModel.findOne({emailId:emailId});
        if(!userData) throw new Error("Invalid Credentials");
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if(!isPasswordValid) throw new Error("Invalid Credentials");
        const token = jwt.sign({_id:userData._id},"SECRE@!@12",{expiresIn:"1d"});
        res.cookie("token",token,{
            expire: new Date(Date.now()+8*360000)
        });
        res.send("user is valid");
    }catch(error){
        res.status(400).send("ERROR::"+error.message);
    }
})