const mongoose =require('mongoose')
// const slugify =require('slugify')

// const User =require('./usersModule')


const LeaseSchema = new mongoose.Schema({
    StudentName :{
        type:String,
        required:[true,`O'quvchining ismini kiriting`]
    },
    OrdredBook :{
        type:String,
        required:[true,`Kitob nomini kiriting`]
    },
    OrderedTime:{
        type:Date,
        default:Date.now
    },
    ClassOfStudent:{
        type:Number,
        required: [true,`O'quvchining gurux raqamini qoshing`]
    },
    major:{
        type:String,
        required:[true,`O'quvchining o'quv yo'nalishini koriting`],
        enum:['Civil','Electrical','Architecture']
    },
    DeadLine:{
        type:Date,
    },
    StudentNumber:{
        type:Number,
        required:[true,`O'quvchining telefon raqamini kiriting!`]
    }
})

const Lease =mongoose.model('Lease',LeaseSchema)
module.exports =Lease