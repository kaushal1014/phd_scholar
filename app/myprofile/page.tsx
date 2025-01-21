'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, BookMarked, Mail, Shield, CheckCircle, Loader2, Edit2, Save, X, Calendar } from 'lucide-react';
import { User as UserType, PhdScholar } from '@/types';
import { GetStaticPaths, GetStaticProps } from 'next';


type IndexedUser = UserType & { [key: string]: any };
type IndexedPhdScholar = PhdScholar & { [key: string]: any };

type CourseworkDetailsKeys = 'courseWork1' | 'courseWork2' | 'courseWork3' | 'courseWork4';

export default function UserProfile({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [phdScholarData, setPhdScholarData] = useState<PhdScholar | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<{ user: UserType | null, phdScholar: PhdScholar | null }>({ user: null, phdScholar: null });

  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/user/user`)
        .then(response => response.json())
        .then(data => {
          setUserData(data);
          setEditedData(prev => ({ ...prev, user: data }));
          return fetch(`/api/user/phd-scholar`);
        })
        .then(response => response.json())
        .then(data => {
          setPhdScholarData(data);
          setEditedData(prev => ({ ...prev, phdScholar: data }));
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [status, id]);

  const handleInputChange = (section: 'user' | 'phdScholar', field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section: 'user' | 'phdScholar', nestedField: string, field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedField]: {
          ...(prev[section] as IndexedUser | IndexedPhdScholar)[nestedField],
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically make API calls to save the changes
    setUserData(editedData.user);
    setPhdScholarData(editedData.phdScholar);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({ user: userData, phdScholar: phdScholarData });
    setIsEditing(false);
  };

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md border-[#1B3C87] shadow-lg">
          <CardHeader className="text-center bg-[#1B3C87] text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-6">
            <Button onClick={() => router.push('/login')} className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md border-[#1B3C87] shadow-lg">
          <CardHeader className="text-center bg-[#1B3C87] text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
            <CardDescription className="text-gray-200">Loading your data</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-6">
            <Loader2 className="h-16 w-16 text-[#FF6B00] animate-spin mb-4" />
            <p className="text-[#1B3C87]">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "authenticated" && userData && phdScholarData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-[#1B3C87] shadow-lg overflow-hidden">
            <CardHeader className="bg-[#1B3C87] text-white p-6 flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Welcome, {userData.firstName} {userData.lastName}!</CardTitle>
                <CardDescription className="text-gray-200">User Profile</CardDescription>
              </div>
              {isEditing ? (
                <div className="flex space-x-2">
                  <Button onClick={handleCancel} variant="outline" className="bg-white text-[#1B3C87] hover:bg-gray-100">
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
                  <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-[#FF6B00]" />
                  {isEditing ? (
                    <Input
                      value={editedData.user?.email}
                      onChange={(e) => handleInputChange('user', 'email', e.target.value)}
                      className="flex-1"
                    />
                  ) : (
                    <span>{userData.email}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-[#FF6B00]" />
                  <span>Admin: {userData.isAdmin ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-[#FF6B00]" />
                  <span>Verified: {userData.isVerified ? "Yes" : "No"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1B3C87] shadow-lg overflow-hidden">
            <CardHeader className="bg-[#1B3C87] text-white p-6">
              <CardTitle>PhD Scholar Details</CardTitle>
              <CardDescription className="text-gray-200">Your academic journey at a glance</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                <div className="flex items-center">
                  <GraduationCap className="h-6 w-6 mr-2 text-[#FF6B00]" />
                  <div className="space-y-1">
                    <p className="text-lg font-medium">
                      {isEditing ? (
                        <Input
                          value={`${editedData.phdScholar?.personalDetails?.firstName} ${editedData.phdScholar?.personalDetails?.lastName}`}
                          onChange={(e) => {
                            const [firstName, ...lastNameParts] = e.target.value.split(' ');
                            handleNestedInputChange('phdScholar', 'personalDetails', 'firstName', firstName);
                            handleNestedInputChange('phdScholar', 'personalDetails', 'lastName', lastNameParts.join(' '));
                          }}
                          className="font-medium"
                        disabled/>
                      ) : (
                        `${phdScholarData.personalDetails?.firstName} ${phdScholarData.personalDetails?.lastName}`
                      )}
                    </p>
                    <p className="text-[#1B3C87]">
                      Department: {isEditing ? (
                        <Input
                          value={editedData.phdScholar?.admissionDetails?.department}
                          onChange={(e) => handleNestedInputChange('phdScholar', 'admissionDetails', 'department', e.target.value)}
                          className="inline-block w-auto"
                        />
                      ) : (
                        phdScholarData.admissionDetails?.department
                      )}
                    </p>
                  </div>
                </div>

                {/* Personal Details */}
                <div>
                  <h2 className="text-xl font-bold text-[#1B3C87] mb-2">Personal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Object.entries(phdScholarData.personalDetails || {}) as [keyof typeof phdScholarData.personalDetails, any][]).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">{key}</label>
                        {isEditing ? (
                          <Input
                            value={editedData.phdScholar?.personalDetails?.[key] instanceof Date ? editedData.phdScholar?.personalDetails?.[key].toLocaleDateString() : editedData.phdScholar?.personalDetails?.[key] || ''}
                            onChange={(e) => handleNestedInputChange('phdScholar', 'personalDetails', key, e.target.value)}
                          />
                        ) : (
                          <p>{value?.toString() || 'N/A'}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admission Details */}
                <div>
                  <h2 className="text-xl font-bold text-[#1B3C87] mb-2">Admission Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Object.entries(phdScholarData.admissionDetails || {}) as [keyof typeof phdScholarData.admissionDetails, any][]).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">{key}</label>
                        {isEditing ? (
                          <Input
                            value={editedData.phdScholar?.admissionDetails?.[key] instanceof Date ? editedData.phdScholar?.admissionDetails?.[key].toISOString().split('T')[0] : editedData.phdScholar?.admissionDetails?.[key] || ''}
                            onChange={(e) => handleNestedInputChange('phdScholar', 'admissionDetails', key, e.target.value)}
                          />
                        ) : (
                          <p>{value?.toString() || 'N/A'}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                

                {/* Research Details */}
                {/* <div>
                  <h2 className="text-xl font-bold text-[#1B3C87] mb-2">Research Details</h2>
                  <div className="space-y-2">
                    {(Object.entries(phdScholarData.researchDetails || {}) as [keyof typeof phdScholarData.researchDetails, any][]).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">{key}</label>
                        {isEditing ? (
                          key === 'doctoralCommitteeMembers' ? (
                            <Textarea
                              value={(editedData.phdScholar?.researchDetails?.[key] as string[])?.join(', ')}
                              onChange={(e) => handleNestedInputChange('phdScholar', 'researchDetails', key, e.target.value.split(', '))}
                            />
                          ) : (
                            <Input
                              value={editedData.phdScholar?.researchDetails?.[key] || ''}
                              onChange={(e) => handleNestedInputChange('phdScholar', 'researchDetails', key, e.target.value)}
                            />
                          )
                        ) : (
                          <p>{Array.isArray(value) ? value.join(', ') : value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Coursework Details */}
                {/* <div>
                  <h2 className="text-xl font-bold text-[#1B3C87] mb-2">Coursework Details</h2>
                  <div className="space-y-4">
                    {Object.entries(phdScholarData.courseworkDetails || {}).map(([courseKey, courseValue]) => (
                      <div key={courseKey} className="border p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">{courseKey}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(courseValue || {}).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                              <label className="text-sm font-medium text-gray-600">{key}</label>
                              {isEditing ? (
                                <Input
                                  value={editedData.phdScholar?.courseworkDetails?.[courseKey as CourseworkDetailsKeys]?.[key as keyof typeof courseValue] instanceof Date
                                    ? (editedData.phdScholar?.courseworkDetails?.[courseKey as CourseworkDetailsKeys]?.[key as keyof typeof courseValue] as Date).toISOString().split('T')[0]
                                    : editedData.phdScholar?.courseworkDetails?.[courseKey as CourseworkDetailsKeys]?.[key as keyof typeof courseValue]?.toString() || ''}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNestedInputChange('phdScholar', 'courseworkDetails', courseKey as CourseworkDetailsKeys, {
                                    ...editedData.phdScholar?.courseworkDetails?.[courseKey as CourseworkDetailsKeys],
                                    [key]: e.target.value
                                  })}
                                />
                              ) : (
                                <p>{value?.toString() || 'N/A'}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Exam Dates */}
                {/* <div>
                  <h2 className="text-xl font-bold text-[#1B3C87] mb-2">Exam Dates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Object.entries(phdScholarData.examDates || {}) as [keyof typeof phdScholarData.examDates, Date | null][]).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">{key}</label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={editedData.phdScholar?.examDates?.[key]?.toString().split('T')[0] || ''}
                            onChange={(e) => handleNestedInputChange('phdScholar', 'examDates', key, e.target.value)}
                          />
                        ) : (
                          <p>{value instanceof Date ? value.toLocaleDateString() : 'N/A'}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>  */}

                {/* Publications */}
                <div>
                  <h2 className="text-xl font-bold text-[#1B3C87] mb-2">Publications</h2>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#1B3C87]">Journals</h3>
                    {(editedData.phdScholar?.publications?.journals || []).map((journal, index) => (
                      <div key={index} className="border p-4 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Title</label>
                            {isEditing ? (
                              <Input
                                value={journal.title || ''}
                                onChange={(e) => {
                                  const newJournals = [...(editedData.phdScholar?.publications?.journals || [])];
                                  newJournals[index] = { ...newJournals[index], title: e.target.value };
                                  handleNestedInputChange('phdScholar', 'publications', 'journals', newJournals);
                                }}
                              />
                            ) : (
                              <p>{journal.title}</p>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Journal Name</label>
                            {isEditing ? (
                              <Input
                                value={journal.journalName || ''}
                                onChange={(e) => {
                                  const newJournals = [...(editedData.phdScholar?.publications?.journals || [])];
                                  newJournals[index] = { ...newJournals[index], journalName: e.target.value };
                                  handleNestedInputChange('phdScholar', 'publications', 'journals', newJournals);
                                }}
                              />
                            ) : (
                              <p>{journal.journalName}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <h3 className="text-lg font-semibold text-[#1B3C87]">Conferences</h3>
                    {(editedData.phdScholar?.publications?.conferences || []).map((conference, index) => (
                      <div key={index} className="border p-4 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Title</label>
                            {isEditing ? (
                              <Input
                                value={conference.title || ''}
                                onChange={(e) => {
                                  const newConferences = [...(editedData.phdScholar?.publications?.conferences || [])];
                                  newConferences[index] = { ...newConferences[index], title: e.target.value };
                                  handleNestedInputChange('phdScholar', 'publications', 'conferences', newConferences);
                                }}
                              />
                            ) : (
                              <p>{conference.title}</p>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Conference Name</label>
                            {isEditing ? (
                              <Input
                                value={conference.conferenceName || ''}
                                onChange={(e) => {
                                  const newConferences = [...(editedData.phdScholar?.publications?.conferences || [])];
                                  newConferences[index] = { ...newConferences[index], conferenceName: e.target.value };
                                  handleNestedInputChange('phdScholar', 'publications', 'conferences', newConferences);
                                }}
                              />
                            ) : (
                              <p>{conference.conferenceName}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

// export async function generateStaticParams() {
//   const res = await fetch('api/allUsers');
//   const users: IndexedUser[] = await res.json();

//   return users.map(user => ({
//     id: user._id.toString(),
//   }));
// }


