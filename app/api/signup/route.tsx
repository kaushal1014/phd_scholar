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

    console.log("Received data:", data);

    // Check if the user already exists
    const existingUser = await User.findOne({ email: data?.email });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(data?.password || "default_password", salt);

    // Create a new PhD Scholar linked to the new user
    const newScholar = new PhDScholar({
      personalDetails: {
        firstName: data?.firstName || "",
        middleName: data?.middleName || "",
        lastName: data?.lastName || "",
        dateOfBirth: data?.dateOfBirth ? new Date(data.dateOfBirth) : null,
        nationality: data?.nationality || "",
        mobileNumber: data?.mobileNumber || "",
      },
      admissionDetails: {
        entranceExamination: data?.entranceExamination || "",
        qualifyingExamination: data?.qualifyingExamination || "",
        allotmentNumber: data?.allotmentNumber || "",
        admissionDate: data?.admissionDate ? new Date(data.admissionDate) : null,
        department: data?.department || "",
        usn: data?.usn || "",
        srn: data?.srn || "",
        modeOfProgram: data?.modeOfProgram || "",
      },
      researchSupervisor: data?.researchSupervisor || "",
      researchCoSupervisor: data?.researchCoSupervisor || "",
      doctoralCommittee: {
        members: data?.doctoralCommitteeMembers || [],
      },
      courseWork1: {
        subjectCode: data?.courseWork1SubjectCode || "",
        subjectName: data?.courseWork1SubjectName || "",
        subjectGrade: data?.courseWork1SubjectGrade || "",
        status: data?.courseWork1Status || "",
        eligibilityDate: data?.courseWork1EligibilityDate ? new Date(data.courseWork1EligibilityDate) : null,
      },
      courseWork2: {
        subjectCode: data?.courseWork2SubjectCode || "",
        subjectName: data?.courseWork2SubjectName || "",
        subjectGrade: data?.courseWork2SubjectGrade || "",
        status: data?.courseWork2Status || "",
        eligibilityDate: data?.courseWork2EligibilityDate ? new Date(data.courseWork2EligibilityDate) : null,
      },
      courseWork3: {
        subjectCode: data?.courseWork3SubjectCode || "",
        subjectName: data?.courseWork3SubjectName || "",
        subjectGrade: data?.courseWork3SubjectGrade || "",
        status: data?.courseWork3Status || "",
        eligibilityDate: data?.courseWork3EligibilityDate ? new Date(data.courseWork3EligibilityDate) : null,
      },
      courseWork4: {
        subjectCode: data?.courseWork4SubjectCode || "",
        subjectName: data?.courseWork4SubjectName || "",
        subjectGrade: data?.courseWork4SubjectGrade || "",
        status: data?.courseWork4Status || "",
        eligibilityDate: data?.courseWork4EligibilityDate ? new Date(data.courseWork4EligibilityDate) : null,
      },
      phdMilestones: {
        courseworkCompletionDate: {
          coursework1: data?.courseworkCompletionDate1 ? new Date(data.courseworkCompletionDate1) : null,
          coursework2: data?.courseworkCompletionDate2 ? new Date(data.courseworkCompletionDate2) : null,
          coursework3: data?.courseworkCompletionDate3 ? new Date(data.courseworkCompletionDate3) : null,
          coursework4: data?.courseworkCompletionDate4 ? new Date(data.courseworkCompletionDate4) : null,
        },
        dcMeetings: {
          DCM: Array.isArray(data?.dcMeetings)
            ? data.dcMeetings.map((meeting: any) => ({
                scheduledDate: meeting?.scheduledDate ? new Date(meeting.scheduledDate) : null,
                actualDate: meeting?.actualDate ? new Date(meeting.actualDate) : null,
              }))
            : [],
        },
        comprehensiveExamDate: data?.comprehensiveExamDate ? new Date(data.comprehensiveExamDate) : null,
        proposalDefenseDate: data?.proposalDefenseDate ? new Date(data.proposalDefenseDate) : null,
        openSeminarDate1: data?.openSeminarDate1 ? new Date(data.openSeminarDate1) : null,
        preSubmissionSeminarDate: data?.preSubmissionSeminarDate ? new Date(data.preSubmissionSeminarDate) : null,
        synopsisSubmissionDate: data?.synopsisSubmissionDate ? new Date(data.synopsisSubmissionDate) : null,
        thesisSubmissionDate: data?.thesisSubmissionDate ? new Date(data.thesisSubmissionDate) : null,
        thesisDefenseDate: data?.thesisDefenseDate ? new Date(data.thesisDefenseDate) : null,
        awardOfDegreeDate: data?.awardOfDegreeDate ? new Date(data.awardOfDegreeDate) : null,
      },
      publications: {
        journals: Array.isArray(data?.journals)
          ? data.journals.map((journal: any) => ({
              title: journal?.title || "",
              journalName: journal?.journalName || "",
              publicationYear: journal?.publicationYear || 0,
              volumeNumber: journal?.volumeNumber || "",
              issueNumber: journal?.issueNumber || "",
              pageNumbers: journal?.pageNumbers || "",
              impactFactor: journal?.impactFactor || 0,
            }))
          : [],
        conferences: Array.isArray(data?.conferences)
          ? data.conferences.map((conference: any) => ({
              title: conference?.title || "",
              conferenceName: conference?.conferenceName || "",
              publicationYear: conference?.publicationYear || 0,
            }))
          : [],
      },
    });

    // Save the new PhD Scholar
    const savedScholar = await newScholar.save();

    // Create a new user
    const newUser = new User({
      email: data?.email || "",
      password: hashedPassword,
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
    });
    const savedUser = await newUser.save();

    // Link the user with the PhD Scholar
    savedUser.phdScholar = savedScholar._id;
    await savedUser.save();

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
      savedScholar,
    });
  } catch (error: any) {
    console.error("Error creating User and PhD Scholar:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
