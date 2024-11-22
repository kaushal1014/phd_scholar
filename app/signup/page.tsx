'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  
  /*
  //Testing purposes
    email: '',
    password:'',
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
  const router = useRouter();
  const notifySucc = (msg: string) => toast.success(msg);
  const notifyWarn = (msg: string) => toast.warn(msg);
  const notifyInfo = (msg: string) => toast.info(msg);
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await axios.post('/api/signup', formData);
      if (response.status === 200) {
        notifySucc(response.data.message);
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
  <form onSubmit={handleSubmit} className="w-full max-w-4xl">
    <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">PhD Scholar Registration</h1>
    <Card className="bg-white dark:bg-gray-800 shadow-lg border-2 border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden">
      <CardHeader className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="flex flex-col items-center space-y-6 mb-8">
          <div className="w-full max-w-md space-y-2">
            <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="w-full max-w-md space-y-2">
            <Label htmlFor="middleName" className="text-gray-700 dark:text-gray-300">Middle Name</Label>
            <Input
              id="middleName"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="w-full max-w-md space-y-2">
            <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="w-full max-w-md space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
            <Input 
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              onChange={handleChange}
              required 
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="w-full max-w-md space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
            <div className="relative">
              <Input 
                id="password"
                name="password"
                type={showPassword ? "text" : 
                "password"}
                onChange={handleChange}
                required 
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="w-full max-w-md space-y-2">
            <Label htmlFor="dateOfBirth" className="text-gray-700 dark:text-gray-300">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>
          <div className="w-full max-w-md space-y-2">
            <Label htmlFor="nationality" className="text-gray-700 dark:text-gray-300">Nationality</Label>
            <Input
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="w-full max-w-md space-y-2">
            <Label htmlFor="mobileNumber" className="text-gray-700 dark:text-gray-300">Mobile Number</Label>
            <Input
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="entranceExamination" className="text-gray-700 dark:text-gray-300">Entrance Examination</Label>
            <Input
              id="entranceExamination"
              name="entranceExamination"
              value={formData.entranceExamination}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualifyingExamination" className="text-gray-700 dark:text-gray-300">Qualifying Examination</Label>
            <Input
              id="qualifyingExamination"
              name="qualifyingExamination"
              value={formData.qualifyingExamination}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allotmentNumber" className="text-gray-700 dark:text-gray-300">Allotment Number</Label>
            <Input
              id="allotmentNumber"
              name="allotmentNumber"
              value={formData.allotmentNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admissionDate" className="text-gray-700 dark:text-gray-300">Admission Date</Label>
            <Input
              id="admissionDate"
              name="admissionDate"
              type="date"
              value={formData.admissionDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">Department</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="usn" className="text-gray-700 dark:text-gray-300">USN</Label>
            <Input
              id="usn"
              name="usn"
              value={formData.usn}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="srn" className="text-gray-700 dark:text-gray-300">SRN</Label>
            <Input
              id="srn"
              name="srn"
              value={formData.srn}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modeOfProgram" className="text-gray-700 dark:text-gray-300">Mode of Program</Label>
            <Input
              id="modeOfProgram"
              name="modeOfProgram"
              value={formData.modeOfProgram}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="researchSupervisor" className="text-gray-700 dark:text-gray-300">Research Supervisor</Label>
            <Input
              id="researchSupervisor"
              name="researchSupervisor"
              value={formData.researchSupervisor}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="researchCoSupervisor" className="text-gray-700 dark:text-gray-300">Research Co-Supervisor</Label>
            <Input
              id="researchCoSupervisor"
              name="researchCoSupervisor"
              value={formData.researchCoSupervisor}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Doctoral Committee Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="doctoralCommitteeMember1" className="text-gray-700 dark:text-gray-300">Member 1</Label>
            <Input
              id="doctoralCommitteeMember1"
              name="doctoralCommitteeMember1"
              value={formData.doctoralCommitteeMember1}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctoralCommitteeMember2" className="text-gray-700 dark:text-gray-300">Member 2</Label>
            <Input
              id="doctoralCommitteeMember2"
              name="doctoralCommitteeMember2"
              value={formData.doctoralCommitteeMember2}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctoralCommitteeMember3" className="text-gray-700 dark:text-gray-300">Member 3</Label>
            <Input
              id="doctoralCommitteeMember3"
              name="doctoralCommitteeMember3"
              value={formData.doctoralCommitteeMember3}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctoralCommitteeMember4" className="text-gray-700 dark:text-gray-300">Member 4</Label>
            <Input
              id="doctoralCommitteeMember4"
              name="doctoralCommitteeMember4"
              value={formData.doctoralCommitteeMember4}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Course Work</h3>
        
        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700">
          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Course Work 1</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseWork1SubjectCode" className="text-gray-700 dark:text-gray-300">Subject Code</Label>
              <Input
                id="courseWork1SubjectCode"
                placeholder="Subject Code"
                name="courseWork1SubjectCode"
                value={formData.courseWork1SubjectCode}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseWork1SubjectName" className="text-gray-700 dark:text-gray-300">Subject Name</Label>
              <Input
                id="courseWork1SubjectName"
                placeholder="Subject Name"
                name="courseWork1SubjectName"
                value={formData.courseWork1SubjectName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="courseWork1SubjectGrade" className="text-gray-700 dark:text-gray-300">Subject Grade</Label>
              <Input
                id="courseWork1SubjectGrade"
                placeholder="Subject Grade"
                name="courseWork1SubjectGrade"
                value={formData.courseWork1SubjectGrade}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseWork1Status" className="text-gray-700 dark:text-gray-300">Status</Label>
              <Input
                id="courseWork1Status"
                placeholder="Status"
                name="courseWork1Status"
                value={formData.courseWork1Status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseWork1EligibilityDate" className="text-gray-700 dark:text-gray-300">Eligibility Date</Label>
              <Input
                id="courseWork1EligibilityDate"
                type="date"
                name="courseWork1EligibilityDate"
                value={formData.courseWork1EligibilityDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700">
          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Course Work 2</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseWork2SubjectCode" className="text-gray-700 dark:text-gray-300">Subject Code</Label>
              <Input
                id="courseWork2SubjectCode"
                placeholder="Subject Code"
                name="courseWork2SubjectCode"
                value={formData.courseWork2SubjectCode}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseWork2SubjectName" className="text-gray-700 dark:text-gray-300">Subject Name</Label>
              <Input
                id="courseWork2SubjectName"
                placeholder="Subject Name"
                name="courseWork2SubjectName"
                value={formData.courseWork2SubjectName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="courseWork2SubjectGrade" className="text-gray-700 dark:text-gray-300">Subject Grade</Label>
              <Input
                id="courseWork2SubjectGrade"
                placeholder="Subject Grade"
                name="courseWork2SubjectGrade"
                value={formData.courseWork2SubjectGrade}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseWork2Status" className="text-gray-700 dark:text-gray-300">Status</Label>
              <Input
                id="courseWork2Status"
                placeholder="Status"
                name="courseWork2Status"
                value={formData.courseWork2Status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseWork2EligibilityDate" className="text-gray-700 dark:text-gray-300">Eligibility Date</Label>
              <Input
                id="courseWork2EligibilityDate"
                type="date"
                name="courseWork2EligibilityDate"
                value={formData.courseWork2EligibilityDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700">
          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Course Work 3</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseWork3SubjectCode" className="text-gray-700 dark:text-gray-300">Subject Code</Label>
              <Input
                id="courseWork3SubjectCode"
                placeholder="Subject Code"
                name="courseWork3SubjectCode"
                value={formData.courseWork3SubjectCode}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseWork3SubjectName" className="text-gray-700 dark:text-gray-300">Subject Name</Label>
              <Input
                id="courseWork3SubjectName"
                placeholder="Subject Name"
                name="courseWork3SubjectName"
                value={formData.courseWork3SubjectName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="courseWork3SubjectGrade" className="text-gray-700 dark:text-gray-300">Subject Grade</Label>
              <Input
                id="courseWork3SubjectGrade"
                placeholder="Subject Grade"
                name="courseWork3SubjectGrade"
                value={formData.courseWork3SubjectGrade}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseWork3Status" className="text-gray-700 dark:text-gray-300">Status</Label>
              <Input
                id="courseWork3Status"
                placeholder="Status"
                name="courseWork3Status"
                value={formData.courseWork3Status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseWork3EligibilityDate" className="text-gray-700 dark:text-gray-300">Eligibility Date</Label>
              <Input
                id="courseWork3EligibilityDate"
                type="date"
                name="courseWork3EligibilityDate"
                value={formData.courseWork3EligibilityDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700">
          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Course Work 4</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseWork4SubjectCode" className="text-gray-700 dark:text-gray-300">Subject Code</Label>
              <Input
                id="courseWork4SubjectCode"
                placeholder="Subject Code"
                name="courseWork4SubjectCode"
                value={formData.courseWork4SubjectCode}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseWork4SubjectName" className="text-gray-700 dark:text-gray-300">Subject Name</Label>
              <Input
                id="courseWork4SubjectName"
                placeholder="Subject Name"
                name="courseWork4SubjectName"
                value={formData.courseWork4SubjectName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="courseWork4SubjectGrade" className="text-gray-700 dark:text-gray-300">Subject Grade</Label>
              <Input
                id="courseWork4SubjectGrade"
                placeholder="Subject Grade"
                name="courseWork4SubjectGrade"
                value={formData.courseWork4SubjectGrade}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseWork4Status" className="text-gray-700 dark:text-gray-300">Status</Label>
              <Input
                id="courseWork4Status"
                placeholder="Status"
                name="courseWork4Status"
                value={formData.courseWork4Status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseWork4EligibilityDate" className="text-gray-700 dark:text-gray-300">Eligibility Date</Label>
              <Input
                id="courseWork4EligibilityDate"
                type="date"
                name="courseWork4EligibilityDate"
                value={formData.courseWork4EligibilityDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700">
          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Course Work Completion Dates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="courseworkCompletionDate1" className="text-gray-700 dark:text-gray-300">Course Work 1 Completion Date</Label>
              <Input
                id="courseworkCompletionDate1"
                type="date"
                name="courseworkCompletionDate1"
                value={formData.courseworkCompletionDate1}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseworkCompletionDate2" className="text-gray-700 dark:text-gray-300">Course Work 2 Completion Date</Label>
              <Input
                id="courseworkCompletionDate2"
                type="date"
                name="courseworkCompletionDate2"
                value={formData.courseworkCompletionDate2}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseworkCompletionDate3" className="text-gray-700 dark:text-gray-300">Course Work 3 Completion Date</Label>
              <Input
                id="courseworkCompletionDate3"
                type="date"
                name="courseworkCompletionDate3"
                value={formData.courseworkCompletionDate3}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="courseworkCompletionDate4" className="text-gray-700 dark:text-gray-300">Course Work 4 Completion Date</Label>
              <Input
                id="courseworkCompletionDate4"
                type="date"
                name="courseworkCompletionDate4"
                value={formData.courseworkCompletionDate4}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      <CardHeader className="border-b dark:border-gray-700">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">DC Meetings</CardTitle>
      </CardHeader>
      <div className="p-6 space-y-6">
        {formData.dcMeetings.map((meeting, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <Label className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">DC Meeting {index + 1}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`scheduledDate-${index}`} className="text-gray-700 dark:text-gray-300">Scheduled Date</Label>
                <Input
                  id={`scheduledDate-${index}`}
                  placeholder="Scheduled Date"
                  name={`dcMeetings[${index}].scheduledDate`}
                  type="date"
                  value={meeting.scheduledDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`actualDate-${index}`} className="text-gray-700 dark:text-gray-300">Actual Date</Label>
                <Input
                  id={`actualDate-${index}`}
                  placeholder="Actual Date"
                  name={`dcMeetings[${index}].actualDate`}
                  type="date"
                  value={meeting.actualDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        ))}
        <Button type="button" onClick={addDcmMeetings} className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600">Add DCM Meeting</Button>
      </div>

      <CardHeader className="border-b dark:border-gray-700">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Examination and Defense Dates</CardTitle>
      </CardHeader>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="comprehensiveExamDate" className="text-gray-700 dark:text-gray-300">Comprehensive Exam Date</Label>
            <Input
              id="comprehensiveExamDate"
              name="comprehensiveExamDate"
              type="date"
              value={formData.comprehensiveExamDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proposalDefenseDate" className="text-gray-700 dark:text-gray-300">Proposal Defense Date</Label>
            <Input
              id="proposalDefenseDate"
              name="proposalDefenseDate"
              type="date"
              value={formData.proposalDefenseDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="openSeminarDate1" className="text-gray-700 dark:text-gray-300">Open Seminar Date</Label>
            <Input
              id="openSeminarDate1"
              name="openSeminarDate1"
              type="date"
              value={formData.openSeminarDate1}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preSubmissionSeminarDate" className="text-gray-700 dark:text-gray-300">Pre-Submission Seminar Date</Label>
            <Input
              id="preSubmissionSeminarDate"
              name="preSubmissionSeminarDate"
              type="date"
              value={formData.preSubmissionSeminarDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="synopsisSubmissionDate" className="text-gray-700 dark:text-gray-300">Synopsis Submission Date</Label>
            <Input
              id="synopsisSubmissionDate"
              name="synopsisSubmissionDate"
              type="date"
              value={formData.synopsisSubmissionDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thesisSubmissionDate" className="text-gray-700 dark:text-gray-300">Thesis Submission Date</Label>
            <Input
              id="thesisSubmissionDate"
              name="thesisSubmissionDate"
              type="date"
              value={formData.thesisSubmissionDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thesisDefenseDate" className="text-gray-700 dark:text-gray-300">Thesis Defense Date</Label>
            <Input
              id="thesisDefenseDate"
              name="thesisDefenseDate"
              type="date"
              value={formData.thesisDefenseDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awardOfDegreeDate" className="text-gray-700 dark:text-gray-300">Award of Degree Date</Label>
            <Input
              id="awardOfDegreeDate"
              name="awardOfDegreeDate"
              type="date"
              value={formData.awardOfDegreeDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      <CardHeader className="border-b dark:border-gray-700">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Publications</CardTitle>
      </CardHeader>
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Journals</h3>
        {formData.journals.map((journal, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700">
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Journal {index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`journal-${index}-title`} className="text-gray-700 dark:text-gray-300">Title</Label>
                <Input
                  id={`journal-${index}-title`}
                  placeholder="Title"
                  name={`journals[${index}].title`}
                  value={journal.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`journal-${index}-journalName`} className="text-gray-700 dark:text-gray-300">Journal Name</Label>
                <Input
                  id={`journal-${index}-journalName`}
                  placeholder="Journal Name"
                  name={`journals[${index}].journalName`}
                  value={journal.journalName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`journal-${index}-publicationYear`} className="text-gray-700 dark:text-gray-300">Publication Year</Label>
                <Input
                  id={`journal-${index}-publicationYear`}
                  placeholder="Publication Year"
                  name={`journals[${index}].publicationYear`}
                  value={journal.publicationYear}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`journal-${index}-volumeNumber`} className="text-gray-700 dark:text-gray-300">Volume Number</Label>
                <Input
                  id={`journal-${index}-volumeNumber`}
                  placeholder="Volume Number"
                  name={`journals[${index}].volumeNumber`}
                  value={journal.volumeNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`journal-${index}-issueNumber`} className="text-gray-700 dark:text-gray-300">Issue Number</Label>
                <Input
                  id={`journal-${index}-issueNumber`}
                  placeholder="Issue Number"
                  name={`journals[${index}].issueNumber`}
                  value={journal.issueNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`journal-${index}-pageNumbers`} className="text-gray-700 dark:text-gray-300">Page Numbers</Label>
                <Input
                  id={`journal-${index}-pageNumbers`}
                  placeholder="Page Numbers"
                  name={`journals[${index}].pageNumbers`}
                  value={journal.pageNumbers}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`journal-${index}-impactFactor`} className="text-gray-700 dark:text-gray-300">Impact Factor</Label>
                <Input
                  id={`journal-${index}-impactFactor`}
                  placeholder="Impact Factor"
                  name={`journals[${index}].impactFactor`}
                  value={journal.impactFactor}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
            <Button type="button" onClick={() => deleteJournal(index)} className="mt-2 bg-red-500 hover:bg-red-600 text-white dark:bg-red-700 dark:hover:bg-red-600">
              Delete Journal
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addNewJournal} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600">Add Journal</Button>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Conferences</h3>
        {formData.conferences.map((conference, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700">
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Conference {index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`conference-${index}-title`} className="text-gray-700 dark:text-gray-300">Title</Label>
                <Input
                  id={`conference-${index}-title`}
                  placeholder="Title"
                  name={`conferences[${index}].title`}
                  value={conference.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`conference-${index}-conferenceName`} className="text-gray-700 dark:text-gray-300">Conference Name</Label>
                <Input
                  id={`conference-${index}-conferenceName`}
                  placeholder="Conference Name"
                  name={`conferences[${index}].conferenceName`}
                  value={conference.conferenceName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`conference-${index}-publicationYear`} className="text-gray-700 dark:text-gray-300">Publication Year</Label>
                <Input
                  id={`conference-${index}-publicationYear`}
                  placeholder="Publication Year"
                  name={`conferences[${index}].publicationYear`}
                  value={conference.publicationYear}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
            <Button type="button" onClick={() => deleteConference(index)} className="mt-2 bg-red-500 hover:bg-red-600 text-white dark:bg-red-700 dark:hover:bg-red-600">
              Delete Conference
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addNewConference} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600">Add Conference</Button>
      </div>
    </CardContent>
    <CardFooter>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600">Submit</Button>
    </CardFooter>
  </Card>
</form>
</div>
  );
};

export default PhDScholarForm;