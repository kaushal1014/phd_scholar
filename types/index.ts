export interface PhdScholar {
  admissionDetails: {
    department: string;
    entranceExamination: string;
    qualifyingExamination: string;
    allotmentNumber: string;
    admissionDate: Date | null;
    usn: string;
    srn: string;
    modeOfProgram: string;
  };
  personalDetails: {
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: Date | null;
    nationality: string;
    mobileNumber: string;
  };
  researchDetails: {
    researchSupervisor: string;
    researchCoSupervisor: string;
    doctoralCommitteeMembers: string[];
  };
  courseworkDetails: {
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
  };
  dcMeetings: string[];
  examDates: {
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
    journals: { title: string; journalName: string }[];
    conferences: { title: string; conferenceName: string }[];
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