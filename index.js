import express from "express"

import configureDB from "./config/db.js"

const app = express();
const port = 3672
configureDB()
app.use(express.json())



app.listen(port,()=>{
    console.log("server is running on the port",port)
})