import mongoose from 'mongoose';

function connectToDb() {
  mongoose.connect(process.env.DB_CONNECT,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error("MongoDB connection error:", err));
}

export default connectToDb;
