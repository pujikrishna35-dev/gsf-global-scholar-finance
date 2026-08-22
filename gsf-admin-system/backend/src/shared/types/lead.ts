import { LeadClassification } from '../constants/leadClassification';
import { LeadStatus } from '../constants/leadStatus';

export interface LeadActivity {
  id: string;
  leadId: string;
  actionType: 'CREATED' | 'CLASSIFICATION_CHANGED' | 'STATUS_CHANGED' | 'NOTE_ADDED' | 'FOLLOWUP_SCHEDULED' | 'CONTACTED' | 'DOCUMENTS_REQUESTED';
  title: string;
  description: string;
  performedBy: string;
  createdAt: string;
}

export interface FollowUpItem {
  id: string;
  leadId: string;
  studentName: string;
  phone: string;
  classification: LeadClassification;
  date: string;
  time: string;
  assignedEmployee: string;
  notes: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  country: string;
  university: string;
  course: string;
  intake: string;
  loanAmount: number;
  loanType: 'Collateral' | 'Non-Collateral' | 'Flexible';
  hasCollateral: boolean;
  studentSelectedClassification: LeadClassification;
  leadClassification: LeadClassification;
  status: LeadStatus;
  source: string;
  campaign?: string;
  assignedEmployee: string;
  otpVerified?: boolean;
  qualificationLevel?: 'UG' | 'PG';
  admissionStatus?: 'CONFIRMED' | 'PROCESSING';
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  studyDestination?: string;
  preferredCountry?: string;
  courseLevel?: string;
  courseName?: string;
  targetCourse?: string;
  targetUniversity?: string;
  requestedLoanAmount?: string;
  coApplicant?: string;
  collateral?: string;
  contactMethod?: string;
  approxTuitionFee?: string;
  activities?: LeadActivity[];
  followUps?: FollowUpItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  hotLeads: number;
  mediumLeads: number;
  coldLeads: number;
  newLeads: number;
  todayFollowups: number;
  totalApplications: number;
  sanctionedLoans: number;
  disbursedLoans: number;
  totalDisbursedAmount: number;
}
