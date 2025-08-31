export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'EMPLOYEE' | 'TECHNICIAN' | 'HOS' | 'HOD' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  department?: string;
  section?: string;
  lastLoginAt?: string;
  avatar?: string;
};

export type Issue = {
  reportedBy: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  diagnosis?: string;
  recommendedReusableParts?: string[];
  createdAt: string;
};

export type ReusablePartInfo = {
  componentId: string;
  name: string;
  compatibleTypes: string[];
  condition: 'GOOD' | 'FAIR' | 'POOR';
  extractedFromIssueId?: string;
};

export type Item = {
  _id: string;
  assetTag?: string;
  name: string;
  type: 'COMPUTER' | 'CPU' | 'PRINTER' | 'SCANNER' | 'MONITOR' | 'SPEAKER' | 'OTHER';
  status: 'NEW' | 'OLD' | 'ALIVE' | 'DEAD' | 'PHASED_OUT';
  specs: {
    cpu?: string;
    ram?: string;
    storage?: string;
    model?: string;
    serial?: string;
  };
  issueHistory: Issue[];
  reusableParts: ReusablePartInfo[];
  location: {
    site: string;
    room?: string;
    shelf?: string;
  };
  notes?: string;
  softDeleted: boolean;
};

export type Component = {
  _id: string;
  name: string;
  category: 'RAM' | 'HDD' | 'SSD' | 'PSU' | 'GPU' | 'MOTHERBOARD' | 'FAN' | 'CABLE' | 'OTHER';
  specs?: Record<string, any>;
  compatibilityTags: string[];
  quantity: number;
  fromItemId?: string;
  condition: 'GOOD' | 'FAIR' | 'POOR';
  lastUsedAt?: string;
  softDeleted: boolean;
};

export type KnowledgeBase = {
  _id: string;
  title: string;
  productType: string;
  symptoms: string[];
  steps: { order: number; text: string }[];
  attachments?: { name: string; url: string }[];
  createdBy: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
  sources?: string[];
  relatedComponents?: string[];
  version: number;
  changelog: { at: string; by: string; note: string }[];
  softDeleted: boolean;
};

export type WorkLog = {
  _id: string;
  openedBy: string;
  assignedTo?: string;
  itemId?: string;
  issueSummary: string;
  stepsTaken: { at: string; by: string; note: string }[];
  resolution?: string;
  usedComponents: { componentId: string; qty: number }[];
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  closedAt?: string;
};

export type AuditLog = {
  _id: string;
  actorId: string;
  action: string;
  entity: 'USER' | 'ITEM' | 'COMPONENT' | 'KB' | 'WORKLOG';
  entityId: string;
  meta?: Record<string, any>;
  at: string;
};

export type AnalyticsSnapshot = {
  _id: string;
  period: 'MONTH' | 'YEAR';
  periodKey: string;
  topComponentsUsed: { componentId: string; count: number }[];
  failureCauses: { cause: string; count: number }[];
  forecasts: {
    componentsDemand: { componentCategory: string; forecastNext3Months: number[] }[];
    failureCauseLikelihoods?: { cause: string; next3Months: number[] }[];
  };
};
