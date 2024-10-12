import mongoose, { Document, Schema } from 'mongoose';

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
    member1: string;
    member2: string;
    member3: string;
    member4: string;
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
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    nationality: { type: String, required: true },
    mobileNumber: { type: String, required: true },
  },
  admissionDetails: {
    entranceExamination: { type: String, required: true },
    qualifyingExamination: { type: String, required: true },
    allotmentNumber: { type: String, required: true },
    admissionDate: { type: Date, required: true },
    department: { type: String, required: true },
    usn: { type: String, required: true },
    srn: { type: String, required: true },
    modeOfProgram: { type: String, required: true },
  },
  researchSupervisor: { type: String, required: true },
  researchCoSupervisor: { type: String },
  doctoralCommittee: {
    member1: { type: String, required: true },
    member2: { type: String, required: true },
    member3: { type: String, required: true },
    member4: { type: String, required: true },
  },
  courseWork1: {
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    subjectGrade: { type: String, required: true },
    status: { type: String, required: true },
    eligibilityDate: { type: Date, required: true },
  },
  courseWork2: {
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    subjectGrade: { type: String, required: true },
    status: { type: String, required: true },
    eligibilityDate: { type: Date, required: true },
  },
  courseWork3: {
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    subjectGrade: { type: String, required: true },
    status: { type: String, required: true },
    eligibilityDate: { type: Date, required: true },
  },
  courseWork4: {
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    subjectGrade: { type: String, required: true },
    status: { type: String, required: true },
    eligibilityDate: { type: Date, required: true },
  },
  phdMilestones: {
    courseworkCompletionDate: {
      coursework1: { type: Date, required: true },
      coursework2: { type: Date, required: true },
      coursework3: { type: Date, required: true },
      coursework4: { type: Date, required: true },
    },
    dcMeetings: {
      DCM: [
        {
          scheduledDate: { type: Date, required: true },
          actualDate: { type: Date, required: true },
        },
      ],
    },
    comprehensiveExamDate: { type: Date, required: true },
    proposalDefenseDate: { type: Date, required: true },
    openSeminarDate1: { type: Date, required: true },
    preSubmissionSeminarDate: { type: Date, required: true },
    synopsisSubmissionDate: { type: Date, required: true },
    thesisSubmissionDate: { type: Date, required: true },
    thesisDefenseDate: { type: Date, required: true },
    awardOfDegreeDate: { type: Date, required: true },
  },
  publications: {
    journals: [
      {
        title: { type: String, required: true },
        journalName: { type: String, required: true },
        publicationYear: { type: Number, required: true },
        volumeNumber: { type: String, required: true },
        issueNumber: { type: String, required: true },
        pageNumbers: { type: String, required: true },
        impactFactor: { type: Number, required: true },
      },
    ],
    conferences: [
      {
        title: { type: String, required: true },
        conferenceName: { type: String, required: true },
        publicationYear: { type: Number, required: true },
      },
    ],
  },
});

export default mongoose.model<PhdScholar>('PhD_Scholar', phdScholarSchema);
