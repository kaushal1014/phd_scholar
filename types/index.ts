import mongoose, { Schema, Document } from "mongoose";
export interface PhdScholar {
  _id: string;
  personalDetails: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: Date;
    nationality: string;
    mobileNumber: string;
  };
  admissionDetails: {
    entranceExamination: string;
    qualifyingExamination: string;
    allotmentNumber: string;
    admissionDate: Date;
    department: string;
    usn: string;
    srn: string;
    modeOfProgram: string;
  };
  researchSupervisor: string;
  researchCoSupervisor?: string;
  doctoralCommittee: {
    members: {
      name: string;
    }[];
  };
  courseWork1: {
    subjectCode: string;
    subjectName: string;
    subjectGrade: string;
    status: string;
    eligibilityDate: Date;
  };
  courseWork2: {
    subjectCode: string;
    subjectName: string;
    subjectGrade: string;
    status: string;
    eligibilityDate: Date;
  };
  courseWork3: {
    subjectCode: string;
    subjectName: string;
    subjectGrade: string;
    status: string;
    eligibilityDate: Date;
  };
  courseWork4: {
    subjectCode: string;
    subjectName: string;
    subjectGrade: string;
    status: string;
    eligibilityDate: Date;
  };
  phdMilestones: {
    courseworkCompletionDate: {
      coursework1: Date;
      coursework2: Date;
      coursework3: Date;
      coursework4: Date;
    };
    dcMeetings: {
      DCM: {
        _id: string;
        scheduledDate: Date;
        actualDate: Date;
        happened: boolean; 
        summary: string
      }[];
    };
    comprehensiveExamDate: Date;
    proposalDefenseDate: Date;
    openSeminarDate1: Date;
    preSubmissionSeminarDate: Date;
    synopsisSubmissionDate: Date;
    thesisSubmissionDate: Date;
    thesisDefenseDate: Date;
    awardOfDegreeDate: Date;
  };
  publications: {
    journals: {
      title: string;
      journalName: string;
      publicationYear: number;
      volumeNumber: string;
      issueNumber: string;
      pageNumbers: string;
      impactFactor: number;
    }[];
    conferences: {
      title: string;
      conferenceName: string;
      publicationYear: number;
    }[];
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;
  notes: string;
  phdScholar: PhdScholar;
}

interface Certificate extends Document {
  phdScholar: mongoose.Schema.Types.ObjectId;
  courseNumber: string;
  fileName: string;
  fileUrl: string;
  uploadDate: Date;
  approvalStatus: "pending" | "approved" | "rejected";
  approvedBy?: mongoose.Schema.Types.ObjectId | null;
  approvalDate?: Date | null;
  rejectionReason?: string;
}