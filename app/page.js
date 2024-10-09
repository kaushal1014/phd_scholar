'use client';
import { useState } from 'react';

const PhDScholarForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    mobileNumber: '',
    entranceExamination: '',
    qualifyingExamination: '',
    allotmentNumber: '',
    admissionDateDay: '',
    admissionDateMonth: '',
    admissionDateYear: '',
    department: '',
    usn: '',
    srn: '',
    modeOfProgram: '',
    researchSupervisor: '',
    researchCoSupervisor: '',
    doctoralCommitteeMember1: '',
    doctoralCommitteeMember2: '',
    doctoralCommitteeMember3: '',
    doctoralCommitteeMember4: '',
    coursework: [],
    phdMilestones: {},
    publications: {}
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send formData to your API endpoint
    try {
      const response = await fetch('/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>PhD Scholar Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Personal Details */}
        <fieldset>
          <legend>Personal Details</legend>
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <br />

          <label>Middle Name:</label>
          <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
          <br />

          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          <br />

          <label>Date of Birth:</label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
          <br />

          <label>Nationality:</label>
          <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required />
          <br />

          <label>Mobile Number:</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
          <br />
        </fieldset>

        {/* Admission Details */}
        <fieldset>
          <legend>Admission Details</legend>
          <label>Entrance Examination:</label>
          <input type="text" name="entranceExamination" value={formData.entranceExamination} onChange={handleChange} />
          <br />

          <label>Qualifying Examination:</label>
          <input type="text" name="qualifyingExamination" value={formData.qualifyingExamination} onChange={handleChange} />
          <br />

          <label>Allotment Number:</label>
          <input type="text" name="allotmentNumber" value={formData.allotmentNumber} onChange={handleChange} />
          <br />

          <label>Admission Date (Day):</label>
          <input type="number" name="admissionDateDay" value={formData.admissionDateDay} onChange={handleChange} />
          <br />

          <label>Admission Date (Month):</label>
          <input type="text" name="admissionDateMonth" value={formData.admissionDateMonth} onChange={handleChange} />
          <br />

          <label>Admission Date (Year):</label>
          <input type="number" name="admissionDateYear" value={formData.admissionDateYear} onChange={handleChange} />
          <br />

          <label>Department:</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} />
          <br />

          <label>USN:</label>
          <input type="text" name="usn" value={formData.usn} onChange={handleChange} />
          <br />

          <label>SRN:</label>
          <input type="text" name="srn" value={formData.srn} onChange={handleChange} />
          <br />

          <label>Mode of Program:</label>
          <input type="text" name="modeOfProgram" value={formData.modeOfProgram} onChange={handleChange} />
          <br />
        </fieldset>

        {/* Research Details */}
        <fieldset>
          <legend>Research Details</legend>
          <label>Research Supervisor:</label>
          <input type="text" name="researchSupervisor" value={formData.researchSupervisor} onChange={handleChange} />
          <br />

          <label>Research Co-Supervisor:</label>
          <input type="text" name="researchCoSupervisor" value={formData.researchCoSupervisor} onChange={handleChange} />
          <br />

          <label>Doctoral Committee Member 1:</label>
          <input type="text" name="doctoralCommitteeMember1" value={formData.doctoralCommitteeMember1} onChange={handleChange} />
          <br />

          <label>Doctoral Committee Member 2:</label>
          <input type="text" name="doctoralCommitteeMember2" value={formData.doctoralCommitteeMember2} onChange={handleChange} />
          <br />

          <label>Doctoral Committee Member 3:</label>
          <input type="text" name="doctoralCommitteeMember3" value={formData.doctoralCommitteeMember3} onChange={handleChange} />
          <br />

          <label>Doctoral Committee Member 4:</label>
          <input type="text" name="doctoralCommitteeMember4" value={formData.doctoralCommitteeMember4} onChange={handleChange} />
          <br />
        </fieldset>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PhDScholarForm;
