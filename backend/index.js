import express from "express"
import dotenv from "dotenv"
import cors from "cors" 

import configureDB from "./config/db.js"
import { checkSchema } from "express-validator"
import { userAuthenticate } from "./app/Middlewares/UserAuthenticate.js"
import { authorizedUser } from "./app/Middlewares/AuthorizedUser.js"

const app = express();
app.use(cors())
const port = 3777 
dotenv.config()
configureDB()
app.use(express.json())

import userCtrl from "./app/Controllers/UserController.js"
import bookingCtrl from "./app/Controllers/BookingController.js"
import eventCtrl from "./app/Controllers/EventController.js"
import reviewCtrl from "./app/Controllers/ReviewController.js"
import paymentCtrl from "./app/Controllers/PaymentController.js"

// import validators 
import { loginValidationSchema,registerValidationSchema } from "./app/Validators/UserValidation.js"
import idValidationSchema from "./app/Validators/idValidation.js"
import { bookingValidationSchema } from "./app/Validators/BookingValidation.js"
import { eventValidationSchema } from "./app/Validators/EventValidation.js"
import { reviewValidationSchema } from "./app/Validators/ReviewValidation.js"
import { paymentValidationSchema } from "./app/Validators/PaymentValidation.js"
import { eventUpdateValidationSchema } from "./app/Validators/EventUpdateVAlidationSchema.js"


// this User Routes
app.get('/users',userAuthenticate,userCtrl.list)
app.post('/register',checkSchema(registerValidationSchema),userCtrl.register)
app.post('/login',checkSchema(loginValidationSchema),userCtrl.login)
app.get('/account',userAuthenticate,userCtrl.account) 
app.delete('/account/:id',userAuthenticate,checkSchema(idValidationSchema),userCtrl.remove)
app.put('/update/account/:id',userAuthenticate,checkSchema(idValidationSchema),userCtrl.modify)
app.put('/activation/:id',userAuthenticate,authorizedUser(['admin']),checkSchema(idValidationSchema),userCtrl.activation)

// Event Routes
app.get("/events",eventCtrl.list) 
app.post("/event",userAuthenticate,checkSchema(eventValidationSchema),eventCtrl.create)
app.get("/event/:id",userAuthenticate,checkSchema(idValidationSchema),eventCtrl.show)
app.put("/event/:id",userAuthenticate,checkSchema(idValidationSchema),checkSchema(eventUpdateValidationSchema),eventCtrl.update)
app.delete("/event/:id",userAuthenticate,checkSchema(idValidationSchema),eventCtrl.remove)
app.put("/event/verify/:id",userAuthenticate,authorizedUser(["admin"],checkSchema(idValidationSchema),eventCtrl.verify))

// review routes
app.get("/reviews",reviewCtrl.list)
app.post("/review",userAuthenticate,checkSchema(reviewValidationSchema),reviewCtrl.create)
app.get("/review/:id",userAuthenticate,checkSchema(idValidationSchema),reviewCtrl.show)
app.put("/review/:id",userAuthenticate,checkSchema(idValidationSchema),checkSchema(reviewValidationSchema),reviewCtrl.update)
app.delete("/review/:id",userAuthenticate,checkSchema(idValidationSchema),reviewCtrl.remove)

// Booking Routes

app.get("/bookings",bookingCtrl.list)
app.post("/booking",userAuthenticate,bookingCtrl.create)
app.get("/booking/:id",userAuthenticate,checkSchema(idValidationSchema),bookingCtrl.show)
app.put("/booking/:id",userAuthenticate,checkSchema(idValidationSchema),checkSchema(bookingValidationSchema),bookingCtrl.update)
app.delete("/booking/:id",userAuthenticate,checkSchema(idValidationSchema),bookingCtrl.remove)
app.get('/booking/event/:id', bookingCtrl.getBookingsByEvent);

// Payment Routes

app.get("/payments",paymentCtrl.list)
app.post("/payment",userAuthenticate,checkSchema(paymentValidationSchema),paymentCtrl.create)
app.get("/payment/:id",userAuthenticate,checkSchema(idValidationSchema),paymentCtrl.show)
app.put("/payment/:id",userAuthenticate,checkSchema(idValidationSchema),checkSchema(paymentValidationSchema),paymentCtrl.update)
app.delete("/payment/:id",userAuthenticate,checkSchema(idValidationSchema),paymentCtrl.remove)
app.post('/payment/razor',userAuthenticate,paymentCtrl.createRazorpayOrder)
app.post('/payments/verify-razorpay',userAuthenticate,paymentCtrl.verifyRazorpayPayment)


app.listen(port,()=>{
    console.log("server is running on the port",port)
})