require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
var cors = require('cors')
const app = express();
app.use(cors())


//>>>>>>>>>>>>>>>>>>>>Middlewares<<<<<<<<<<<<<<<<<//

app.use(express.urlencoded(extended = true))
app.use(express.json());

// ====================== DATABASE CONNECTION CODE ======================

// CONNECTION URI || DATABASE URI  || CONNECTION STRING

mongoose.connect('mongodb+srv://Frofessional:VpSkSp3g1vUrVMgu@cluster0.aqf3lfa.mongodb.net/Dashboard')




const db = mongoose.connection;
db.on('error', (error) => {
    console.log(error)
})
db.once("connected", () => {
    console.log("DataBase Connected")
});
// ====================== DATABASE CONNECTION END ======================

// ====================== DB SCHEMA START======================

const userSchema = new mongoose.Schema({
    username: { type: String, },
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true, }
});

const adminSchema = new mongoose.Schema({
    username: { type: String, },
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true, },
    secret_key: { type: String, required: true, }
});

// ====================== DB SCHEMA END======================

// ====================== DB MODEL START======================

const userModel = new mongoose.model("Users_Data", userSchema)
const adminModel = new mongoose.model("Admin_Data", adminSchema)

// ====================== DB MODEL END======================


// ====================== ROUTES START ======================



// **************   CRUDE  OPERATION  ************ //

//  DB CREATE 

app.get("/", (req, res) => {
    res.send("This Is Professional Server By Express");
    // res.json({title:"Changing"}) 

})



// User Sign In

app.post("/login_User", async (req, res) => {

    // await userModel.create({
    //     name:req.body.name,
    //     age:req.body.age
    // })

    //                              OR
    // console.log(req.body)
    const user = await userModel.findOne({
        email: req.body.email
    })


    if (user) {

        if (user.password === req.body.password) {
            // try {
            res.status(200).json({ "userData": user, "msg": "User Signed in Successfully" });
            // } catch {
            //     res.status(400).json({ msg: "Error Occured", logs: error.message });
            // }
        }
        else {
            res.status(409).json({ msg: "Incorrect Password " });
        }
    } else {
        res.status(404).json({ msg: "User is Not Found" });

    }
    console.log(user)
    res.status(200).json(req.body);


})

//   User signUp 

app.post("/signUp_User", async (req, res) => {

    // await userModel.create({
    //     name:req.body.name,
    //     age:req.body.age
    // })

    //                              OR

    const user = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })

    try {
        const output = await user.save();
        res.status(200).json(output)

    } catch (error) {

        res.status(400).json({ msg: "Error Occured", logs: error.message });

    }

    //

    console.log(user)
    res.status(200).json(req.body);


})

 
// Admin Sign In


app.post("/login_Admin", async (req, res) => {

    // await userModel.create({
    //     name:req.body.name,
    //     age:req.body.age
    // })

    //                              OR
    // console.log(req.body)
    const admin = await adminModel.findOne({
        email: req.body.email
    })


    if (admin) {

        if (admin.password === req.body.password) {


            if (admin.secret_key === req.body.secret_key) {
                // try {
                res.status(200).json({ "adminData": admin, "msg": "Admin Signed in Successfully" });
                // } catch {
                //     res.status(400).json({ msg: "Error Occured", logs: error.message });
                // }
            }
            else {
                res.status(408).json({ msg: "Incorrect Secret_key" });
            }

        }
        else {
            res.status(409).json({ msg: "Incorrect Password " });
        }
    } else {
        res.status(404).json({ msg: "User is Not Found" });

    }
    console.log(user)
    res.status(200).json(req.body);


})




// Admin signUp
app.post("/signUp_Admin", async (req, res) => {

    // await userModel.create({
    //     name:req.body.name,
    //     age:req.body.age
    // })

    //                              OR

    const user = new adminModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        secret_key: req.body.secret_key
    })

    try {
        const output = await user.save();
        res.status(200).json(output)

    } catch (error) {

        res.status(400).json({ msg: "Error Occured", logs: error.message });

    }

    //

    console.log(user)
    res.status(200).json(req.body);


})


// DB READ







// app.get('/', (req, res) => {


//     res.send('This is My first index ||Teachez Code||')

// })


app.get("/all_users", async (req, res) => {

    try {
        const users = await adminModel.find();
        res.send(users)
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ msg: "Error Occured", logs: error.message });
    }

})

// data = axios.get("localhost:5000/user/Tariq").then((res)=>{
//     setUser(res[0].name)
// })

app.get("/user/:name", async (req, res) => {

    try {
        const users = await userModel.find({ name: req.params.name });
        res.send(users)
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ msg: "Error Occured", logs: error.message });
    }

})


//  DB UPDATE 

app.put("/update_user", async (req, res) => {
    console.log(req.body)

    const user = await userModel.findOne({ _id: req.body._id });
    user.name = req.body.name,
        user.age = req.body.age
    try {
        const output = await user.save();
        res.status(200).json(output)
    } catch (error) {

        res.status(400).json({ msg: "Error Occured", logs: error.message });

    }

    res.status(200).json(req.body);


})


//  DB DELETE

app.delete("/delete_user_many", async (req, res) => {
    console.log(req.body)
    try {
        // deleteMany
        const output = await userModel.deleteMany({ age: req.body.age });
        res.status(200).json(output)
    } catch (error) {

        res.status(400).json({ msg: "Error Occured", logs: error.message });

    }


    res.status(200).json(req.body);


})

// ====================== ROUTES END ======================




app.listen(5000,
    () => {
        console.log("Server Started")
    });