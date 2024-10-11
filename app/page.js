'use client';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const PhDScholarForm = () => {
  const MAXJOURNALS = 5;
  const MAXDCMMEETINGS = 8;
  const MAXCONFERENCES = 5;

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
    admissionDate: '',
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


  const notifyErr = (msg) => toast.error(msg);
  const notifySucc = (msg) => toast.success(msg);
  const notifyWarn = (msg) => toast.warn(msg);
  const notifyInfo = (msg) => toast.info(msg);

  const addNewJournal = () => {
    console.log("Add New Journal function called"); // Debug log
    if (formData.journals.length < MAXJOURNALS) {
      setFormData({
        ...formData,
        journals: [
          ...formData.journals,
          {
            title: '',
            journalName: '',
            publicationYear: '',
            volumeNumber: '',
            issueNumber: '',
            pageNumbers: '',
            impactFactor: '',
          },
        ],
      });
      notifyInfo("Added journal.")
    } else {
      notifyErr("Maximum journals reached!"); // Call notify to show the toast
    }
  };
  

  const addNewConference = () => {
    if (formData.conferences.length < MAXCONFERENCES) {
      setFormData({
        ...formData,
        conferences: [...formData.conferences, { title: '', conferenceName: '', publicationYear: '' }],
      });
      notifyInfo("Added conference.");
    } else {
      notifyErr('Maximum conferences reached!');
    }
  };

  const addDcmMeetings = () => {
    if (formData.dcMeetings.length < MAXDCMMEETINGS) {
      setFormData({
        ...formData,
        dcMeetings: [...formData.dcMeetings, { scheduledDate: '', actualDate: '' }]
      });
      notifyInfo("Added DCM meeting.")
    } else {
      notifyErr('Maximum DC meetings reached!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested input fields (like arrays for journals, conferences, etc.)
    if (name.includes('[') && name.includes(']')) {
      const [field, index, subField] = name.split(/[\[\].]+/);
      const updatedArray = [...formData[field]];
      updatedArray[index][subField] = value;
      setFormData({ ...formData, [field]: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('api/', formData);
      if (response.status === 200) {
        notifySucc(response.data.message);
      }
    } catch (err) {
      notifyErr('Something went wrong');
      //console.error(err);
    }
  };

  return (
    <div>
      <ToastContainer />
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
            <label>Admission Date:</label>
            <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} required /><br />
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

          <fieldset>
            <legend>DC Meetings</legend>
            {formData.dcMeetings.map((meeting, index) => (
              <div key={index}>
                <h4>Meeting {index + 1}</h4>
                <label>Scheduled Date:</label>
                <input type="date" name={`dcMeetings[${index}].scheduledDate`} value={meeting.scheduledDate} onChange={handleChange} /><br />
                <label>Actual Date:</label>
                <input type="date" name={`dcMeetings[${index}].actualDate`} value={meeting.actualDate} onChange={handleChange} /><br />
              </div>
            ))}<br/>
            <button type="button" onClick={addDcmMeetings}>Add Meeting</button>
          </fieldset>

          {/* Journals */}
          <fieldset>
            <legend>Journals</legend>
            {formData.journals.map((journal, index) => (
              <div key={index}>
                <h4>Journal {index + 1}</h4>
                <label>Title:</label>
                <input type="text" name={`journals[${index}].title`} value={journal.title} onChange={handleChange} /><br />
                <label>Journal Name:</label>
                <input type="text" name={`journals[${index}].journalName`} value={journal.journalName} onChange={handleChange} /><br />
                <label>Publication Year:</label>
                <input type="text" name={`journals[${index}].publicationYear`} value={journal.publicationYear} onChange={handleChange} /><br />
                <label>Volume Number:</label>
                <input type="text" name={`journals[${index}].volumeNumber`} value={journal.volumeNumber} onChange={handleChange} /><br />
                <label>Issue Number:</label>
                <input type="text" name={`journals[${index}].issueNumber`} value={journal.issueNumber} onChange={handleChange} /><br />
                <label>Page Numbers:</label>
                <input type="text" name={`journals[${index}].pageNumbers`} value={journal.pageNumbers} onChange={handleChange} /><br />
                <label>Impact Factor:</label>
                <input type="text" name={`journals[${index}].impactFactor`} value={journal.impactFactor} onChange={handleChange} /><br />
              </div>
            ))}
            <button type="button" onClick={addNewJournal}>Add More Journals</button>
          </fieldset>

          {/* Conferences */}
          <fieldset>
            <legend>Conferences</legend>
            {formData.conferences.map((conference, index) => (
              <div key={index}>
                <h4>Conference {index + 1}</h4>
                <label>Title:</label>
                <input type="text" name={`conferences[${index}].title`} value={conference.title} onChange={handleChange} /><br />
                <label>Conference Name:</label>
                <input type="text" name={`conferences[${index}].conferenceName`} value={conference.conferenceName} onChange={handleChange} /><br />
                <label>Publication Year:</label>
                <input type="text" name={`conferences[${index}].publicationYear`} value={conference.publicationYear} onChange={handleChange} /><br />
              </div>
            ))}
            <button type="button" onClick={addNewConference}>Add More Conferences</button>
          </fieldset>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  };

  export default PhDScholarForm;
