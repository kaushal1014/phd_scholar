import connectDB from '@/server/db'; // Import your DB connection function
import PhDScholar from '@/server/models/PhdScholar'; // Import the PhD Scholar model
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectDB();
    console.log('Database connected');

    // Parse the request body
    const data = await req.json();

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
        admissionDate: new Date(`${data.admissionDateYear}-${data.admissionDateMonth}-${data.admissionDateDay}`),
        department: data.department as string,
        usn: data.usn as string,
        srn: data.srn as string,
        modeOfProgram: data.modeOfProgram as string, // Full-Time/Part-Time - Internal/External
      },
      researchDetails: {
        researchSupervisor: data.researchSupervisor as string,
        researchCoSupervisor: data.researchCoSupervisor as string,
        doctoralCommittee: {
          member1: data.doctoralCommitteeMember1 as string,
          member2: data.doctoralCommitteeMember2 as string,
          member3: data.doctoralCommitteeMember3 as string,
          member4: data.doctoralCommitteeMember4 as string,
        },
      },
      coursework: [
        {
          subjectCode: data.courseWork1SubjectCode as string,
          subjectName: data.courseWork1SubjectName as string,
          subjectGrade: data.courseWork1SubjectGrade as string,
          status: data.courseWork1Status as string,
          eligibilityDate: new Date(data.courseWork1EligibilityDate),
        },
        {
          subjectCode: data.courseWork2SubjectCode as string,
          subjectName: data.courseWork2SubjectName as string,
          subjectGrade: data.courseWork2SubjectGrade as string,
          status: data.courseWork2Status as string,
          eligibilityDate: new Date(data.courseWork2EligibilityDate),
        },
        {
          subjectCode: data.courseWork3SubjectCode as string,
          subjectName: data.courseWork3SubjectName as string,
          subjectGrade: data.courseWork3SubjectGrade as string,
          status: data.courseWork3Status as string,
          eligibilityDate: new Date(data.courseWork3EligibilityDate),
        },
        {
          subjectCode: data.courseWork4SubjectCode as string,
          subjectName: data.courseWork4SubjectName as string,
          subjectGrade: data.courseWork4SubjectGrade as string,
          status: data.courseWork4Status as string,
          eligibilityDate: new Date(data.courseWork4EligibilityDate),
        },
      ],
      phdMilestones: {
        courseworkCompletionDates: [
          new Date(data.courseworkCompletionDate1),
          new Date(data.courseworkCompletionDate2),
          new Date(data.courseworkCompletionDate3),
          new Date(data.courseworkCompletionDate4),
        ],
        comprehensiveExamDate: new Date(data.comprehensiveExamDate),
        proposalDefenseDate: new Date(data.proposalDefenseDate),
        openSeminarDate1: new Date(data.openSeminarDate1),
        preSubmissionSeminarDate: new Date(data.preSubmissionSeminarDate),
        synopsisSubmissionDate: new Date(data.synopsisSubmissionDate),
        thesisSubmissionDate: new Date(data.thesisSubmissionDate),
        thesisDefenseDate: new Date(data.thesisDefenseDate),
        awardOfDegreeDate: new Date(data.awardOfDegreeDate),
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
