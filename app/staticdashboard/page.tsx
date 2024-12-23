'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, FileText, Users, Calendar, Bell, Search, BookMarked, GraduationCap } from 'lucide-react';

const publicationData = [
  { year: '2018', count: 2 },
  { year: '2019', count: 3 },
  { year: '2020', count: 1 },
  { year: '2021', count: 4 },
  { year: '2022', count: 5 },
  { year: '2023', count: 3 },
];

export default function PhDResearchDashboard() {

  
  // Render loading spinner if status is "loading"
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="animate-spin h-5 w-5 mr-2 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 0 16 0A8 8 0 0 0 4 12z"/></svg>
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PhD Research Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search research..."
                className="pl-10 pr-4 py-2 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Publications</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">3 new in the last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Citations</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">+28 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collaborators</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Across 5 institutions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Deadline</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15 Days</div>
                <p className="text-xs text-muted-foreground">Conference paper submission</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Publication History</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={publicationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Publications</CardTitle>
                <CardDescription>Your latest research outputs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[
                    "Machine Learning in Quantum Computing",
                    "Novel Approaches to Climate Change Mitigation",
                    "Advancements in CRISPR Gene Editing",
                    "Sustainable Energy Storage Solutions",
                    "Neuroplasticity in Adult Learning"
                  ].map((title, i) => (
                    <div key={i} className="flex items-center">
                      <BookMarked className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{title}</p>
                        <p className="text-sm text-muted-foreground">
                          Published in Journal of {i % 2 === 0 ? 'Science' : 'Nature'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Conferences and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[
                    { event: "International Conference on AI", date: "Aug 15-17, 2024" },
                    { event: "Thesis Committee Meeting", date: "Sep 5, 2024" },
                    { event: "Grant Proposal Deadline", date: "Oct 1, 2024" },
                    { event: "Department Seminar Presentation", date: "Oct 15, 2024" },
                    { event: "Annual Progress Review", date: "Nov 30, 2024" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{item.event}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}