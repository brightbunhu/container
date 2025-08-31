import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  at: { type: Date, required: true },
  by: { type: String, required: true },
  note: { type: String, required: true },
});

const usedComponentSchema = new mongoose.Schema({
  componentId: { type: String, required: true },
  qty: { type: Number, required: true },
});

const workLogSchema = new mongoose.Schema({
  openedBy: { type: String, required: true },
  assignedTo: { type: String },
  itemId: { type: String },
  issueSummary: { type: String, required: true },
  stepsTaken: [stepSchema],
  resolution: { type: String },
  usedComponents: [usedComponentSchema],
  status: { 
    type: String, 
    required: true, 
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'OPEN'
  },
  closedAt: { type: Date },
}, {
  timestamps: true
});

export default mongoose.models.WorkLog || mongoose.model('WorkLog', workLogSchema);

