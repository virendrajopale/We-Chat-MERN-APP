const   jwt= require("jsonwebtoken");

exports.generateToken=(id)=>{
    try {
      return  jwt.sign({id},process.env.JWT_SECRET,{
            expiresIn:"30d"
        })
    } catch (error) {
        console.log(error);
    }
}