const express = require("express")
const {NotFoundError, ServerError} = require("./middleware/error-handler")
const connectDB = require("./db/connect")
const form = require("./routes/form")

require("dotenv").config()
const app = express()


app.use(express.json())

// port number
app.set("port", process.env.PORT || 3000)


app.get("/",(req,res)=>{
    res.send("<h1>Homepage</h1>")
})

app.use("/", form)


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
app.use(ServerError)








