'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PhdScholar from '@/server/models/PhdScholar';

type FormData = {
  email: string;
  password: string;
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
  doctoralCommitteeMembers: { name: string }[];
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
const MAX_DCMEMBERS=10;

const PhDScholarForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
  email: '',
  password:'',
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
  doctoralCommitteeMembers: [{name : ''}],
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
    // email: '',
    // password:'',
    // firstName: 'xZXzX',
    // middleName: 'zXczxc',
    // lastName: 'bdfbdf',
    // dateOfBirth: '2024-03-04',
    // nationality: 'dasdas',
    // mobileNumber: '9886031975',
    // entranceExamination: 'dasdas',
    // qualifyingExamination: 'ddasdsa',
    // allotmentNumber: 'dasdas',
    // admissionDate: '2024-03-04',
    // department: '4234',
    // usn: '43324',
    // srn: '4324',
    // modeOfProgram: '423',
    // researchSupervisor: '4324',
    // researchCoSupervisor: '4324',
    // doctoralCommitteeMembers: [{name : 'dsdsds'}],
    // courseWork1SubjectCode: '423432',
    // courseWork1SubjectName: '423432',
    // courseWork1SubjectGrade: '234',
    // courseWork1Status: 'Pending',
    // courseWork1EligibilityDate: '2024-03-04',
    // courseWork2SubjectCode: '6456',
    // courseWork2SubjectName: '64564',
    // courseWork2SubjectGrade: '4566',
    // courseWork2Status: '645654',
    // courseWork2EligibilityDate: '2024-03-04',
    // courseWork3SubjectCode: '423426',
    // courseWork3SubjectName: '423',
    // courseWork3SubjectGrade: '42342',
    // courseWork3Status: '42342',
    // courseWork3EligibilityDate: '2024-03-04',
    // courseWork4SubjectCode: '234234',
    // courseWork4SubjectName: '4234',
    // courseWork4SubjectGrade: '4234',
    // courseWork4Status: '432432',
    // courseWork4EligibilityDate: '2024-03-04',
    // courseworkCompletionDate1: '2024-10-18',
    // courseworkCompletionDate2: '2024-10-18',
    // courseworkCompletionDate3: '2024-10-18',
    // courseworkCompletionDate4: '2024-10-18',
    // dcMeetings: [{ scheduledDate: '2024-03-04', actualDate: '2024-03-04' }],
    // comprehensiveExamDate: '2024-03-04',
    // proposalDefenseDate: '2024-03-04',
    // openSeminarDate1: '2024-03-04',
    // preSubmissionSeminarDate: '2024-03-04',
    // synopsisSubmissionDate: '2024-03-04',
    // thesisSubmissionDate: '2024-03-04',
    // thesisDefenseDate: '2024-03-04',
    // awardOfDegreeDate: '2024-03-04',
    // journals: [{ title: '4234432', journalName: '4234', publicationYear: '4234', volumeNumber: '423', issueNumber: '4234', pageNumbers: '4234', impactFactor: '23423' }],
    // conferences: [{ title: '4234', conferenceName: '324234', publicationYear: '234234' }]
    
  });

  const notifyErr = (msg: string) => toast.error(msg);
  const router = useRouter();
  const notifySucc = (msg: string) => toast.success(msg);
  const notifyWarn = (msg: string) => toast.warn(msg);
  const notifyInfo = (msg: string) => toast.info(msg);
  const [showPassword, setShowPassword] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const savedFormData = localStorage.getItem('FormData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData)); // Load saved data into the form
    }
    setIsInitialLoad(false);

  }, []);
  
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('FormData', JSON.stringify(formData));
    }
  }, [formData, isInitialLoad]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
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

  const addNewCommitteeMember = () => {
    if (formData.doctoralCommitteeMembers.length < MAX_DCMEMBERS){
    setFormData({
      ...formData,
      doctoralCommitteeMembers: [...formData.doctoralCommitteeMembers, { name: '' }]
    });
    notifyInfo("Added committee member.");
    }else {
      notifyErr('Maximum members reached!');
    }
  };

  const deleteCommitteeMember = (index: number) => {
    if (formData.doctoralCommitteeMembers.length > 1) {
      setFormData({
        ...formData,
        doctoralCommitteeMembers: formData.doctoralCommitteeMembers.filter((_, i) => i !== index)
      });
      notifyInfo("Committee member deleted.");
    } else {
      notifyErr("You must have at least one committee member.");
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

  const deleteDcmMeeting = (index: number) => {
    if (formData.dcMeetings.length > 1) {
      setFormData({
        ...formData,
        dcMeetings: formData.dcMeetings.filter((_, i) => i !== index)
      });
      notifyInfo("DC meeting deleted.");
    } else {
      notifyErr("You must have at least one DC meeting.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name.includes('[') && name.includes(']')) {
      const [field, index, subField] = name.split(/[\[\].]+/);
      const updatedArray = [...(formData[field as keyof FormData] as any[])];
      updatedArray[parseInt(index)][subField] = value;
      setFormData({ ...formData, [field]: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    console.log(formData)
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/signup', formData);
      if (response.status === 200) {
        notifySucc(response.data.message);
        localStorage.clear();
        setTimeout(() => {
          router.push('login');  // Redirect after a brief delay
      }, 1500);
      }
    } catch (err: any) {
      console.log('Axios Error:', err); // Log full error for further details
      const errorMsg = err.response?.data?.message || err.message;
      notifyErr(errorMsg); //doesnt work clearly, fix!
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-4 sm:py-8 px-2 sm:px-6">
      <Card className="w-full max-w-4xl mx-auto p-2 sm:p-6 rounded-lg shadow-md">
        <CardHeader className="p-2 sm:p-6">
          <CardTitle className="text-lg sm:text-2xl font-bold text-center">PhD Scholar Signup</CardTitle>
      </CardHeader>
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
              <div>
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} />
          </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required />
                  <button type="button" onClick={togglePasswordVisibility} className="absolute right-2 top-2">
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
            </div>
          </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
            </div>
          </div>
        </div>

          {/* Admission Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Admission Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="entranceExamination">Entrance Examination</Label>
                <Input id="entranceExamination" name="entranceExamination" value={formData.entranceExamination} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="qualifyingExamination">Qualifying Examination</Label>
                <Input id="qualifyingExamination" name="qualifyingExamination" value={formData.qualifyingExamination} onChange={handleChange} />
            </div>
              <div>
                <Label htmlFor="allotmentNumber">Allotment Number</Label>
                <Input id="allotmentNumber" name="allotmentNumber" value={formData.allotmentNumber} onChange={handleChange} />
          </div>
            <div>
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input id="admissionDate" name="admissionDate" type="date" value={formData.admissionDate} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" value={formData.department} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modeOfProgram">Mode of Program</Label>
                <select
                  id="modeOfProgram"
                  name="modeOfProgram"
                  value={formData.modeOfProgram}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select mode of program</option>
                  <option value="full time phd scholar">Full Time PhD Scholar</option>
                  <option value="part time phd scholar">Part Time PhD Scholar</option>
                  <option value="direct phd">Direct PhD</option>
                  <option value="phd by mtech">PhD by MTech</option>
                </select>
              </div>
            </div>
            <div>
                <Label htmlFor="usn">USN</Label>
                <Input id="usn" name="usn" value={formData.usn} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="srn">SRN</Label>
                <Input id="srn" name="srn" value={formData.srn} onChange={handleChange} />
            </div>
          </div>
        </div>

          {/* Research Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Research Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="researchSupervisor">Research Supervisor</Label>
                <Input id="researchSupervisor" name="researchSupervisor" value={formData.researchSupervisor} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="researchCoSupervisor">Research Co-Supervisor</Label>
                <Input id="researchCoSupervisor" name="researchCoSupervisor" value={formData.researchCoSupervisor} onChange={handleChange} />
            </div>
          </div>
            </div>

          {/* Doctoral Committee Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Doctoral Committee Members</h3>
              <Button type="button" onClick={addNewCommitteeMember} disabled={formData.doctoralCommitteeMembers.length >= MAX_DCMEMBERS}>
                Add Member
              </Button>
            </div>
            {formData.doctoralCommitteeMembers.map((member, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor={`doctoralCommitteeMembers[${index}].name`}>Member {index + 1}</Label>
              <Input
                    id={`doctoralCommitteeMembers[${index}].name`}
                    name={`doctoralCommitteeMembers[${index}].name`}
                    value={member.name}
                onChange={handleChange}
              />
            </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => deleteCommitteeMember(index)}
                  disabled={formData.doctoralCommitteeMembers.length <= 1}
                >
                  Delete
                </Button>
          </div>
            ))}
        </div>

          {/* Coursework Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Coursework Details</h3>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((courseNum) => (
                <div key={courseNum} className="border p-4 rounded-lg">
                  <h4 className="text-md font-semibold mb-4">Coursework {courseNum}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                      <Label htmlFor={`courseWork${courseNum}SubjectCode`}>Subject Code</Label>
              <Input
                        id={`courseWork${courseNum}SubjectCode`}
                        name={`courseWork${courseNum}SubjectCode`}
                        value={formData[`courseWork${courseNum}SubjectCode` as keyof FormData] as string}
                onChange={handleChange}
              />
            </div>
            <div>
                      <Label htmlFor={`courseWork${courseNum}SubjectName`}>Subject Name</Label>
              <Input
                        id={`courseWork${courseNum}SubjectName`}
                        name={`courseWork${courseNum}SubjectName`}
                        value={formData[`courseWork${courseNum}SubjectName` as keyof FormData] as string}
                onChange={handleChange}
              />
            </div>
            <div>
                      <Label htmlFor={`courseWork${courseNum}SubjectGrade`}>Grade</Label>
              <Input
                        id={`courseWork${courseNum}SubjectGrade`}
                        name={`courseWork${courseNum}SubjectGrade`}
                        value={formData[`courseWork${courseNum}SubjectGrade` as keyof FormData] as string}
                onChange={handleChange}
              />
            </div>
            <div>
                      <Label htmlFor={`courseWork${courseNum}EligibilityDate`}>Eligibility Date</Label>
              <Input
                        id={`courseWork${courseNum}EligibilityDate`}
                        name={`courseWork${courseNum}EligibilityDate`}
                type="date"
                        value={formData[`courseWork${courseNum}EligibilityDate` as keyof FormData] as string}
                onChange={handleChange}
              />
            </div>
            </div>
          </div>
              ))}
        </div>
      </div>

          {/* DC Meetings Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Doctoral Committee Meetings</h3>
              <Button type="button" onClick={addDcmMeetings} disabled={formData.dcMeetings.length >= MAXDCMMEETINGS}>
                Add Meeting
              </Button>
            </div>
        {formData.dcMeetings.map((meeting, index) => (
              <div key={index} className="space-y-4 border p-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`dcMeetings[${index}].scheduledDate`}>Scheduled Date</Label>
                <Input
                      id={`dcMeetings[${index}].scheduledDate`}
                  name={`dcMeetings[${index}].scheduledDate`}
                  type="date"
                  value={meeting.scheduledDate}
                  onChange={handleChange}
                />
              </div>
                  <div>
                    <Label htmlFor={`dcMeetings[${index}].actualDate`}>Actual Date</Label>
                <Input
                      id={`dcMeetings[${index}].actualDate`}
                  name={`dcMeetings[${index}].actualDate`}
                  type="date"
                  value={meeting.actualDate}
                  onChange={handleChange}
                    />
              </div>
            </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => deleteDcmMeeting(index)}
                  disabled={formData.dcMeetings.length <= 1}
                >
                  Delete Meeting
                </Button>
          </div>
        ))}
      </div>

          {/* PhD Milestones Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">PhD Milestones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="comprehensiveExamDate">Comprehensive Exam Date</Label>
            <Input
              id="comprehensiveExamDate"
              name="comprehensiveExamDate"
              type="date"
              value={formData.comprehensiveExamDate}
              onChange={handleChange}
            />
          </div>
              <div>
                <Label htmlFor="proposalDefenseDate">Proposal Defense Date</Label>
            <Input
              id="proposalDefenseDate"
              name="proposalDefenseDate"
              type="date"
              value={formData.proposalDefenseDate}
              onChange={handleChange}
            />
          </div>
              <div>
                <Label htmlFor="openSeminarDate1">Open Seminar Date</Label>
            <Input
              id="openSeminarDate1"
              name="openSeminarDate1"
              type="date"
              value={formData.openSeminarDate1}
              onChange={handleChange}
            />
          </div>
              <div>
                <Label htmlFor="preSubmissionSeminarDate">Pre-Submission Seminar Date</Label>
            <Input
              id="preSubmissionSeminarDate"
              name="preSubmissionSeminarDate"
              type="date"
              value={formData.preSubmissionSeminarDate}
              onChange={handleChange}
            />
          </div>
              <div>
                <Label htmlFor="synopsisSubmissionDate">Synopsis Submission Date</Label>
            <Input
              id="synopsisSubmissionDate"
              name="synopsisSubmissionDate"
              type="date"
              value={formData.synopsisSubmissionDate}
              onChange={handleChange}
            />
          </div>
              <div>
                <Label htmlFor="thesisSubmissionDate">Thesis Submission Date</Label>
            <Input
              id="thesisSubmissionDate"
              name="thesisSubmissionDate"
              type="date"
              value={formData.thesisSubmissionDate}
              onChange={handleChange}
            />
          </div>
              <div>
                <Label htmlFor="thesisDefenseDate">Thesis Defense Date</Label>
            <Input
              id="thesisDefenseDate"
              name="thesisDefenseDate"
              type="date"
              value={formData.thesisDefenseDate}
              onChange={handleChange}
            />
          </div>
              <div>
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

          {/* Publications Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Journal Publications</h3>
              <Button type="button" onClick={addNewJournal} disabled={formData.journals.length >= MAXJOURNALS}>
                Add Journal
              </Button>
            </div>
        {formData.journals.map((journal, index) => (
              <div key={index} className="space-y-4 border p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`journals[${index}].title`}>Title</Label>
                <Input
                      id={`journals[${index}].title`}
                  name={`journals[${index}].title`}
                  value={journal.title}
                  onChange={handleChange}
                />
              </div>
                  <div>
                    <Label htmlFor={`journals[${index}].journalName`}>Journal Name</Label>
                <Input
                      id={`journals[${index}].journalName`}
                  name={`journals[${index}].journalName`}
                  value={journal.journalName}
                  onChange={handleChange}
                />
              </div>
                  <div>
                    <Label htmlFor={`journals[${index}].publicationYear`}>Publication Year</Label>
                <Input
                      id={`journals[${index}].publicationYear`}
                  name={`journals[${index}].publicationYear`}
                      type="number"
                  value={journal.publicationYear}
                  onChange={handleChange}
                />
              </div>
                  <div>
                    <Label htmlFor={`journals[${index}].impactFactor`}>Impact Factor</Label>
                <Input
                      id={`journals[${index}].impactFactor`}
                  name={`journals[${index}].impactFactor`}
                      type="number"
                  value={journal.impactFactor}
                  onChange={handleChange}
                />
              </div>
            </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => deleteJournal(index)}
                  disabled={formData.journals.length <= MIN_JOURNALS}
                >
              Delete Journal
            </Button>
          </div>
        ))}
      </div>

          {/* Conference Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Conference Publications</h3>
              <Button type="button" onClick={addNewConference} disabled={formData.conferences.length >= MAXCONFERENCES}>
                Add Conference
              </Button>
            </div>
        {formData.conferences.map((conference, index) => (
              <div key={index} className="space-y-4 border p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`conferences[${index}].title`}>Title</Label>
                <Input
                      id={`conferences[${index}].title`}
                  name={`conferences[${index}].title`}
                  value={conference.title}
                  onChange={handleChange}
                />
              </div>
                  <div>
                    <Label htmlFor={`conferences[${index}].conferenceName`}>Conference Name</Label>
                <Input
                      id={`conferences[${index}].conferenceName`}
                  name={`conferences[${index}].conferenceName`}
                  value={conference.conferenceName}
                  onChange={handleChange}
                />
              </div>
                  <div>
                    <Label htmlFor={`conferences[${index}].publicationYear`}>Publication Year</Label>
                <Input
                      id={`conferences[${index}].publicationYear`}
                  name={`conferences[${index}].publicationYear`}
                      type="number"
                  value={conference.publicationYear}
                  onChange={handleChange}
                />
              </div>
            </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => deleteConference(index)}
                  disabled={formData.conferences.length <= MIN_CONFERENCES}
                >
              Delete Conference
            </Button>
          </div>
        ))}
      </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" className="w-full sm:w-auto">
              Submit
            </Button>
          </div>
</form>
      </Card>
</div>
  );
};

export default PhDScholarForm;