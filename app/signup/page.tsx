'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  dcMeetings: { scheduledDate: string; actualDate: string }[];
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
const MIN_JOURNALS=1;
const MIN_CONFERENCES=1;

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

  //Testing purposes
  /*
    firstName: 'xZXzX',
    middleName: 'zXczxc',
    lastName: 'bdfbdf',
    dateOfBirth: '2024-03-04',
    nationality: 'dasdas',
    mobileNumber: '9886031975',
    entranceExamination: 'dasdas',
    qualifyingExamination: 'ddasdsa',
    allotmentNumber: 'dasdas',
    admissionDate: '2024-03-04',
    department: '4234',
    usn: '43324',
    srn: '4324',
    modeOfProgram: '423',
    researchSupervisor: '4324',
    researchCoSupervisor: '4324',
    doctoralCommitteeMember1: '423432',
    doctoralCommitteeMember2: '432423',
    doctoralCommitteeMember3: '42342',
    doctoralCommitteeMember4: '423423',
    courseWork1SubjectCode: '423432',
    courseWork1SubjectName: '423432',
    courseWork1SubjectGrade: '234',
    courseWork1Status: '4234',
    courseWork1EligibilityDate: '2024-03-04',
    courseWork2SubjectCode: '6456',
    courseWork2SubjectName: '64564',
    courseWork2SubjectGrade: '4566',
    courseWork2Status: '645654',
    courseWork2EligibilityDate: '2024-03-04',
    courseWork3SubjectCode: '423426',
    courseWork3SubjectName: '423',
    courseWork3SubjectGrade: '42342',
    courseWork3Status: '42342',
    courseWork3EligibilityDate: '2024-03-04',
    courseWork4SubjectCode: '234234',
    courseWork4SubjectName: '4234',
    courseWork4SubjectGrade: '4234',
    courseWork4Status: '432432',
    courseWork4EligibilityDate: '2024-03-04',
    courseworkCompletionDate1: '2024-10-18',
    courseworkCompletionDate2: '2024-10-18',
    courseworkCompletionDate3: '2024-10-18',
    courseworkCompletionDate4: '2024-10-18',
    dcMeetings: [{ scheduledDate: '2024-03-04', actualDate: '2024-03-04' }],
    comprehensiveExamDate: '2024-03-04',
    proposalDefenseDate: '2024-03-04',
    openSeminarDate1: '2024-03-04',
    preSubmissionSeminarDate: '2024-03-04',
    synopsisSubmissionDate: '2024-03-04',
    thesisSubmissionDate: '2024-03-04',
    thesisDefenseDate: '2024-03-04',
    awardOfDegreeDate: '2024-03-04',
    journals: [{ title: '4234432', journalName: '4234', publicationYear: '4234', volumeNumber: '423', issueNumber: '4234', pageNumbers: '4234', impactFactor: '23423' }],
    conferences: [{ title: '4234', conferenceName: '324234', publicationYear: '234234' }]
  */
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
      notifyInfo("Added journal.");
    } else {
      notifyErr("Maximum journals reached!");
    }
  };

  const deleteJournal = (index: number) => {
    if (formData.journals.length > MIN_JOURNALS) {
      setFormData({
        ...formData,
        journals: formData.journals.filter((_, i) => i !== index),
      });
      notifyInfo("Journal deleted.");
    } else {
      notifyErr("You must have at least one journal.");
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

  const deleteConference= (index:number)=>{
    if (formData.conferences.length> MIN_CONFERENCES){
      setFormData({...formData,
        conferences : formData.conferences.filter((_,i)=>i !==index),}
      );
      notifyErr("Conference Deleted")
    }else {
      notifyErr("You must have at least one conference.");
    }
  }

  const addDcmMeetings = () => {
    if (formData.dcMeetings.length < MAXDCMMEETINGS) {
      setFormData({
        ...formData,
        dcMeetings: [...formData.dcMeetings, { scheduledDate: '', actualDate: '' }]
      });
      notifyInfo("Added DCM meeting.");
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
      const response = await axios.post('api/signup', formData);
      if (response.status === 200) {
        notifySucc(response.data.message);
      }
    } catch (err) {
      notifyErr('Something went wrong');
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">PhD Scholar Registration</h1>
        <Card className="bg-white shadow-lg border-2 border-gray-300 rounded-xl overflow-hidden">
          <CardHeader className="border-b-2 border-gray-200 bg-gray-50 p-6">
            <CardTitle className="text-2xl font-bold text-gray-800">Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="space-y-2">
          <Label htmlFor="entranceExamination">Entrance Examination</Label>
          <Input
            id="entranceExamination"
            name="entranceExamination"
            value={formData.entranceExamination}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qualifyingExamination">Qualifying Examination</Label>
          <Input
            id="qualifyingExamination"
            name="qualifyingExamination"
            value={formData.qualifyingExamination}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="allotmentNumber">Allotment Number</Label>
          <Input
            id="allotmentNumber"
            name="allotmentNumber"
            value={formData.allotmentNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admissionDate">Admission Date</Label>
          <Input
            id="admissionDate"
            name="admissionDate"
            type="date"
            value={formData.admissionDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="usn">USN</Label>
          <Input
            id="usn"
            name="usn"
            value={formData.usn}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="srn">SRN</Label>
          <Input
            id="srn"
            name="srn"
            value={formData.srn}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="modeOfProgram">Mode of Program</Label>
          <Input
            id="modeOfProgram"
            name="modeOfProgram"
            value={formData.modeOfProgram}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="researchSupervisor">Research Supervisor</Label>
          <Input
            id="researchSupervisor"
            name="researchSupervisor"
            value={formData.researchSupervisor}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="researchCoSupervisor">Research Co-Supervisor</Label>
          <Input
            id="researchCoSupervisor"
            name="researchCoSupervisor"
            value={formData.researchCoSupervisor}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Doctoral Committee Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="doctoralCommitteeMember1">Member 1</Label>
            <Input
              id="doctoralCommitteeMember1"
              name="doctoralCommitteeMember1"
              value={formData.doctoralCommitteeMember1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctoralCommitteeMember2">Member 2</Label>
            <Input
              id="doctoralCommitteeMember2"
              name="doctoralCommitteeMember2"
              value={formData.doctoralCommitteeMember2}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctoralCommitteeMember3">Member 3</Label>
            <Input
              id="doctoralCommitteeMember3"
              name="doctoralCommitteeMember3"
              value={formData.doctoralCommitteeMember3}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctoralCommitteeMember4">Member 4</Label>
            <Input
              id="doctoralCommitteeMember4"
              name="doctoralCommitteeMember4"
              value={formData.doctoralCommitteeMember4}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Course Work</h3>
        
        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-muted">
          <h4 className="font-semibold text-lg">Course Work 1</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseWork1SubjectCode">Subject Code</Label>
              <Input
                id="courseWork1SubjectCode"
                placeholder="Subject Code"
                name="courseWork1SubjectCode"
                value={formData.courseWork1SubjectCode}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseWork1SubjectName">Subject Name</Label>
              <Input
                id="courseWork1SubjectName"
                placeholder="Subject Name"
                name="courseWork1SubjectName"
                value={formData.courseWork1SubjectName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="courseWork1SubjectGrade">Subject Grade</Label>
              <Input
                id="courseWork1SubjectGrade"
                placeholder="Subject Grade"
                name="courseWork1SubjectGrade"
                value={formData.courseWork1SubjectGrade}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseWork1Status">Status</Label>
              <Input
                id="courseWork1Status"
                placeholder="Status"
                name="courseWork1Status"
                value={formData.courseWork1Status}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseWork1EligibilityDate">Eligibility Date</Label>
              <Input
                id="courseWork1EligibilityDate"
                placeholder="Eligibility Date"
                name="courseWork1EligibilityDate"
                type="date"
                value={formData.courseWork1EligibilityDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="courseworkCompletionDate1">Coursework Completion Date</Label>
            <Input
              type="date"
              id="courseworkCompletionDate1"
              name="courseworkCompletionDate1"
              value={formData.courseworkCompletionDate1}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-muted">
          <h4 className="font-semibold text-lg">Course Work 2</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseWork2SubjectCode">Subject Code</Label>
              <Input
                id="courseWork2SubjectCode"
                placeholder="Subject Code"
                name="courseWork2SubjectCode"
                value={formData.courseWork2SubjectCode}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseWork2SubjectName">Subject Name</Label>
              <Input
                id="courseWork2SubjectName"
                placeholder="Subject Name"
                name="courseWork2SubjectName"
                value={formData.courseWork2SubjectName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="courseWork2SubjectGrade">Subject Grade</Label>
              <Input
                id="courseWork2SubjectGrade"
                placeholder="Subject Grade"
                name="courseWork2SubjectGrade"
                value={formData.courseWork2SubjectGrade}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseWork2Status">Status</Label>
              <Input
                id="courseWork2Status"
                placeholder="Status"
                name="courseWork2Status"
                value={formData.courseWork2Status}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseWork2EligibilityDate">Eligibility Date</Label>
              <Input
                id="courseWork2EligibilityDate"
                placeholder="Eligibility Date"
                name="courseWork2EligibilityDate"
                type="date"
                value={formData.courseWork2EligibilityDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="courseworkCompletionDate2">Coursework Completion Date</Label>
            <Input
              type="date"
              id="courseworkCompletionDate2"
              name="courseworkCompletionDate2"
              value={formData.courseworkCompletionDate2}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-muted">
          <h4 className="font-semibold text-lg">Course Work 3</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseWork3SubjectCode">Subject Code</Label>
              <Input
                id="courseWork3SubjectCode"
                placeholder="Subject Code"
                name="courseWork3SubjectCode"
                value={formData.courseWork3SubjectCode}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseWork3SubjectName">Subject Name</Label>
              <Input
                id="courseWork3SubjectName"
                placeholder="Subject Name"
                name="courseWork3SubjectName"
                value={formData.courseWork3SubjectName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="courseWork3SubjectGrade">Subject Grade</Label>
              <Input
                id="courseWork3SubjectGrade"
                placeholder="Subject Grade"
                name="courseWork3SubjectGrade"
                value={formData.courseWork3SubjectGrade}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseWork3Status">Status</Label>
              <Input
                id="courseWork3Status"
                placeholder="Status"
                name="courseWork3Status"
                value={formData.courseWork3Status}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseWork3EligibilityDate">Eligibility Date</Label>
              <Input
                id="courseWork3EligibilityDate"
                placeholder="Eligibility Date"
                name="courseWork3EligibilityDate"
                type="date"
                value={formData.courseWork3EligibilityDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="courseworkCompletionDate3">Coursework Completion Date</Label>
            <Input
              type="date"
              id="courseworkCompletionDate3"
              name="courseworkCompletionDate3"
              value={formData.courseworkCompletionDate3}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-4 p-4 border  rounded-lg shadow-sm bg-muted">
          <h4 className="font-semibold text-lg">Course Work 4</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseWork4SubjectCode">Subject Code</Label>
              <Input
                id="courseWork4SubjectCode"
                placeholder="Subject Code"
                name="courseWork4SubjectCode"
                value={formData.courseWork4SubjectCode}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseWork4SubjectName">Subject Name</Label>
              <Input
                id="courseWork4SubjectName"
                placeholder="Subject Name"
                name="courseWork4SubjectName"
                value={formData.courseWork4SubjectName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="courseWork4SubjectGrade">Subject Grade</Label>
              <Input
                id="courseWork4SubjectGrade"
                placeholder="Subject Grade"
                name="courseWork4SubjectGrade"
                value={formData.courseWork4SubjectGrade}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseWork4Status">Status</Label>
              <Input
                id="courseWork4Status"
                placeholder="Status"
                name="courseWork4Status"
                value={formData.courseWork4Status}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="courseWork4EligibilityDate">Eligibility Date</Label>
              <Input
                id="courseWork4EligibilityDate"
                placeholder="Eligibility Date"
                name="courseWork4EligibilityDate"
                type="date"
                value={formData.courseWork4EligibilityDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="courseworkCompletionDate4">Coursework Completion Date</Label>
            <Input
              type="date"
              id="courseworkCompletionDate4"
              name="courseworkCompletionDate4"
              value={formData.courseworkCompletionDate4}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
              <CardHeader className="border-b">
              <CardTitle className="text-2xl font-bold">DC Meetings</CardTitle>
            </CardHeader>
            <div className="p-6 space-y-6">
              {formData.dcMeetings.map((meeting, index) => (
                <div key={index} className="p-4 border rounded-lg bg-muted">
                  <Label className="text-lg font-semibold mb-2">DC Meeting {index + 1}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`scheduledDate-${index}`}>Scheduled Date</Label>
                      <Input
                        id={`scheduledDate-${index}`}
                        placeholder="Scheduled Date"
                        name={`dcMeetings[${index}].scheduledDate`}
                        type="date"
                        value={meeting.scheduledDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`actualDate-${index}`}>Actual Date</Label>
                      <Input
                        id={`actualDate-${index}`}
                        placeholder="Actual Date"
                        name={`dcMeetings[${index}].actualDate`}
                        type="date"
                        value={meeting.actualDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={addDcmMeetings} className="w-full">Add DCM Meeting</Button>
            </div>

              <CardHeader className="border-b">
                <CardTitle className="text-2xl font-bold">Examination and Defense Dates</CardTitle>
              </CardHeader>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="comprehensiveExamDate">Comprehensive Exam Date</Label>
                    <Input
                      id="comprehensiveExamDate"
                      name="comprehensiveExamDate"
                      type="date"
                      value={formData.comprehensiveExamDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proposalDefenseDate">Proposal Defense Date</Label>
                    <Input
                      id="proposalDefenseDate"
                      name="proposalDefenseDate"
                      type="date"
                      value={formData.proposalDefenseDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openSeminarDate1">Open Seminar Date 1</Label>
                    <Input
                      id="openSeminarDate1"
                      name="openSeminarDate1"
                      type="date"
                      value={formData.openSeminarDate1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preSubmissionSeminarDate">Pre-Submission Seminar Date</Label>
                    <Input
                      id="preSubmissionSeminarDate"
                      name="preSubmissionSeminarDate"
                      type="date"
                      value={formData.preSubmissionSeminarDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="synopsisSubmissionDate">Synopsis Submission Date</Label>
                    <Input
                      id="synopsisSubmissionDate"
                      name="synopsisSubmissionDate"
                      type="date"
                      value={formData.synopsisSubmissionDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thesisSubmissionDate">Thesis Submission Date</Label>
                    <Input
                      id="thesisSubmissionDate"
                      name="thesisSubmissionDate"
                      type="date"
                      value={formData.thesisSubmissionDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thesisDefenseDate">Thesis Defense Date</Label>
                    <Input
                      id="thesisDefenseDate"
                      name="thesisDefenseDate"
                      type="date"
                      value={formData.thesisDefenseDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="awardOfDegreeDate">Award of Degree Date</Label>
                    <Input
                      id="awardOfDegreeDate"
                      name="awardOfDegreeDate"
                      type="date"
                      value={formData.awardOfDegreeDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <CardHeader className="border-b">
      <CardTitle className="text-2xl font-bold">Publications</CardTitle>
    </CardHeader>
    <div className="space-y-6">
    <h3 className="text-xl font-semibold">Journals</h3>
    {formData.journals.map((journal, index) => (
      <div key={index} className="space-y-4 p-4 border rounded-lg shadow-sm bg-muted">
        <h4 className="font-semibold text-lg">Journal {index + 1}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`journal-${index}-title`}>Title</Label>
            <Input
              id={`journal-${index}-title`}
              placeholder="Title"
              name={`journals[${index}].title`}
              value={journal.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`journal-${index}-name`}>Journal Name</Label>
            <Input
              id={`journal-${index}-name`}
              placeholder="Journal Name"
              name={`journals[${index}].journalName`}
              value={journal.journalName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`journal-${index}-year`}>Publication Year</Label>
            <Input
              id={`journal-${index}-year`}
              placeholder="Publication Year"
              name={`journals[${index}].publicationYear`}
              value={journal.publicationYear}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`journal-${index}-volume`}>Volume Number</Label>
            <Input
              id={`journal-${index}-volume`}
              placeholder="Volume Number"
              name={`journals[${index}].volumeNumber`}
              value={journal.volumeNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`journal-${index}-issue`}>Issue Number</Label>
            <Input
              id={`journal-${index}-issue`}
              placeholder="Issue Number"
              name={`journals[${index}].issueNumber`}
              value={journal.issueNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`journal-${index}-pages`}>Page Numbers</Label>
            <Input
              id={`journal-${index}-pages`}
              placeholder="Page Numbers"
              name={`journals[${index}].pageNumbers`}
              value={journal.pageNumbers}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`journal-${index}-impact`}>Impact Factor</Label>
            <Input
              id={`journal-${index}-impact`}
              placeholder="Impact Factor"
              name={`journals[${index}].impactFactor`}
              value={journal.impactFactor}
              onChange={handleChange}
              required
            />
          </div>
        </div>
              <Button type="button" onClick={() => deleteJournal(index)} className="mt-2 bg-red-500 text-white">
              Delete Journal
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addNewJournal} className="mt-4">Add Journal</Button>
      </div>


      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Conferences</h3>
        {formData.conferences.map((conference, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg shadow-sm bg-muted">
            <h4 className="font-semibold text-lg">Conference {index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`conference-${index}-title`}>Title</Label>
                <Input
                  id={`conference-${index}-title`}
                  placeholder="Title"
                  name={`conferences[${index}].title`}
                  value={conference.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`conference-${index}-name`}>Conference Name</Label>
                <Input
                  id={`conference-${index}-name`}
                  placeholder="Conference Name"
                  name={`conferences[${index}].conferenceName`}
                  value={conference.conferenceName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`conference-${index}-year`}>Publication Year</Label>
                <Input
                  id={`conference-${index}-year`}
                  placeholder="Publication Year"
                  name={`conferences[${index}].publicationYear`}
                  value={conference.publicationYear}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <Button type="button" onClick={() => deleteConference(index)} className="mt-2 bg-red-500 text-white">
              Delete Conference
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addNewConference} className="mt-4">Add Conference</Button>
      </div>
    </CardContent>
    <CardFooter>
      <Button type="submit">Submit</Button>
    </CardFooter>
  </Card>
        </form>
      </div>
    );
  };

  export default PhDScholarForm;
