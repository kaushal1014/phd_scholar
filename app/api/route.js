import connectDB from '@/server/db'; // Import your DB connection function
import PhDScholar from '@/server/models/PhdScholar'; // Import the PhD Scholar model
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();
    console.log('Database connected');

    // Parse the request body
    const data = await req.json();

    // Create a new instance of PhD Scholar
    const newScholar = new PhDScholar({
      personalDetails: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        nationality: data.nationality,
        mobileNumber: data.mobileNumber,
      },
      admissionDetails: {
        entranceExamination: data.entranceExamination,
        qualifyingExamination: data.qualifyingExamination,
        allotmentNumber: data.allotmentNumber,
        admissionDate: {
          day: data.admissionDateDay,
          month: data.admissionDateMonth,
          year: data.admissionDateYear,
        },
        department: data.department,
        usn: data.usn,
        srn: data.srn,
        modeOfProgram: data.modeOfProgram,
      },
      researchDetails: {
        researchSupervisor: data.researchSupervisor,
        researchCoSupervisor: data.researchCoSupervisor,
        doctoralCommittee: {
          member1: data.doctoralCommitteeMember1,
          member2: data.doctoralCommitteeMember2,
          member3: data.doctoralCommitteeMember3,
          member4: data.doctoralCommitteeMember4,
        },
      },
      coursework: [
        {
          subjectCode: data.courseWork1SubjectCode,
          subjectName: data.courseWork1SubjectName,
          subjectGrade: data.courseWork1SubjectGrade,
          status: data.courseWork1Status,
          eligibilityDate: data.courseWork1EligibilityDate,
        },
        {
          subjectCode: data.courseWork2SubjectCode,
          subjectName: data.courseWork2SubjectName,
          subjectGrade: data.courseWork2SubjectGrade,
          status: data.courseWork2Status,
          eligibilityDate: data.courseWork2EligibilityDate,
        },
        {
          subjectCode: data.courseWork3SubjectCode,
          subjectName: data.courseWork3SubjectName,
          subjectGrade: data.courseWork3SubjectGrade,
          status: data.courseWork3Status,
          eligibilityDate: data.courseWork3EligibilityDate,
        },
        {
          subjectCode: data.courseWork4SubjectCode,
          subjectName: data.courseWork4SubjectName,
          subjectGrade: data.courseWork4SubjectGrade,
          status: data.courseWork4Status,
          eligibilityDate: data.courseWork4EligibilityDate,
        },
      ],
      phdMilestones: {
        courseworkCompletionDates: [
          data.courseworkCompletionDate1,
          data.courseworkCompletionDate2,
          data.courseworkCompletionDate3,
          data.courseworkCompletionDate4,
        ],
        comprehensiveExamDate: data.comprehensiveExamDate,
        proposalDefenseDate: data.proposalDefenseDate,
        openSeminarDate1: data.openSeminarDate1,
        preSubmissionSeminarDate: data.preSubmissionSeminarDate,
        synopsisSubmissionDate: data.synopsisSubmissionDate,
        thesisSubmissionDate: data.thesisSubmissionDate,
        thesisDefenseDate: data.thesisDefenseDate,
        awardOfDegreeDate: data.awardOfDegreeDate,
      },
      publications: {
        journals: Array.isArray(data.journals) ? data.journals.map(journal => ({
          title: journal.title,
          journalName: journal.journalName,
          publicationYear: journal.publicationYear,
          volumeNumber: journal.volumeNumber,
          issueNumber: journal.issueNumber,
          pageNumbers: journal.pageNumbers,
          impactFactor: journal.impactFactor,
        })) : [],
        conferences: Array.isArray(data.conferences) ? data.conferences.map(conference => ({
          title: conference.title,
          conferenceName: conference.conferenceName,
          publicationYear: conference.publicationYear,
        })) : [],
      },
    });

    // Save the new scholar to the database
    await newScholar.save();

    return NextResponse.json({ message: 'PhD Scholar data saved successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error saving PhD Scholar:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
