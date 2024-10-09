import connectDB from '@/server/db'; // Import your DB connection function
import PhDScholar from '@/server/models/PhdScholar'; // Import the PhD Scholar model

export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();
    console.log('connected')

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
      // You can add coursework, milestones, publications if necessary
    });

    // Save the new scholar to the database
    await newScholar.save();

    return new Response(JSON.stringify({ message: 'PhD Scholar data saved successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Error saving PhD Scholar:', err);
    return new Response(JSON.stringify({ message: 'Error saving PhD Scholar' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
