import mongoose from 'mongoose'
const configureDB=async()=>{
    try{
        const db=await mongoose.connect("mongodb://localhost:27017/event-booking-app")
        console.log('connected to db')
    }catch(err){
        console.log('error in connection to db ',err)
    }

}
export default configureDB