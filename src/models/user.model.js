const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true, "Email is required"],
        trim : true,
        unique : [true, "Email is already taken"],
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill the valid email"],
    }, 
    username : {
        type : String, 
        unique : [true, "Username is already taken"],
        required : [true, "Username is required"]
    },
    password : {
        type : String, 
        required : [true, "Password is required"],
        minlength : [6, "Password must be greater than length 6"]
    },
    role : {
        type : String, 
        enum : ['user', 'admin', 'theatre_manager'],
        default : 'user',
        select : false
    },
    managedTheatre : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "theatre",
        default : null
    }
}, {
    timestamps : true
})


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        return;
    }

    try {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash

        return;
    } catch(err) {
        return next(err);
    }
})

// to compare the password
userSchema.methods.compare = async function (password) {
    return bcrypt.compare(password, this.password)
}


const userModel = mongoose.model('user', userSchema)

module.exports = userModel