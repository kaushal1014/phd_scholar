'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type FormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  mobileNumber: string;
  entranceExamination: string;
  qualifyingExamination: string;
  allotmentNumber: string;
  admissionDate: string;
  department: string;
  usn: string;
  srn: string;
  modeOfProgram: string;
  researchSupervisor: string;
  researchCoSupervisor: string;
  doctoralCommitteeMember1: string;
  doctoralCommitteeMember2: string;
  doctoralCommitteeMember3: string;
  doctoralCommitteeMember4: string;
  courseWork1SubjectCode: string;
  courseWork1SubjectName: string;
  courseWork1SubjectGrade: string;
  courseWork1Status: string;
  courseWork1EligibilityDate: string;
  courseWork2SubjectCode: string;
  courseWork2SubjectName: string;
  courseWork2SubjectGrade: string;
  courseWork2Status: string;
  courseWork2EligibilityDate: string;
  courseWork3SubjectCode: string;
  courseWork3SubjectName: string;
  courseWork3SubjectGrade: string;
  courseWork3Status: string;
  courseWork3EligibilityDate: string;
  courseWork4SubjectCode: string;
  courseWork4SubjectName: string;
  courseWork4SubjectGrade: string;
  courseWork4Status: string;
  courseWork4EligibilityDate: string;
  courseworkCompletionDate1: string;
  courseworkCompletionDate2: string;
  courseworkCompletionDate3: string;
  courseworkCompletionDate4: string;
  dcMeetings: { scheduledDate: string, actualDate: string }[];
  comprehensiveExamDate: string;
  proposalDefenseDate: string;
  openSeminarDate1: string;
  preSubmissionSeminarDate: string;
  synopsisSubmissionDate: string;
  thesisSubmissionDate: string;
  thesisDefenseDate: string;
  awardOfDegreeDate: string;
  journals: {
    title: string;
    journalName: string;
    publicationYear: string;
    volumeNumber: string;
    issueNumber: string;
    pageNumbers: string;
    impactFactor: string;
  }[];
  conferences: {
    title: string;
    conferenceName: string;
    publicationYear: string;
  }[];
}

const MAXJOURNALS = 5;
const MAXDCMMEETINGS = 8;
const MAXCONFERENCES = 5;

const PhDScholarForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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
    conferences: [{ title: '', conferenceName: '', publicationYear: '' }]
  });

  const notifyErr = (msg: string) => toast.error(msg);
  const notifySucc = (msg: string) => toast.success(msg);
  const notifyWarn = (msg: string) => toast.warn(msg);
  const notifyInfo = (msg: string) => toast.info(msg);

  const addNewJournal = () => {
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
            impactFactor: ''
          }
        ]
      });
      notifyInfo("Added journal.")
    } else {
      notifyErr("Maximum journals reached!");
    }
  };

  const addNewConference = () => {
    if (formData.conferences.length < MAXCONFERENCES) {
      setFormData({
        ...formData,
        conferences: [...formData.conferences, { title: '', conferenceName: '', publicationYear: '' }]
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('[') && name.includes(']')) {
      const [field, index, subField] = name.split(/[\[\].]+/);
      const updatedArray = [...formData[field as keyof FormData] as any[]];
      updatedArray[parseInt(index)][subField] = value;
      setFormData({ ...formData, [field]: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('api/', formData);
      if (response.status === 200) {
        notifySucc(response.data.message);
      }
    } catch (err) {
      notifyErr('Something went wrong');
    }
  };

  return (
    <div>
      <ToastContainer />
      <h2>PhD Scholar Profile</h2>
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* DC Meetings Section */}
            <div className="space-y-4">
              <h4>Doctoral Committee Meetings</h4>
              {formData.dcMeetings.map((meeting, index) => (
                <div key={index}>
                  <Label>Meeting {index + 1}</Label>
                  <Input
                    type="date"
                    name={`dcMeetings[${index}].scheduledDate`}
                    value={meeting.scheduledDate}
                    onChange={handleChange}
                    placeholder="Scheduled Date"
                  />
                  <Input
                    type="date"
                    name={`dcMeetings[${index}].actualDate`}
                    value={meeting.actualDate}
                    onChange={handleChange}
                    placeholder="Actual Date"
                  />
                </div>
              ))}
              <Button type="button" onClick={addDcmMeetings}>
                Add DC Meeting
              </Button>
            </div>

            {/* Journals Section */}
            <div className="space-y-4">
              <h4>Journals</h4>
              {formData.journals.map((journal, index) => (
                <div key={index}>
                  <Label>Journal {index + 1}</Label>
                  <Input
                    type="text"
                    name={`journals[${index}].title`}
                    value={journal.title}
                    onChange={handleChange}
                    placeholder="Title"
                  />
                  <Input
                    type="text"
                    name={`journals[${index}].journalName`}
                    value={journal.journalName}
                    onChange={handleChange}
                    placeholder="Journal Name"
                  />
                  <Input
                    type="number"
                    name={`journals[${index}].publicationYear`}
                    value={journal.publicationYear}
                    onChange={handleChange}
                    placeholder="Publication Year"
                  />
                </div>
              ))}
              <Button type="button" onClick={addNewJournal}>
                Add Journal
              </Button>
            </div>

            {/* Conferences Section */}
            <div className="space-y-4">
              <h4>Conferences</h4>
              {formData.conferences.map((conference, index) => (
                <div key={index}>
                  <Label>Conference {index + 1}</Label>
                  <Input
                    type="text"
                    name={`conferences[${index}].title`}
                    value={conference.title}
                    onChange={handleChange}
                    placeholder="Title"
                  />
                  <Input
                    type="text"
                    name={`conferences[${index}].conferenceName`}
                    value={conference.conferenceName}
                    onChange={handleChange}
                    placeholder="Conference Name"
                  />
                  <Input
                    type="number"
                    name={`conferences[${index}].publicationYear`}
                    value={conference.publicationYear}
                    onChange={handleChange}
                    placeholder="Publication Year"
                  />
                </div>
              ))}
              <Button type="button" onClick={addNewConference}>
                Add Conference
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default PhDScholarForm;
