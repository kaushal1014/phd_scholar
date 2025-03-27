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

    // Check if the user already exists
    const existingUser = await User.findOne({ email: data?.email });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(data?.password || "default_password", salt);

    // Create a new user
    const newUser = new User({
      email: data?.email || "",
      password: hashedPassword,
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
    });
    const savedUser = await newUser.save();

    // Helper function to validate and return a date or null
    const validateDate = (date: any) => {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    };

    // Create a new PhD Scholar linked to the new user
    const newScholar = new PhDScholar({
      user: newUser._id,
      personalDetails: {
        firstName: data?.firstName || "",
        middleName: data?.middleName || "",
        lastName: data?.lastName || "",
        dateOfBirth: validateDate(data?.dateOfBirth),
        nationality: data?.nationality || "",
        mobileNumber: data?.mobileNumber || "",
      },
      admissionDetails: {
        entranceExamination: data?.entranceExamination || "",
        qualifyingExamination: data?.qualifyingExamination || "",
        allotmentNumber: data?.allotmentNumber || "",
        admissionDate: validateDate(data?.admissionDate),
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
        eligibilityDate: validateDate(data?.courseWork1EligibilityDate),
      },
      courseWork2: {
        subjectCode: data?.courseWork2SubjectCode || "",
        subjectName: data?.courseWork2SubjectName || "",
        subjectGrade: data?.courseWork2SubjectGrade || "",
        status: data?.courseWork2Status || "",
        eligibilityDate: validateDate(data?.courseWork2EligibilityDate),
      },
      courseWork3: {
        subjectCode: data?.courseWork3SubjectCode || "",
        subjectName: data?.courseWork3SubjectName || "",
        subjectGrade: data?.courseWork3SubjectGrade || "",
        status: data?.courseWork3Status || "",
        eligibilityDate: validateDate(data?.courseWork3EligibilityDate),
      },
      courseWork4: {
        subjectCode: data?.courseWork4SubjectCode || "",
        subjectName: data?.courseWork4SubjectName || "",
        subjectGrade: data?.courseWork4SubjectGrade || "",
        status: data?.courseWork4Status || "",
        eligibilityDate: validateDate(data?.courseWork4EligibilityDate),
      },
      phdMilestones: {
        courseworkCompletionDate: {
          coursework1: validateDate(data?.courseworkCompletionDate1),
          coursework2: validateDate(data?.courseworkCompletionDate2),
          coursework3: validateDate(data?.courseworkCompletionDate3),
          coursework4: validateDate(data?.courseworkCompletionDate4),
        },
        dcMeetings: {
          DCM: Array.isArray(data?.dcMeetings)
            ? data.dcMeetings.map((meeting: any) => ({
                scheduledDate: validateDate(meeting?.scheduledDate),
                actualDate: validateDate(meeting?.actualDate),
              }))
            : [],
        },
        comprehensiveExamDate: validateDate(data?.comprehensiveExamDate),
        proposalDefenseDate: validateDate(data?.proposalDefenseDate),
        openSeminarDate1: validateDate(data?.openSeminarDate1),
        preSubmissionSeminarDate: validateDate(data?.preSubmissionSeminarDate),
        synopsisSubmissionDate: validateDate(data?.synopsisSubmissionDate),
        thesisSubmissionDate: validateDate(data?.thesisSubmissionDate),
        thesisDefenseDate: validateDate(data?.thesisDefenseDate),
        awardOfDegreeDate: validateDate(data?.awardOfDegreeDate),
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
