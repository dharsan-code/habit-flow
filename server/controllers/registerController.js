const userModel = require('../Models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async(req, res, next) => {
   const {username, email, password} = req.body;

   try{
      const hashedpassword = await bcrypt.hash(password, 10);
      await userModel.createUser(username, email, hashedpassword);
      res.status(201).json({message: "User created successfully"});
   }
   catch(err){
      console.log(err);
      res.status(501).json({message: "Internal Server Error"});
   }
}

exports.login = async(req, res) => {

   const { email, password } = req.body;

   try {

      const user = await userModel.login(email);

      if(!user){
         return res.status(401).json({
            message: 'Invalid Email'
         });
      }

      const isValidPassword = await bcrypt.compare(
         password,
         user.password
      );

      if(!isValidPassword){
         return res.status(401).json({
            message: 'Invalid Password'
         });
      }

      const token = jwt.sign(
         { id: user.id },
         process.env.SECRET_KEY,
         { expiresIn: '1h' }
      );

      return res.json({ token });

   } catch(err){

      console.log(err);

      return res.status(500).json({
         message:'Internal Server Error'
      });
   }
}