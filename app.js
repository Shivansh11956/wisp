const express = require('express')
const app = express()
const path = require('path')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { log } = require('console');

const { decode } = require('punycode/');
const {  mongoose } = require('mongoose');
const cron = require('node-cron');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const PORT = process.env.PORT || 3000;

const userModel = require('./models/user')
const emailServiceModel = require('./models/email_service')
const emailServiceModel1 = require('./models/email_service1')
const emailServiceModel6 = require('./models/email_service6')
const emailServiceModel12 = require('./models/email_service12')
const emailServiceModel24 = require('./models/email_service24')
require('dotenv').config();



app.set('view engine','ejs');
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));


cron.schedule('0 * * * *', async () => {
  const funds = await emailServiceModel1.find({});
  for(const fund of funds) {
    try{
    if(fund.status == 0) continue;
    await sendEmail(fund.to,fund.subject, fund.body);
    fund.lastUpdated = new Date().toLocaleDateString()
    await fund.save();
    } catch (error) {
      console.error(`Error processing ${fund.serviceName}:`, error.message);
    }
  }
});
cron.schedule('0 */6 * * *', async () => {
  const funds = await emailServiceModel6.find({});
  for(const fund of funds) {
    try{
    if(fund.status == 0) continue;
    await sendEmail(fund.to,fund.subject, fund.body);
    fund.lastUpdated = new Date().toLocaleDateString()
    await fund.save();
    } catch (error) {
      console.error(`Error processing ${fund.serviceName}:`, error.message);
    }
  }
});
cron.schedule('0 */12 * * *', async () => {
  const funds = await emailServiceModel12.find({});
  for(const fund of funds) {
    try{
    if(fund.status == 0) continue;
    await sendEmail(fund.to,fund.subject, fund.body);
    fund.lastUpdated = new Date().toLocaleDateString()
    await fund.save();
    } catch (error) {
      console.error(`Error processing ${fund.serviceName}:`, error.message);
    }
  }
});
cron.schedule('0 0 * * *', async () => {
  const funds = await emailServiceModel24.find({});
  for(const fund of funds) {
    try{
    if(fund.status == 0) continue;
    await sendEmail(fund.to,fund.subject, fund.body);
    fund.lastUpdated = new Date().toLocaleDateString()
    await fund.save();
    } catch (error) {
      console.error(`Error processing ${fund.serviceName}:`, error.message);
    }
  }
});
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

async function sendEmail(to,subject, body) {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: `${subject}`,
    text: `${body}`
  });
}









const isLogged = (req, res, next) => {
    let token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user_email) => {
      if (err) {
        return res.redirect('/login');
      }
      req.user = user_email;
      next();
    });
};
app.get('/',(req,res)=>{
    res.render('landing');
})
app.get('/create',(req,res)=>{
    res.render('create-account');
})
app.get('/dashboard',isLogged,(req,res)=>{
    res.render('dashboard');
})
app.get('/login',(req,res)=>{
    // console.log(req.cookies)
    res.render('login-account')
})
app.post('/create-account',async (req,res)=>{
    let {name,email,mobileno,username,password,confirmpassword} = req.body;
    if(password != confirmpassword) res.render('create-account',{ok : "failed"})
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            let createdUser = await userModel.create({
                name : name,
                email : email,
                mobileno : mobileno,
                username : username,
                password : hash
            }) 
            let token = jwt.sign({email : email},process.env.JWT_SECRET)
            res.cookie('token',token)
            res.redirect('/login')
        })
    })    
})

app.post('/login-account',async (req,res)=>{
    let {email,password} = req.body;
    console.log("Received email:", req.body.email);
    let user = await userModel.findOne({email:email});
    if(!user){
        return res.redirect('/login')
    }
    bcrypt.compare(password, user.password, (err, isValid) => {
        if (err){
            console.error("Error comparing passwords:", err);
            return res.redirect('/login');
        }
        if (!isValid) {
            console.log("Invalid credentials.");
            return res.redirect('/login');
        }

        let token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.redirect('/dashboard');
    });
})
app.get('/login',(req,res)=>{
    res.render('login-account')
})
app.get('/logout',(req,res)=>{
    res.cookie('token','');
    res.redirect('/')
})

app.get('/dashboard',(req,res)=>{
    res.render('dashboard')
})
app.get('/email',(req,res)=>{
    res.render('email')
})
app.get('/email/create',(req,res)=>{
    res.render('create-email')
})
app.post('/create-email-service',(req,res)=>{
    let x = req.body;
    let token = req.cookies.token;
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(x.schedule == '1 hour'){
        let createdEmailService1 = emailServiceModel1.create({
        userName : decoded.email,
        serviceName : x.name,
        to : x.email,
        subject : x.subject,
        body : x.emailbody,
        schedule : x.schedule,
        targetCount : x.targetCount,
        status : 1,
        lastUpdated : "No execution yet"
    })
    }else if(x.schedule == '6 hours'){
        let createdEmailService6 = emailServiceModel6.create({
        userName : decoded.email,
        serviceName : x.name,
        to : x.email,
        subject : x.subject,
        body : x.emailbody,
        schedule : x.schedule,
        targetCount : x.targetCount,
        status : 1,
        lastUpdated : "No execution yet"
        })
    }else if(x.schedule == '12 hours'){
        let createdEmailService12 = emailServiceModel12.create({
        userName : decoded.email,
        serviceName : x.name,
        to : x.email,
        subject : x.subject,
        body : x.emailbody,
        schedule : x.schedule,
        targetCount : x.targetCount,
        status : 1,
        lastUpdated : "No execution yet"
        })
    }else if(x.schedule == '24 hours'){
        let createdEmailService24 = emailServiceModel24.create({
        userName : decoded.email,
        serviceName : x.name,
        to : x.email,
        subject : x.subject,
        body : x.emailbody,
        schedule : x.schedule,
        targetCount : x.targetCount,
        status : 1,
        lastUpdated : "No execution yet"
        })
    }
    let createdEmailService = emailServiceModel.create({
        userName : decoded.email,
        serviceName : x.name,
        to : x.email,
        subject : x.subject,
        body : x.emailbody,
        schedule : x.schedule,
        targetCount : x.targetCount,
        status : 1,
        lastUpdated : "No execution yet"
    })
    res.redirect('/email')
})
app.get('/api/email_service', async (req, res) => {
    try {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        let allEmailServices = []
        let allEmailServices1 = await emailServiceModel1.find({ 
            userName: decoded.email
        }) || [];
        let allEmailServices6 = await emailServiceModel6.find({ 
            userName: decoded.email
        }) || [];
        let allEmailServices12 = await emailServiceModel12.find({ 
            userName: decoded.email
        }) || [];
        let allEmailServices24 = await emailServiceModel24.find({ 
            userName: decoded.email
        }) || [];
        allEmailServices.push(allEmailServices1)
        allEmailServices.push(allEmailServices6)
        allEmailServices.push(allEmailServices12)
        allEmailServices.push(allEmailServices24)
        res.json(
            JSON.parse(
                JSON.stringify(allEmailServices, (_, value) =>
                    typeof value === "bigint" ? value.toString() : value
                )
            )
        );
        console.log(allEmailServices)
    } catch (error) {
        console.error("Error fetching mutual funds:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
});
app.post('/email/services1/pause/:id',async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(req.params.id)
    
    const fund2 = await emailServiceModel1.findOne({
        userName : decoded.email,
        _id : req.params.id
    });
    fund2.status = 0
    await fund2.save();
    // console.log(fund);
    res.redirect('/email')

});
app.post('/email/services6/pause/:id',async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(req.params.id)
    
    const fund2 = await emailServiceModel6.findOne({
        userName : decoded.email,
        _id : req.params.id
    });
    fund2.status = 0
    await fund2.save();
    // console.log(fund);
    res.redirect('/email')

});

app.post('/email/services12/pause/:id',async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(req.params.id)
    
    const fund2 = await emailServiceModel12.findOne({
        userName : decoded.email,
        _id : req.params.id
    });
    fund2.status = 0
    await fund2.save();
    // console.log(fund);
    res.redirect('/email')

});
app.post('/email/services24/pause/:id',async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(req.params.id)
    
    const fund2 = await emailServiceModel24.findOne({
        userName : decoded.email,
        _id : req.params.id
    });
    fund2.status = 0
    await fund2.save();
    // console.log(fund);
    res.redirect('/email')

});
app.post('/email/services1/resume/:id',async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(req.params.id)
    
    const fund2 = await emailServiceModel1.findOne({
        userName : decoded.email,
        _id : req.params.id
    });
    fund2.status = 1
    await fund2.save();
    // console.log(fund);
    res.redirect('/email')

});
app.post('/email/services6/resume/:id',async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(req.params.id)
    
    const fund2 = await emailServiceModel6.findOne({
        userName : decoded.email,
        _id : req.params.id
    });
    fund2.status = 1
    await fund2.save();
    // console.log(fund);
    res.redirect('/email')

});

app.post('/email/services12/resume/:id',async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(req.params.id)
    
    const fund2 = await emailServiceModel12.findOne({
        userName : decoded.email,
        _id : req.params.id
    });
    fund2.status = 1
    await fund2.save();
    // console.log(fund);
    res.redirect('/email')

});
app.post('/email/services24/resume/:id',async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(req.params.id)
    
    const fund2 = await emailServiceModel24.findOne({
        userName : decoded.email,
        _id : req.params.id
    });
    fund2.status = 1
    await fund2.save();
    // console.log(fund);
    res.redirect('/email')

});
app.post('/email/services1/remove/:id',async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(req.params.id)
    
    const fund2 = await emailServiceModel1.deleteOne({
        userName : decoded.email,
        _id : req.params.id
    });
    res.redirect('/email')

});
app.post('/email/services6/remove/:id',async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(req.params.id)
    
    const fund2 = await emailServiceModel6.deleteOne({
        userName : decoded.email,
        _id : req.params.id
    });
    res.redirect('/email')

});
app.post('/email/services12/remove/:id',async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(req.params.id)
    
    const fund2 = await emailServiceModel12.deleteOne({
        userName : decoded.email,
        _id : req.params.id
    });
    res.redirect('/email')

});
app.post('/email/services24/remove/:id',async (req,res)=>{
    let token = req.cookies.token
    let decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(req.params.id)
    
    const fund2 = await emailServiceModel24.deleteOne({
        userName : decoded.email,
        _id : req.params.id
    });
    res.redirect('/email')

});
app.listen(PORT,()=>{
    console.log('running');
});