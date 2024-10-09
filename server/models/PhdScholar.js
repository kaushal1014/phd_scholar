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
  researchSupervisor: String,
  researchCoSupervisor: String,
  doctoralCommittee: {
      member1: String,
      member2: String,
      member3: String,
      member4: String
  },
/*
  courseWork: [{
    subjectCode: String,
    subjectName: String,
    subjectGrade: String,
    status: String,
    eligibilityDate: Date
  }],
*/
courseWork1: {
  subjectCode: String,
  subjectName: String,
  subjectGrade: String,
  status: String,
  eligibilityDate: Date
},
  courseWork2: {
    subjectCode: String,
    subjectName: String,
    subjectGrade: String,
    status: String,
    eligibilityDate: Date
  },
  courseWork3: {
    subjectCode: String,
    subjectName: String,
    subjectGrade: String,
    status: String,
    eligibilityDate: Date
  },
  courseWork4: {
    subjectCode: String,
    subjectName: String,
    subjectGrade: String,
    status: String,
    eligibilityDate: Date
  },
  
  phdMilestones: {
    courseworkCompletionDate:{
      coursework1:Date,
      coursework2:Date,
      coursework3:Date,
      coursework4:Date,
    },
    dcMeetings:{
      DCM:[{
        scheduledDate:Date, 
        actualDate:Date
      }]
    },  // Dates for Doctoral Committee Meetings
    
    
    comprehensiveExamDate: Date,
    proposalDefenseDate: Date,
    openSeminarDate1: Date,
    preSubmissionSeminarDate: Date,
    synopsisSubmissionDate: Date,
    thesisSubmissionDate: Date,
    thesisDefenseDate: Date,
    awardOfDegreeDate: Date
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
