import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import ticketRoutes from './routes/ticketRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', authRoutes);
app.use('/api/tickets', ticketRoutes);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error(`Error: ${error}`);
        }
        process.exit(1);
    }
};

// Only connect if not in test mode (optional, but good practice)
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
