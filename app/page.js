'use client';
import { useState } from 'react';
import axios from 'axios';

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
    courseWork1SubjectCode: '',
    courseWork1SubjectName: '',
    courseWork1SubjectGrade: '',
    courseWork1Status: '',
    courseWork1EligibilityDate: '',
    courseWork2SubjectCode: '',
    courseWork2SubjectName: '',
    courseWork2SubjectGrade: '',
    courseWork2Status: '',
    courseWork2EligibilityDate: '',
    courseWork3SubjectCode: '',
    courseWork3SubjectName: '',
    courseWork3SubjectGrade: '',
    courseWork3Status: '',
    courseWork3EligibilityDate: '',
    courseWork4SubjectCode: '',
    courseWork4SubjectName: '',
    courseWork4SubjectGrade: '',
    courseWork4Status: '',
    courseWork4EligibilityDate: '',
    courseworkCompletionDate1: '',
    courseworkCompletionDate2: '',
    courseworkCompletionDate3: '',
    courseworkCompletionDate4: '',
    dcMeetings: [{ scheduledDate: '', actualDate: '' }],
    comprehensiveExamDate: '',
    proposalDefenseDate: '',
    openSeminarDate1: '',
    preSubmissionSeminarDate: '',
    synopsisSubmissionDate: '',
    thesisSubmissionDate: '',
    thesisDefenseDate: '',
    awardOfDegreeDate: '',
    journals: [{ title: '', journalName: '', publicationYear: '', volumeNumber: '', issueNumber: '', pageNumbers: '', impactFactor: '' }],
    conferences: [{ title: '', conferenceName: '', publicationYear: '' }],
  });

  const[message,setMessage]=useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async e=>{
    e.preventDefault();
    try{
    const response= await axios.post('api/',{formData});
    if(response.status===200){
      setMessage(response.data.message);
    }
  }catch(err){
    setMessage('Something went wrong');
    console.log(err);
  }
  
  }

  return (
    <div>
      <h2>PhD Scholar Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Personal Details */}
        <fieldset>
          <legend>Personal Details</legend>
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required /><br />

          <label>Middle Name:</label>
          <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} /><br />

          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required /><br />

          <label>Date of Birth:</label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required /><br />

          <label>Nationality:</label>
          <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required /><br />

          <label>Mobile Number:</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required /><br />
        </fieldset>

        {/* Admission Details */}
        <fieldset>
          <legend>Admission Details</legend>
          <label>Entrance Examination:</label>
          <input type="text" name="entranceExamination" value={formData.entranceExamination} onChange={handleChange} /><br />

          <label>Qualifying Examination:</label>
          <input type="text" name="qualifyingExamination" value={formData.qualifyingExamination} onChange={handleChange} /><br />

          <label>Allotment Number:</label>
          <input type="text" name="allotmentNumber" value={formData.allotmentNumber} onChange={handleChange} /><br />

          <label>Admission Date (Day):</label>
          <input type="number" name="admissionDateDay" value={formData.admissionDateDay} onChange={handleChange} /><br />

          <label>Admission Date (Month):</label>
          <input type="text" name="admissionDateMonth" value={formData.admissionDateMonth} onChange={handleChange} /><br />

          <label>Admission Date (Year):</label>
          <input type="number" name="admissionDateYear" value={formData.admissionDateYear} onChange={handleChange} /><br />

          <label>Department:</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} /><br />

          <label>USN:</label>
          <input type="text" name="usn" value={formData.usn} onChange={handleChange} /><br />

          <label>SRN:</label>
          <input type="text" name="srn" value={formData.srn} onChange={handleChange} /><br />

          <label>Mode of Program:</label>
          <input type="text" name="modeOfProgram" value={formData.modeOfProgram} onChange={handleChange} /><br />
        </fieldset>

        {/* Research Details */}
        <fieldset>
          <legend>Research Details</legend>
          <label>Research Supervisor:</label>
          <input type="text" name="researchSupervisor" value={formData.researchSupervisor} onChange={handleChange} /><br />

          <label>Research Co-Supervisor:</label>
          <input type="text" name="researchCoSupervisor" value={formData.researchCoSupervisor} onChange={handleChange} /><br />

          <label>Doctoral Committee Member 1:</label>
          <input type="text" name="doctoralCommitteeMember1" value={formData.doctoralCommitteeMember1} onChange={handleChange} /><br />

          <label>Doctoral Committee Member 2:</label>
          <input type="text" name="doctoralCommitteeMember2" value={formData.doctoralCommitteeMember2} onChange={handleChange} /><br />

          <label>Doctoral Committee Member 3:</label>
          <input type="text" name="doctoralCommitteeMember3" value={formData.doctoralCommitteeMember3} onChange={handleChange} /><br />

          <label>Doctoral Committee Member 4:</label>
          <input type="text" name="doctoralCommitteeMember4" value={formData.doctoralCommitteeMember4} onChange={handleChange} /><br />
        </fieldset>

        {/* Coursework */}
        <fieldset>
          <legend>Coursework</legend>
          {[1, 2, 3, 4].map((index) => (
            <div key={index}>
              <h4>Coursework {index}</h4>
              <label>Subject Code:</label>
              <input type="text" name={`courseWork${index}SubjectCode`} value={formData[`courseWork${index}SubjectCode`]} onChange={handleChange} /><br />

              <label>Subject Name:</label>
              <input type="text" name={`courseWork${index}SubjectName`} value={formData[`courseWork${index}SubjectName`]} onChange={handleChange} /><br />

              <label>Subject Grade:</label>
              <input type="text" name={`courseWork${index}SubjectGrade`} value={formData[`courseWork${index}SubjectGrade`]} onChange={handleChange} /><br />

              <label>Status:</label>
              <input type="text" name={`courseWork${index}Status`} value={formData[`courseWork${index}Status`]} onChange={handleChange} /><br />

              <label>Eligibility Date:</label>
              <input type="date" name={`courseWork${index}EligibilityDate`} value={formData[`courseWork${index}EligibilityDate`]} onChange={handleChange} /><br />
            </div>
          ))}
        </fieldset>

        {/* PhD Milestones */}
        <fieldset>
          <legend>PhD Milestones</legend>
          {[1, 2, 3, 4].map((index) => (
            <div key={index}>
              <label>Coursework {index} Completion Date:</label>
              <input type="date" name={`courseworkCompletionDate${index}`} value={formData[`courseworkCompletionDate${index}`]} onChange={handleChange} /><br />
            </div>
          ))}

          <label>Comprehensive Exam Date:</label>
          <input type="date" name="comprehensiveExamDate" value={formData.comprehensiveExamDate} onChange={handleChange} /><br />

          <label>Proposal Defense Date:</label>
          <input type="date" name="proposalDefenseDate" value={formData.proposalDefenseDate} onChange={handleChange} /><br />

          <label>Open Seminar Date 1:</label>
          <input type="date" name="openSeminarDate1" value={formData.openSeminarDate1} onChange={handleChange} /><br />

          <label>Pre-Submission Seminar Date:</label>
          <input type="date" name="preSubmissionSeminarDate" value={formData.preSubmissionSeminarDate} onChange={handleChange} /><br />

          <label>Synopsis Submission Date:</label>
          <input type="date" name="synopsisSubmissionDate" value={formData.synopsisSubmissionDate} onChange={handleChange} /><br />

          <label>Thesis Submission Date:</label>
          <input type="date" name="thesisSubmissionDate" value={formData.thesisSubmissionDate} onChange={handleChange} /><br />

          <label>Thesis Defense Date:</label>
          <input type="date" name="thesisDefenseDate" value={formData.thesisDefenseDate} onChange={handleChange} /><br />

          <label>Award of Degree Date:</label>
          <input type="date" name="awardOfDegreeDate" value={formData.awardOfDegreeDate} onChange={handleChange} /><br />
        </fieldset>

        {/* Publications */}
        <fieldset>
        <legend>Publications</legend>
        <h4>Journals</h4>
        {Array.isArray(formData.journals) && formData.journals.map((journal, index) => (
          <div key={index}>
            <label>Title:</label>
            <input
              type="text"
              name={`journals[${index}].title`}
              value={journal.title}
              onChange={(e) => {
                const updatedJournals = [...formData.journals];
                updatedJournals[index].title = e.target.value;
                setFormData({ ...formData, journals: updatedJournals });
              }}
            /><br />

            <label>Journal Name:</label>
            <input
              type="text"
              name={`journals[${index}].journalName`}
              value={journal.journalName}
              onChange={(e) => {
                const updatedJournals = [...formData.journals];
                updatedJournals[index].journalName = e.target.value;
                setFormData({ ...formData, journals: updatedJournals });
              }}
            /><br />

            <label>Publication Year:</label>
            <input
              type="number"
              name={`journals[${index}].publicationYear`}
              value={journal.publicationYear}
              onChange={(e) => {
                const updatedJournals = [...formData.journals];
                updatedJournals[index].publicationYear = e.target.value;
                setFormData({ ...formData, journals: updatedJournals });
              }}
            /><br />

            <label>Volume Number:</label>
            <input
              type="text"
              name={`journals[${index}].volumeNumber`}
              value={journal.volumeNumber}
              onChange={(e) => {
                const updatedJournals = [...formData.journals];
                updatedJournals[index].volumeNumber = e.target.value;
                setFormData({ ...formData, journals: updatedJournals });
              }}
            /><br />

            <label>Issue Number:</label>
            <input
              type="text"
              name={`journals[${index}].issueNumber`}
              value={journal.issueNumber}
              onChange={(e) => {
                const updatedJournals = [...formData.journals];
                updatedJournals[index].issueNumber = e.target.value;
                setFormData({ ...formData, journals: updatedJournals });
              }}
            /><br />

            <label>Page Numbers:</label>
            <input
              type="text"
              name={`journals[${index}].pageNumbers`}
              value={journal.pageNumbers}
              onChange={(e) => {
                const updatedJournals = [...formData.journals];
                updatedJournals[index].pageNumbers = e.target.value;
                setFormData({ ...formData, journals: updatedJournals });
              }}
            /><br />

            <label>Impact Factor:</label>
            <input
              type="text"
              name={`journals[${index}].impactFactor`}
              value={journal.impactFactor}
              onChange={(e) => {
                const updatedJournals = [...formData.journals];
                updatedJournals[index].impactFactor = e.target.value;
                setFormData({ ...formData, journals: updatedJournals });
              }}
            /><br />
          </div>
        ))}

        <h4>Conferences</h4>
        {Array.isArray(formData.conferences) && formData.conferences.map((conference, index) => (
          <div key={index}>
            <label>Title:</label>
            <input
              type="text"
              name={`conferences[${index}].title`}
              value={conference.title}
              onChange={(e) => {
                const updatedConferences = [...formData.conferences];
                updatedConferences[index].title = e.target.value;
                setFormData({ ...formData, conferences: updatedConferences });
              }}
            /><br />

            <label>Conference Name:</label>
            <input
              type="text"
              name={`conferences[${index}].conferenceName`}
              value={conference.conferenceName}
              onChange={(e) => {
                const updatedConferences = [...formData.conferences];
                updatedConferences[index].conferenceName = e.target.value;
                setFormData({ ...formData, conferences: updatedConferences });
              }}
            /><br />

            <label>Publication Year:</label>
            <input
              type="number"
              name={`conferences[${index}].publicationYear`}
              value={conference.publicationYear}
              onChange={(e) => {
                const updatedConferences = [...formData.conferences];
                updatedConferences[index].publicationYear = e.target.value;
                setFormData({ ...formData, conferences: updatedConferences });
              }}
            /><br />
          </div>
        ))}
      </fieldset>

        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PhDScholarForm;
