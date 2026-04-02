const mongoose = require('mongoose');

const dbConnection = () => {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log('DB Connected!'))
        .catch(err => {
            console.error('DB Error:', err);
            process.exit(1); 
        });
};

module.exports = dbConnection;