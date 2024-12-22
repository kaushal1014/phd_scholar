'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookMarked, Mail, Shield, CheckCircle, LogIn, Loader2 } from 'lucide-react';
import { User as UserType } from '@/types';

export default function PhDResearchDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/user/phd-scholar')
        .then(response => response.json())
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [status]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const resetTimeout = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        signOut();
      }, 20 * 60 * 1000); // 20 minutes
    };
    const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];
    events.forEach(event => window.addEventListener(event, resetTimeout));

    resetTimeout(); // Initialize timeout on component mount

    return () => {
      if (timeout) clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimeout));
    };
  }, []);

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">PhD Research Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <LogIn className="h-16 w-16 text-primary mb-4" />
            <Button onClick={() => router.push('/login')} className="w-full">
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
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">PhD Research Dashboard</CardTitle>
            <CardDescription>Loading your data</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "authenticated" && data && data.phdScholar) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div>
                  <CardTitle className="text-2xl">Welcome, {session.user.name}!</CardTitle>
                  <CardDescription>PhD Research Dashboard</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{session.user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Admin: {session.user.isAdmin ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Verified: {session.user.isVerified ? "Yes" : "No"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PhD Scholar Details</CardTitle>
              <CardDescription>Your academic journey at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{data.firstName} {data.lastName}</p>
                    <p className="text-sm text-muted-foreground">Department: {data.phdScholar.admissionDetails.department}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Journals</h2>
                  <div className="space-y-4">
                    {data.phdScholar.publications.journals.map((journal, i) => (
                      <div key={i} className="flex items-center">
                        <BookMarked className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{journal.title}</p>
                          <p className="text-sm text-muted-foreground">Published in {journal.journalName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Conferences</h2>
                  <div className="space-y-4">
                    {data.phdScholar.publications.conferences.map((conference, i) => (
                      <div key={i} className="flex items-center">
                        <BookMarked className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{conference.title}</p>
                          <p className="text-sm text-muted-foreground">Presented at {conference.conferenceName}</p>
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

  return null;
}
