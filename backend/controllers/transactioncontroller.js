const { getTransactionIdsByAccountId } =require("../models/transactionModel");

const transactionbyaccountid = async(req,res)=>
{

    try{

const transactionbyaccountid= await getTransactionIdsByAccountId(req.body.id);
res.status(200).json({"message":transactionbyaccountid})
    }
    catch(err)
    {
        res.status(500).json({message:err.message})
   console.log("eee",err.message)
    }
}
module.exports = {
    transactionbyaccountid
};
