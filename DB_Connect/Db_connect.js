import mongoose from "mongoose";

const Db_connect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log('Mongo connect to', conn.connection.host)
    } catch (error) {
        console.error(error)
    }
}

export default Db_connect