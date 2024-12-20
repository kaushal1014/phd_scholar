import mongoose, { Schema, Document, Model } from 'mongoose';

interface PhdScholar extends Document {
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
        scheduledDate: Date;
        actualDate: Date;
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

const phdScholarSchema = new Schema<PhdScholar>({
  personalDetails: {
    firstName: { type: String,  default: "" },
    middleName: { type: String },
    lastName: { type: String,  default: "" },
    dateOfBirth: { type: Date,  default: "" },
    nationality: { type: String,  default: "" },
    mobileNumber: { type: String,  default: "" },
  },
  admissionDetails: {
    entranceExamination: { type: String,  default: "" },
    qualifyingExamination: { type: String,  default: "" },
    allotmentNumber: { type: String,  default: "" },
    admissionDate: { type: Date,  default: "" },
    department: { type: String,  default: "" },
    usn: { type: String,  default: "" },
    srn: { type: String,  default: "" },
    modeOfProgram: { type: String,  default: "" },
  },
  researchSupervisor: { type: String,  default: "" },
  researchCoSupervisor: { type: String },
  doctoralCommittee: {
    members: [
      {
        name: { type: String,  default: "" },
      },
    ],
  },
  courseWork1: {
    subjectCode: { type: String,  default: "" },
    subjectName: { type: String,  default: "" },
    subjectGrade: { type: String,  default: "" },
    status: { type: String,  default: "" },
    eligibilityDate: { type: Date, default: null },
  },
  courseWork2: {
    subjectCode: { type: String,  default: "" },
    subjectName: { type: String,  default: "" },
    subjectGrade: { type: String,  default: "" },
    status: { type: String,  default: "" },
    eligibilityDate: { type: Date,  default: null },
  },
  courseWork3: {
    subjectCode: { type: String,  default: "" },
    subjectName: { type: String,  default: "" },
    subjectGrade: { type: String,  default: "" },
    status: { type: String,  default: "" },
    eligibilityDate: { type: Date,  default: null },
  },
  courseWork4: {
    subjectCode: { type: String,  default: "" },
    subjectName: { type: String,  default: "" },
    subjectGrade: { type: String,  default: "" },
    status: { type: String,  default: "" },
    eligibilityDate: { type: Date,  default: null },
  },
  phdMilestones: {
    courseworkCompletionDate: {
      coursework1: { type: Date,  default: null },
      coursework2: { type: Date,  default: null },
      coursework3: { type: Date,  default: null },
      coursework4: { type: Date,  default: null },
    },
    dcMeetings: {
      DCM: [
        {
          scheduledDate: { type: Date, default: null },
          actualDate: { type: Date, default: null },
        },
      ],
    },
    comprehensiveExamDate: { type: Date, default: null },
    proposalDefenseDate: { type: Date, default: null },
    openSeminarDate1: { type: Date, default: null },
    preSubmissionSeminarDate: { type: Date, default: null },
    synopsisSubmissionDate: { type: Date, default: null },
    thesisSubmissionDate: { type: Date, default: null },
    thesisDefenseDate: { type: Date, default: null },
    awardOfDegreeDate: { type: Date, default: null },
  },
  publications: {
    journals: [
      {
        title: { type: String,  default: "" },
        journalName: { type: String,  default: "" },
        publicationYear: { type: Number,  default: "0" },
        volumeNumber: { type: String,  default: "" },
        issueNumber: { type: String,  default: "" },
        pageNumbers: { type: String,  default: "" },
        impactFactor: { type: Number,  default: "0" },
      },
    ],
    conferences: [
      {
        title: { type: String,  default: "" },
        conferenceName: { type: String,  default: "" },
        publicationYear: { type: Number,  default: "0" },
      },
    ],
  },
});


const PhDScholar: Model<PhdScholar> = mongoose.models.PhD_Scholar || mongoose.model<PhdScholar>('PhD_Scholar', phdScholarSchema);

export default PhDScholar;