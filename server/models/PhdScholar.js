const mongoose = require('mongoose');

const phdScholarSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  dateOfBirth: Date,
  nationality: String,
  mobileNumber: String,
  // Admission and Academic Details
  admissionDetails: String,
  entranceExamination: String,
  qualifyingExamination: String,
  allotmentNumber: String,
  admissionDate: {
    date: Number,
    month: String,
    year: Number
  },
  department: String,
  usn: String,
  srn: String,
  modeOfProgram: String,  // Full Time/Part Time - Internal/External
  // Research Supervisors and Doctoral Committee
  researchSupervisor: String,
  researchCoSupervisor: String,
  doctoralCommittee: {
    member1: String,
    member2: String,
    member3: String,
    member4: String
  },
  // Course Work
  courseWork: [{
    course: String,
    subjectCode: String,
    subjectName: String,
    subjectGrade: String,
    status: String,
    eligibilityDate: String
  }],
  // PhD Milestones
  phdMilestones: {
    courseworkCompletionDate: Date,
    dcMeetings: [Date],
    comprehensiveExamDate: Date,
    proposalDefenseDate: Date,
    openSeminarDate1: Date,
    preSubmissionSeminarDate: Date,
    synopsisSubmissionDate: Date,
    thesisSubmissionDate: Date,
    thesisDefenseDate: Date,
    awardDate: Date
  },
  // Publications
  publications: {
    journals: [{
      title: String,
      journalName: String,
      publicationYear: Number,
      volumeNumber: String,
      issueNumber: String,
      pageNumbers: String,
      impactFactor: Number
    }],
    conferences: [{
      title: String,
      conferenceName: String,
      publicationYear: Number
    }]
  }
});

module.exports = mongoose.model('PhD_Scholar', phdScholarSchema);
