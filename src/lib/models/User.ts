import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['EMPLOYEE', 'TECHNICIAN', 'HOS', 'HOD', 'ADMIN'],
    default: 'EMPLOYEE'
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['ACTIVE', 'SUSPENDED'],
    default: 'ACTIVE'
  },
  department: { type: String, default: '' },
  section: { type: String, default: '' },
  lastLoginAt: { type: Date },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema);

