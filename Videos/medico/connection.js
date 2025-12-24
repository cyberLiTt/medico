const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
   console.log('Connected to MongoDB');

  // try {
  //   await mongoose.connection.collection('departments').dropIndex('doctors.email_1');
  //   console.log('✅ Index dropped: doctors.email_1');
  // } catch (err) {
  //   console.error('⚠️ Failed to drop index:', err.message);
  // } finally {
  //   mongoose.disconnect();
  // }
}).catch((err) => console.error('MongoDB error:', err));
