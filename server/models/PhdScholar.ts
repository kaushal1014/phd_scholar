import mongoose, { Schema, Document, Model } from 'mongoose';
import { string } from 'zod';

interface PhdScholar extends Document {
  user?: mongoose.Schema.Types.ObjectId;
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
        happened: boolean; 
        summary: string;
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  personalDetails: {
    firstName: { type: String, default: "" },
    middleName: { type: String },
    lastName: { type: String, default: "" },
    dateOfBirth: { type: Date, default: "" },
    nationality: { type: String, default: "" },
    mobileNumber: { type: String, default: "" },
  },
  admissionDetails: {
    entranceExamination: { type: String, default: "" },
    qualifyingExamination: { type: String, default: "" },
    allotmentNumber: { type: String, default: "" },
    admissionDate: { type: Date, default: "" },
    department: { type: String, default: "" },
    usn: { type: String, default: "" },
    srn: { type: String, default: "" },
    modeOfProgram: { type: String, default: "" },
  },
  researchSupervisor: { type: String, default: "" },
  researchCoSupervisor: { type: String },
  doctoralCommittee: {
    members: [
      {
        name: { type: String, default: "" },
      },
    ],
  },
  courseWork1: {
    subjectCode: { type: String, default: "" },
    subjectName: { type: String, default: "" },
    subjectGrade: { type: String, default: "" },
    status: { type: String, default: "" },
    eligibilityDate: { type: Date, default: null },
  },
  courseWork2: {
    subjectCode: { type: String, default: "" },
    subjectName: { type: String, default: "" },
    subjectGrade: { type: String, default: "" },
    status: { type: String, default: "" },
    eligibilityDate: { type: Date, default: null },
  },
  courseWork3: {
    subjectCode: { type: String, default: "" },
    subjectName: { type: String, default: "" },
    subjectGrade: { type: String, default: "" },
    status: { type: String, default: "" },
    eligibilityDate: { type: Date, default: null },
  },
  courseWork4: {
    subjectCode: { type: String, default: "" },
    subjectName: { type: String, default: "" },
    subjectGrade: { type: String, default: "" },
    status: { type: String, default: "" },
    eligibilityDate: { type: Date, default: null },
  },
  phdMilestones: {
    courseworkCompletionDate: {
      coursework1: { type: Date, default: null },
      coursework2: { type: Date, default: null },
      coursework3: { type: Date, default: null },
      coursework4: { type: Date, default: null },
    },
    dcMeetings: {
      DCM: [
        {
          scheduledDate: { type: Date, default: null },
          actualDate: { type: Date, default: null },
          summary: { type: String, default: null},
          happened: { type: Boolean, default: false },
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
        title: { type: String, default: "" },
        journalName: { type: String, default: "" },
        publicationYear: { type: Number, default: 0 },
        volumeNumber: { type: String, default: "" },
        issueNumber: { type: String, default: "" },
        pageNumbers: { type: String, default: "" },
        impactFactor: { type: Number, default: 0 },
        doi: { type: String, default: "" }, // Add DOI field
      },
    ],
    conferences: [
      {
        title: { type: String, default: "" },
        conferenceName: { type: String, default: "" },
        publicationYear: { type: Number, default: 0 },
      },
    ],
  },
});

phdScholarSchema.pre("save", async function (next) {
  if (this.isModified("personalDetails.firstName") || this.isModified("personalDetails.lastName") || this.isModified("personalDetails.email")) {
    await mongoose.model("User").updateOne(
      { phdScholar: this._id }, // Find linked User
      { 
        $set: { 
          firstName: this.personalDetails.firstName,
          lastName: this.personalDetails.lastName,
        }
      }
    );
  }
  next();
});



const PhdScholar = mongoose.models.PhdScholar || mongoose.model('PhdScholar', phdScholarSchema);

export default PhdScholar;