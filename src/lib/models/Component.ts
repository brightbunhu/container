import mongoose from 'mongoose';

const componentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['RAM', 'HDD', 'SSD', 'PSU', 'GPU', 'MOTHERBOARD', 'FAN', 'CABLE', 'OTHER'] 
  },
  specs: { type: mongoose.Schema.Types.Mixed },
  compatibilityTags: [{ type: String }],
  quantity: { type: Number, required: true, default: 1 },
  fromItemId: { type: String },
  condition: { 
    type: String, 
    required: true, 
    enum: ['GOOD', 'FAIR', 'POOR'] 
  },
  lastUsedAt: { type: Date },
  softDeleted: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default mongoose.models.Component || mongoose.model('Component', componentSchema);

