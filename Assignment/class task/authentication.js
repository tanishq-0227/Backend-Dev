// const express=require("express");
// const bcrypt=require("bcrypt");
// const session=require("express-session");
// const e = require("express");


// const app=express();


// //built-in middleware
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));

// //session configuration
// session({
//     secret:"secret-key", 
//     resave:false,
//     saveUninitialized:false,
//     cookie:{
//         maxAge:24*60*60*1000 //1 day 
//     }
// });

// //dummy user data
// const users=[];

// //passord validation function
// function validatePassword(password){
//     const error=[];
//     if(password.length<8){
//         error.push("minimum length should be 8 characters");
//     }
//     if(!/[A-Z]/.test(password)){
//         error.push("1 uppercase letter is required");
//     }
//     if(!/[a-z]/.test(password)){
//         error.push("1 lowercase letter is required");
//     }
//     if(!/[0-9]/.test(password)){
//         error.push("1 digit is required");
//     }
//     if(!/[@$!%*?&]/.test(password)){
//         error.push("1 special character is required");
//     }
//     return{
//         isValid:error.length===0,
//         errors:error
//     };
// };

// //check login
// function isAuthenticated(req,res,next){
//     if(req.session.userId){
//         return next();
//     }
//     res.status(401).json({message:"login required"});
// }

// //check role
// function authorize(roles){
//     return(req,res,next)=>{
//         const user=users.find(u=>u.id===req.session.userId);
//         if(!user || !roles.includes(user.role)){
//             return res.status(403).json({message:"access denied"});
//         }next();
//     };}

// //register 

// app.post("/register",async(req,res)=>{
// try{
//     const {username,email,password,role}=req.body;
//     if(!username || !email|| !password || !role){
//         return res.status(400).json({message:"all fields are required"});
//     }
//     const existingUser=users.find((u)=>u.username===username);
//     if(existingUser){
//         return res.status(400).json({message:"username already exists"});
//     }
//     const validation =validatePassword(password);
//     if(!validation.isValid){
//         return res.status(400).json({errors:validation.errors});
//     }
//     const hashedPassword=await bcrypt.hash(password,10);
//     const newUser={
//         id:users.length+1,
//         username,
//         password:hashedPassword,
//         role:role || "user" ,

//     };
//     users.push(newUser);
//     res.status(201).json({
//         msg:"user registered successfully",
//         user:{
//             id:newUser.id,
//             username:newUser.username,
//             role:newUser.role
//         }           
//     })
// }catch(error){
//     res.status(500).json({message:"error"});
// }
// });

// //login
// app.post("/login",async(req,res)=>{
// try{
//     const {email,password}=req.body;
//     const user=users.find((u)=>u.email===email);
//     if(!user){
//         return res.status(400).json({
//             message:"invalid email or password"
//         });
//     }
//     const isMatch=await bcrypt.compare(password,user.password);
//     if(!isMatch){
//         return res.status(400).json({message:"invalid email or password"});
//     }
//     //create session
//     req.session.userId=user.id;
//     res.json({
//         msg:"login successful",
//         user:{
//             id:user.id,
//             username:user.username,
//             email:user.email,
//             role:user.role
//         },
//     });
// }catch(error){
//     res.status(500).json({message:"error"});
// }
// });
// //profile protected route
// app.get("/profile",isAuthenticated,(req,res)=>{
//     const user=users.find((u)=>u.id===req.session.userId);
//     res.json({
//         msg:"user profile",
//         user:{
//             id:user.id,
//             email:user.email,
//             username:user.username,
//             role:user.role
//         },
//     });
// }

// );

// //admin protected route
// app.get("/admin",isAuthenticated,authorize(["admin"]),(req,res)=>{
//     res.json({message:"welcome admin"});
// });

// //logout
// app.post("/logout",(req,res)=>{
//     req.session.destroy((err)=>{
//         if(err){
//             return res.status(500).json({message:"error"});
//         }
//         res.json({message:"logout successful"});
//     });
// });

// app.listen(8000,()=>{
//     console.log("server running on port 8000");
// });
//Login Page
// npm install express bcrypt express-session
const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
app.use(express.json());
//    SESSION CONFIGURATION
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
);
// DUMMY DATABASE
const users = [];

//  PASSWORD VALIDATION
function validatePassword(password) {
  const errors = [];

  if (password.length < 8) errors.push("Min 8 characters required");
  if (!/[A-Z]/.test(password)) errors.push("1 uppercase required");
  if (!/[a-z]/.test(password)) errors.push("1 lowercase required");
  if (!/[0-9]/.test(password)) errors.push("1 number required");
  if (!/[!@#$%^&*]/.test(password)) errors.push("1 special char required");

  return {
    isValid: errors.length === 0,
    errors,
  };
}
// MIDDLEWARE
// Check login
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "Login required" });
}
// Role check
function requireRole(role) {
  return (req, res, next) => {
    const user = users.find((u) => u.id === req.session.userId);
    if (!user || user.role !== role) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
}
// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const validation = validatePassword(password);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    };
    users.push(newUser);
    res.status(201).json({
      message: "User Registered",
      user: { id: newUser.id, username, email, role: newUser.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});
// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ message: "Invalid Email" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid Password" });
    // CREATE SESSION
    req.session.userId = user.id;
    res.json({
      message: "Login Success",
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});
// PROFILE (Protected)
app.get("/profile", isAuthenticated, (req, res) => {
  const user = users.find((u) => u.id === req.session.userId);
  res.json({
    message: "Profile Data",
    user: { id: user.id, username: user.username, role: user.role },
  });
});
// ADMIN ROUTE
app.get("/admin", isAuthenticated, requireRole("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});
// LOGOUT
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});
app.listen(8080, () => {
  console.log("Server Started");
});