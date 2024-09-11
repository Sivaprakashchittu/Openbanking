const { getAccountIdsByCustomerId } =require("../models/accountModel");

const AccountIdsByCustomerId = async(req,res)=>
    {
    
        try{
    
    const AccountIdsByCustomerId= await getAccountIdsByCustomerId(req.body.id);
    res.status(200).json({"message":AccountIdsByCustomerId})
        }
        catch(err)
        {
            res.status(500).json({message:err.message})
       console.log("eee",err.message)
        }
    }

    module.exports = {
        AccountIdsByCustomerId
    };
    