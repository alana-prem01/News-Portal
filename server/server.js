require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const adminPostRoutes = require('./routes/adminPostRoutes');
const publicPostRoutes = require('./routes/publicPostRoutes');

require('./utils/scheduler');

const app = express();

// Connect to database
connectDB().then(async () => {
    const User = require('./models/User');
    const argon2 = require('argon2');
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
        const hashedPassword = await argon2.hash('admin123');
        await User.create({
            name: 'System Admin',
            email: 'alanaprem001@gmail.com',
            password: hashedPassword,
            role: 'Admin',
        });
        console.log('Default Admin created: alanaprem001@gmail.com / admin123');
    }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin/posts', adminPostRoutes);
app.use('/api/public/posts', publicPostRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('News Portal API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});