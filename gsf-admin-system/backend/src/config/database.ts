import { Lead, LeadActivity, FollowUpItem } from '../../../shared/types/lead';
import { AdminUser } from '../../../shared/types/admin';
import { AdminNotification } from '../../../shared/types/notification';

// In-Memory / File Persistent Store for Standalone Executable Backend
export const initialAdmins: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Senior Finance Admin',
    email: 'admin@gsf.com',
    role: 'SuperAdmin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-2',
    name: 'Counselor Priya',
    email: 'priya@gsf.com',
    role: 'Counselor',
    createdAt: new Date().toISOString()
  }
];

export let leadsStore: Lead[] = [
  {
    id: 'lead-101',
    name: 'Rohan Sharma',
    phone: '+91 98765 43210',
    email: 'rohan.sharma@example.com',
    destination: 'USA',
    country: 'United States',
    university: 'Northeastern University',
    course: 'MS in Computer Science',
    intake: 'Fall 2026',
    loanAmount: 6500000, // 65 Lakhs
    loanType: 'Non-Collateral',
    hasCollateral: false,
    studentSelectedClassification: 'HOT',
    leadClassification: 'HOT',
    status: 'Application Submitted',
    source: 'GSF Website',
    campaign: 'US STEM Fall 2026',
    assignedEmployee: 'Anand V.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    activities: [
      {
        id: 'act-1',
        leadId: 'lead-101',
        actionType: 'CREATED',
        title: 'Lead Created',
        description: 'Student submitted application form on GSF Website selecting HOT classification.',
        performedBy: 'Student (Website API)',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act-2',
        leadId: 'lead-101',
        actionType: 'CONTACTED',
        title: 'Admin Contacted Student',
        description: 'Assigned to Anand V. Initial profile verification call completed.',
        performedBy: 'Anand V.',
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act-3',
        leadId: 'lead-101',
        actionType: 'STATUS_CHANGED',
        title: 'Status Updated',
        description: 'Status changed from New to Application Submitted.',
        performedBy: 'Anand V.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    followUps: [
      {
        id: 'fol-1',
        leadId: 'lead-101',
        studentName: 'Rohan Sharma',
        phone: '+91 98765 43210',
        classification: 'HOT',
        date: new Date().toISOString().split('T')[0], // Today
        time: '11:00 AM',
        assignedEmployee: 'Anand V.',
        notes: 'Follow up on financial co-applicant ITR submission',
        status: 'Pending',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'lead-102',
    name: 'Ananya Verma',
    phone: '+91 91234 56789',
    email: 'ananya.v@example.com',
    destination: 'UK',
    country: 'United Kingdom',
    university: 'University of Manchester',
    course: 'MSc Data Science',
    intake: 'Fall 2026',
    loanAmount: 4500000,
    loanType: 'Non-Collateral',
    hasCollateral: false,
    studentSelectedClassification: 'HOT',
    leadClassification: 'HOT',
    status: 'Sanctioned',
    source: 'GSF Website',
    campaign: 'UK Masters 2026',
    assignedEmployee: 'Counselor Priya',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    activities: [
      {
        id: 'act-10',
        leadId: 'lead-102',
        actionType: 'CREATED',
        title: 'Lead Created',
        description: 'Student submitted application form on GSF Website.',
        performedBy: 'Student (Website API)',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act-11',
        leadId: 'lead-102',
        actionType: 'STATUS_CHANGED',
        title: 'Official Sanction Issued',
        description: 'Loan sanctioned for £42,000 by HDFC Credila.',
        performedBy: 'Counselor Priya',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    followUps: []
  },
  {
    id: 'lead-103',
    name: 'Karthik Raja',
    phone: '+91 94444 12345',
    email: 'karthik.r@example.com',
    destination: 'Canada',
    country: 'Canada',
    university: 'University of Toronto',
    course: 'MEng Mechanical',
    intake: 'Winter 2027',
    loanAmount: 5500000,
    loanType: 'Collateral',
    hasCollateral: true,
    studentSelectedClassification: 'MEDIUM',
    leadClassification: 'MEDIUM',
    status: 'Documents Pending',
    source: 'Google Search',
    assignedEmployee: 'Counselor Priya',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    activities: [
      {
        id: 'act-20',
        leadId: 'lead-103',
        actionType: 'CREATED',
        title: 'Lead Created',
        description: 'Student selected MEDIUM classification.',
        performedBy: 'Student',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    followUps: [
      {
        id: 'fol-2',
        leadId: 'lead-103',
        studentName: 'Karthik Raja',
        phone: '+91 94444 12345',
        classification: 'MEDIUM',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        time: '02:30 PM',
        assignedEmployee: 'Counselor Priya',
        notes: 'Check for property valuation document upload',
        status: 'Pending',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'lead-104',
    name: 'Siddharth Patel',
    phone: '+91 97777 88888',
    email: 'sid.patel@example.com',
    destination: 'Germany',
    country: 'Germany',
    university: 'TU Munich',
    course: 'MS Automotive Engineering',
    intake: 'Fall 2026',
    loanAmount: 3500000,
    loanType: 'Non-Collateral',
    hasCollateral: false,
    studentSelectedClassification: 'COLD',
    leadClassification: 'COLD',
    status: 'Contacted',
    source: 'Education Fair',
    assignedEmployee: 'Unassigned',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    activities: [],
    followUps: []
  },
  {
    id: 'lead-105',
    name: 'Meera Nair',
    phone: '+91 99999 11111',
    email: 'meera.nair@example.com',
    destination: 'Australia',
    country: 'Australia',
    university: 'University of Sydney',
    course: 'Master of Public Health',
    intake: 'July 2026',
    loanAmount: 6000000,
    loanType: 'Collateral',
    hasCollateral: true,
    studentSelectedClassification: 'HOT',
    leadClassification: 'HOT',
    status: 'Disbursed',
    source: 'GSF Website',
    assignedEmployee: 'Anand V.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    activities: [
      {
        id: 'act-30',
        leadId: 'lead-105',
        actionType: 'STATUS_CHANGED',
        title: 'Tuition Fee Disbursed',
        description: 'First installment disbursed directly to university account.',
        performedBy: 'Anand V.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    followUps: []
  }
];

export let notificationsStore: AdminNotification[] = [
  {
    id: 'notif-101',
    leadId: 'lead-101',
    type: 'NEW_LEAD',
    title: '🔥 New Hot Lead',
    message: 'Rohan Sharma submitted a new loan enquiry for USA.',
    classification: 'HOT',
    studentName: 'Rohan Sharma',
    country: 'USA',
    university: 'Northeastern University',
    intake: 'Fall 2026',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 mins ago
  },
  {
    id: 'notif-102',
    leadId: 'lead-102',
    type: 'NEW_LEAD',
    title: '🔥 New Hot Lead',
    message: 'Ananya Verma submitted a new loan enquiry for UK.',
    classification: 'HOT',
    studentName: 'Ananya Verma',
    country: 'UK',
    university: 'University of Manchester',
    intake: 'Fall 2026',
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 mins ago
  },
  {
    id: 'notif-103',
    leadId: 'lead-103',
    type: 'NEW_LEAD',
    title: '🟡 New Medium Lead',
    message: 'Karthik Raja submitted a new loan enquiry for Canada.',
    classification: 'MEDIUM',
    studentName: 'Karthik Raja',
    country: 'Canada',
    university: 'University of Toronto',
    intake: 'Winter 2027',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  }
];

export interface StudentAccount {
  studentId: string;
  fullName: string;
  email: string;
  mobile: string;
  applicationId: string;
  isActive: boolean;
  isPasswordSet: boolean;
  passwordHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentLoanApplication {
  applicationId: string; // Format: GSF-2026-XXXXX
  studentId: string;
  leadId: string;
  fullName: string;
  email: string;
  mobile: string;
  country: string;
  university: string;
  course: string;
  qualificationLevel: string; // 'UG' | 'PG'
  intake: string;
  admissionStatus: string; // 'CONFIRMED' | 'PROCESSING'
  loanAmount: number;
  address: string;
  applicationStatus: 'SUBMITTED' | 'DOCUMENTS_PENDING' | 'DOCUMENTS_VERIFIED' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'APPROVED' | 'REJECTED' | 'ON_HOLD' | 'COMPLETED';
  loanStatus: 'NOT_STARTED' | 'PROCESSING' | 'UNDER_REVIEW' | 'SANCTIONED' | 'DISBURSED' | 'REJECTED' | 'ON_HOLD';
  createdAt: string;
  updatedAt: string;
}

export interface StudentUpdateItem {
  id: string;
  applicationId: string;
  studentId: string;
  date: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface StudentNotificationItem {
  id: string;
  applicationId: string;
  studentId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Initial Seed Student Accounts & Applications
export let studentsStore: StudentAccount[] = [
  {
    studentId: 'student-101',
    fullName: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    mobile: '+919876543210',
    applicationId: 'GSF-2026-00101',
    isActive: true,
    isPasswordSet: false,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    studentId: 'student-102',
    fullName: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    mobile: '+919876543211',
    applicationId: 'GSF-2026-00102',
    isActive: true,
    isPasswordSet: false,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export let applicationsStore: StudentLoanApplication[] = [
  {
    applicationId: 'GSF-2026-00101',
    studentId: 'student-101',
    leadId: 'lead-101',
    fullName: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    mobile: '+919876543210',
    country: 'United States',
    university: 'Northeastern University',
    course: 'MS in Computer Science',
    qualificationLevel: 'PG',
    intake: 'Fall 2026',
    admissionStatus: 'CONFIRMED',
    loanAmount: 6500000,
    address: '42 MG Road, Indiranagar, Bengaluru, Karnataka 560038',
    applicationStatus: 'UNDER_REVIEW',
    loanStatus: 'PROCESSING',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    applicationId: 'GSF-2026-00102',
    studentId: 'student-102',
    leadId: 'lead-102',
    fullName: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    mobile: '+919876543211',
    country: 'United Kingdom',
    university: 'University of Manchester',
    course: 'MSc Data Science',
    qualificationLevel: 'PG',
    intake: 'Fall 2026',
    admissionStatus: 'PROCESSING',
    loanAmount: 4500000,
    address: '15 Park Street, Connaught Place, New Delhi 110001',
    applicationStatus: 'DOCUMENTS_VERIFIED',
    loanStatus: 'PROCESSING',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export let studentUpdatesStore: StudentUpdateItem[] = [
  {
    id: 'update-101-1',
    applicationId: 'GSF-2026-00101',
    studentId: 'student-101',
    date: new Date().toISOString().split('T')[0],
    title: 'Application Under Review',
    description: 'Your application is currently under review by the GSF credit assessment team.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'update-101-2',
    applicationId: 'GSF-2026-00101',
    studentId: 'student-101',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    title: 'Documents Received',
    description: 'Your academic and financial documents have been successfully verified.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'update-101-3',
    applicationId: 'GSF-2026-00101',
    studentId: 'student-101',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    title: 'Application Submitted',
    description: 'Your education loan application was successfully submitted.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

export let studentNotificationsStore: StudentNotificationItem[] = [
  {
    id: 'snotif-101-1',
    applicationId: 'GSF-2026-00101',
    studentId: 'student-101',
    title: '🔔 Application Status Updated',
    message: 'Your application status is now Application Under Review.',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'snotif-101-2',
    applicationId: 'GSF-2026-00101',
    studentId: 'student-101',
    title: '🔔 Documents Verified',
    message: 'All submitted loan documents have been approved.',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export interface StudentDocumentItem {
  id: string;
  applicationId: string;
  studentId: string;
  leadId: string;
  documentName: string;
  status: 'VERIFIED' | 'PENDING' | 'ACTION_REQUIRED';
  visibleToStudent: boolean;
  fileUrl?: string;
  updatedAt: string;
}

export let studentDocumentsStore: StudentDocumentItem[] = [
  {
    id: 'doc-101-1',
    applicationId: 'GSF-2026-00101',
    studentId: 'student-101',
    leadId: 'lead-101',
    documentName: 'Admission Letter',
    status: 'VERIFIED',
    visibleToStudent: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'doc-101-2',
    applicationId: 'GSF-2026-00101',
    studentId: 'student-101',
    leadId: 'lead-101',
    documentName: 'Academic Records',
    status: 'VERIFIED',
    visibleToStudent: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'doc-101-3',
    applicationId: 'GSF-2026-00101',
    studentId: 'student-101',
    leadId: 'lead-101',
    documentName: 'Income Proof & IT Returns',
    status: 'ACTION_REQUIRED',
    visibleToStudent: true,
    updatedAt: new Date().toISOString()
  }
];


