import connectDB from '@/server/db'; // Import your DB connection function
import PhDScholar from '@/server/models/PhdScholar'; // Import the PhD Scholar model
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();    
    // Connect to the database
    await connectDB();
    console.log('Database connected');

    // Create a new instance of PhD Scholar
    const newScholar = new PhDScholar({
      personalDetails: {
        firstName: data.firstName as string,
        middleName: data.middleName as string,
        lastName: data.lastName as string,
        dateOfBirth: new Date(data.dateOfBirth),
        nationality: data.nationality as string,
        mobileNumber: data.mobileNumber as string,
      },
      admissionDetails: {
        entranceExamination: data.entranceExamination as string,
        qualifyingExamination: data.qualifyingExamination as string,
        allotmentNumber: data.allotmentNumber as string,
        admissionDate: new Date(data.admissionDate), // Ensure this is correctly formatted
        department: data.department as string,
        usn: data.usn as string,
        srn: data.srn as string,
        modeOfProgram: data.modeOfProgram as string, // Full-Time/Part-Time - Internal/External
      },
      researchSupervisor: data.researchSupervisor as string,
      researchCoSupervisor: data.researchCoSupervisor as string,
      doctoralCommittee: {
        member1: data.doctoralCommitteeMember1 as string,
        member2: data.doctoralCommitteeMember2 as string,
        member3: data.doctoralCommitteeMember3 as string,
        member4: data.doctoralCommitteeMember4 as string,
      },
      courseWork1: {
        subjectCode: data.courseWork1SubjectCode as string,
        subjectName: data.courseWork1SubjectName as string,
        subjectGrade: data.courseWork1SubjectGrade as string,
        status: data.courseWork1Status as string,
        eligibilityDate: new Date(data.courseWork1EligibilityDate),
      },
      courseWork2: {
        subjectCode: data.courseWork2SubjectCode as string,
        subjectName: data.courseWork2SubjectName as string,
        subjectGrade: data.courseWork2SubjectGrade as string,
        status: data.courseWork2Status as string,
        eligibilityDate: new Date(data.courseWork2EligibilityDate),
      },
      courseWork3: {
        subjectCode: data.courseWork3SubjectCode as string,
        subjectName: data.courseWork3SubjectName as string,
        subjectGrade: data.courseWork3SubjectGrade as string,
        status: data.courseWork3Status as string,
        eligibilityDate: new Date(data.courseWork3EligibilityDate),
      },
      courseWork4: {
        subjectCode: data.courseWork4SubjectCode as string,
        subjectName: data.courseWork4SubjectName as string,
        subjectGrade: data.courseWork4SubjectGrade as string,
        status: data.courseWork4Status as string,
        eligibilityDate: new Date(data.courseWork4EligibilityDate),
      },
      phdMilestones: {
        courseworkCompletionDate: {
          coursework1: new Date(data.courseworkCompletionDate1),
          coursework2: new Date(data.courseworkCompletionDate2),
          coursework3: new Date(data.courseworkCompletionDate3),
          coursework4: new Date(data.courseworkCompletionDate4),
        },
        dcMeetings: {
          DCM: Array.isArray(data.dcMeetings)
            ? data.dcMeetings.map((meeting: any) => ({
                scheduledDate: new Date(meeting.scheduledDate),
                actualDate: meeting.actualDate ? new Date(meeting.actualDate) : undefined, // Handle optional actualDate
              }))
            : [],
        },
        comprehensiveExamDate: data.comprehensiveExamDate ? new Date(data.comprehensiveExamDate) : undefined,
        proposalDefenseDate: data.proposalDefenseDate ? new Date(data.proposalDefenseDate) : undefined,
        openSeminarDate1: data.openSeminarDate1 ? new Date(data.openSeminarDate1) : undefined,
        preSubmissionSeminarDate: data.preSubmissionSeminarDate ? new Date(data.preSubmissionSeminarDate) : undefined,
        synopsisSubmissionDate: data.synopsisSubmissionDate ? new Date(data.synopsisSubmissionDate) : undefined,
        thesisSubmissionDate: data.thesisSubmissionDate ? new Date(data.thesisSubmissionDate) : undefined,
        thesisDefenseDate: data.thesisDefenseDate ? new Date(data.thesisDefenseDate) : undefined,
        awardOfDegreeDate: data.awardOfDegreeDate ? new Date(data.awardOfDegreeDate) : undefined,
      },
      publications: {
        journals: Array.isArray(data.journals)
          ? data.journals.map((journal: any) => ({
              title: journal.title as string,
              journalName: journal.journalName as string,
              publicationYear: journal.publicationYear as number,
              volumeNumber: journal.volumeNumber as string,
              issueNumber: journal.issueNumber as string,
              pageNumbers: journal.pageNumbers as string,
              impactFactor: journal.impactFactor as number,
            }))
          : [],
        conferences: Array.isArray(data.conferences)
          ? data.conferences.map((conference: any) => ({
              title: conference.title as string,
              conferenceName: conference.conferenceName as string,
              publicationYear: conference.publicationYear as number,
            }))
          : [],
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
