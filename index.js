const express = require("express")
const {NotFoundError, ServerError} = require("./middleware/error-handler")
const connectDB = require("./db/connect")
const route = require("./routes/route")

require("dotenv").config()


const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// port number
app.set("port", process.env.PORT || 5000)


app.use("/api/v1", route)


const start = async ()=>{
    try{
        // connecting to database
        await connectDB(process.env.MONGO_URI)
        // server startup
        app.listen(app.get("port"), ()=>{
            console.log("Listening on port", app.get("port"))
        })
    } catch (err) {
        console.log({
            message : err
        })

    }
}

start()

// error-handling middleware
app.use(NotFoundError);
app.use(ServerError);







