import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  reportedBy: { type: String, required: true },
  description: { type: String, required: true },
  severity: { 
    type: String, 
    required: true, 
    enum: ['LOW', 'MEDIUM', 'HIGH'] 
  },
  diagnosis: { type: String },
  recommendedReusableParts: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const reusablePartSchema = new mongoose.Schema({
  componentId: { type: String },
  name: { type: String, required: true },
  compatibleTypes: [{ type: String }],
  condition: { 
    type: String, 
    required: true, 
    enum: ['GOOD', 'FAIR', 'POOR'] 
  },
  extractedFromIssueId: { type: String },
});

const specsSchema = new mongoose.Schema({
  cpu: { type: String },
  ram: { type: String },
  storage: { type: String },
  model: { type: String },
  serial: { type: String },
});

const locationSchema = new mongoose.Schema({
  site: { type: String, required: true },
  room: { type: String },
  shelf: { type: String },
});

const itemSchema = new mongoose.Schema({
  assetTag: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['COMPUTER', 'CPU', 'PRINTER', 'SCANNER', 'MONITOR', 'SPEAKER', 'OTHER'] 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['NEW', 'OLD', 'ALIVE', 'DEAD', 'PHASED_OUT'] 
  },
  specs: specsSchema,
  issueHistory: [issueSchema],
  reusableParts: [reusablePartSchema],
  location: locationSchema,
  notes: { type: String },
  softDeleted: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default mongoose.models.Item || mongoose.model('Item', itemSchema);

