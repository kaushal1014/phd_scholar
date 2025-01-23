export interface PhdScholar {
  personalDetails: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: Date | null;
    nationality: string;
    mobileNumber: string;
  };
  admissionDetails: {
    entranceExamination: string;
    qualifyingExamination: string;
    allotmentNumber: string;
    admissionDate: Date | null;
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
    eligibilityDate: Date | null;
  };
  courseWork2: {
    subjectCode: string;
    subjectName: string;
    subjectGrade: string;
    status: string;
    eligibilityDate: Date | null;
  };
  courseWork3: {
    subjectCode: string;
    subjectName: string;
    subjectGrade: string;
    status: string;
    eligibilityDate: Date | null;
  };
  courseWork4: {
    subjectCode: string;
    subjectName: string;
    subjectGrade: string;
    status: string;
    eligibilityDate: Date | null;
  };
  phdMilestones: {
    courseworkCompletionDate: {
      coursework1: Date | null;
      coursework2: Date | null;
      coursework3: Date | null;
      coursework4: Date | null;
    };
    dcMeetings: {
      DCM: {
        scheduledDate: Date | null;
        actualDate: Date | null;
      }[];
    };
    comprehensiveExamDate: Date | null;
    proposalDefenseDate: Date | null;
    openSeminarDate1: Date | null;
    preSubmissionSeminarDate: Date | null;
    synopsisSubmissionDate: Date | null;
    thesisSubmissionDate: Date | null;
    thesisDefenseDate: Date | null;
    awardOfDegreeDate: Date | null;
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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  phdScholar: PhdScholar;
}