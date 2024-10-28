import connectDB from "@/server/db";
import User from "@/server/models/userModel";
import PhDScholar from "@/server/models/PhdScholar";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

// Ensure DB is connected
connectDB();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("hi");
    console.log(data.firstName);

    // Check if the user already exists
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
}


    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(data.password, salt);


    // Create a new PhD Scholar linked to the new user
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

    // Save the new PhD Scholar
    const savedScholar = await newScholar.save();

        // Create a new user
        const newUser = new User({
          email:data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
        });
        const savedUser = await newUser.save();
    // Update the user to link to the PhD Scholar
    savedUser.phdScholar = savedScholar._id;
    await savedUser.save();

    return NextResponse.json({
      message: "User and PhD Scholar created successfully",
      success: true,
      savedUser,
      savedScholar
    });

  } catch (error: any) {
    console.error("Error creating User and PhD Scholar:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
