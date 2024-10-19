import jwt from 'jsonwebtoken';

const GenerateRefreshToken = (_id)=>{
    return jwt.sign({_id},process.env.MY_TOKEN_STRING,{expiresIn:"3d"});
}

export default GenerateRefreshToken;