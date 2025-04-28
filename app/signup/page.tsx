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
      <Card className="w-full max-w-2xl sm:max-w-3xl mx-auto p-2 sm:p-6 rounded-lg shadow-md">
        <CardHeader className="p-2 sm:p-6">
          <CardTitle className="text-lg sm:text-2xl font-bold text-center">PhD Scholar Signup</CardTitle>
        </CardHeader>
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
            <div className="w-full">
              <Label htmlFor="firstName" className="text-sm sm:text-base">First Name</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
            </div>
            <div className="w-full">
              <Label htmlFor="middleName" className="text-sm sm:text-base">Middle Name</Label>
              <Input id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
            </div>
            <div className="w-full">
              <Label htmlFor="lastName" className="text-sm sm:text-base">Last Name</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
            </div>
          </div>
          <div className="w-full">
            <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
            <Input id="email" name="email" type="email" placeholder="example@pesu.pes.edu" onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
            <div className="relative">
              <Input id="password" name="password" type={showPassword ? "text" : "password"} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
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
          <div className="w-full">
            <Label htmlFor="dateOfBirth" className="text-sm sm:text-base">Date of Birth</Label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="nationality" className="text-sm sm:text-base">Nationality</Label>
            <Input id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="mobileNumber" className="text-sm sm:text-base">Mobile Number</Label>
            <Input id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="entranceExamination" className="text-sm sm:text-base">Entrance Examination</Label>
            <Input id="entranceExamination" name="entranceExamination" value={formData.entranceExamination} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="qualifyingExamination" className="text-sm sm:text-base">Qualifying Examination</Label>
            <Input id="qualifyingExamination" name="qualifyingExamination" value={formData.qualifyingExamination} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="allotmentNumber" className="text-sm sm:text-base">Allotment Number</Label>
            <Input id="allotmentNumber" name="allotmentNumber" value={formData.allotmentNumber} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="admissionDate" className="text-sm sm:text-base">Admission Date</Label>
            <Input id="admissionDate" name="admissionDate" type="date" value={formData.admissionDate} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="department" className="text-sm sm:text-base">Department</Label>
            <Input id="department" name="department" value={formData.department} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="usn" className="text-sm sm:text-base">USN</Label>
            <Input id="usn" name="usn" value={formData.usn} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="srn" className="text-sm sm:text-base">SRN</Label>
            <Input id="srn" name="srn" value={formData.srn} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="modeOfProgram" className="text-sm sm:text-base">Mode of Program</Label>
            <Input id="modeOfProgram" name="modeOfProgram" value={formData.modeOfProgram} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="researchSupervisor" className="text-sm sm:text-base">Research Supervisor</Label>
            <Input id="researchSupervisor" name="researchSupervisor" value={formData.researchSupervisor} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <div className="w-full">
            <Label htmlFor="researchCoSupervisor" className="text-sm sm:text-base">Research Co-Supervisor</Label>
            <Input id="researchCoSupervisor" name="researchCoSupervisor" value={formData.researchCoSupervisor} onChange={handleChange} className="w-full px-2 py-2 text-sm sm:text-base" />
          </div>
          <Button type="submit" className="w-full sm:w-auto mt-4 bg-[#1B3668] text-white hover:bg-[#0F2341] py-2 text-base rounded-lg">Submit</Button>
        </form>
      </Card>
    </div>
  );
};

export default PhDScholarForm;