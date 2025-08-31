import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: String,
  type: String,
  status: String,
  // ...other fields...
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);