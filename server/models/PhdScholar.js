const mongoose = require('mongoose');

const phdScholarSchema = new mongoose.Schema({
  personalDetails: {
    firstName: String,
    middleName: String,
    lastName: String,
    dateOfBirth: Date,
    nationality: String,
    mobileNumber: String,
  },
  admissionDetails: {
    entranceExamination: String,
    qualifyingExamination: String,
    allotmentNumber: String,
    admissionDate: {
      day: Number,
      month: String,
      year: Number
    },
    department: String,
    usn: String,
    srn: String,
    modeOfProgram: String,  // Full Time/Part Time - Internal/External
  },
  researchDetails: {
    researchSupervisor: String,
    researchCoSupervisor: String,
    doctoralCommittee: {
      member1: String,
      member2: String,
      member3: String,
      member4: String
    },
  },
  courseWork: [{
    course: String,
    subjectCode: String,
    subjectName: String,
    subjectGrade: String,
    status: String,
    eligibilityDate: Date
  }],
  phdMilestones: {
    courseworkCompletionDate: Date,
    dcMeetings: [Date],  // Dates for Doctoral Committee Meetings
    comprehensiveExamDate: Date,
    proposalDefenseDate: Date,
    openSeminarDate1: Date,
    preSubmissionSeminarDate: Date,
    synopsisSubmissionDate: Date,
    thesisSubmissionDate: Date,
    thesisDefenseDate: Date,
    awardDate: Date
  },
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
