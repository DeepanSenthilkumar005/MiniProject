const express = require('express');
const loginModel = require("../models/Login");
const router = express.Router();

router.get('/auth/:mail/:password', async(req, res)=>{
    try{
        const mailId = await loginModel.findOne({mail: req.params.mail});
        const password = req.params.password;
            if(!mailId)
            {
                res.status(201).json("Register your Mail")
            }
            else if(password===mailId.password)
                {res.status(200).json("Valid Password");}
            else{
                res.status(200).json("Invalid Password");
                
            }
        

    }
    catch{
        console.log("Error in the Mail");
        
    }
    
});
router.post('/auth',async(req, res)=>{
    try {
        const add = new loginModel(req.body);
        await add.save();
        res.status(200).json("SuccesfullAdded")
    } catch (error) {
        console.log("Error in Adding the File "+error);
        
    }
})

module.exports = router;
