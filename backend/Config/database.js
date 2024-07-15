const mongoose =require("mongoose");

exports.DatabaseConnection=async()=>{
    mongoose.connect(process.env.DbURL)
    .then((res)=>{
        console.log('Database Connected ',res.connection.host);
    })
    .catch(err=>{
        console.log(err);
    })
}
// module.exports=DatabaseConnection