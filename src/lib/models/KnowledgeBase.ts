import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  text: { type: String, required: true },
});

const attachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const changelogSchema = new mongoose.Schema({
  at: { type: Date, required: true },
  by: { type: String, required: true },
  note: { type: String, required: true },
});

const knowledgeBaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  productType: { type: String, required: true },
  symptoms: [{ type: String }],
  steps: [stepSchema],
  attachments: [attachmentSchema],
  createdBy: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  sources: [{ type: String }],
  relatedComponents: [{ type: String }],
  version: { type: Number, default: 1 },
  changelog: [changelogSchema],
  softDeleted: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default mongoose.models.KnowledgeBase || mongoose.model('KnowledgeBase', knowledgeBaseSchema);

