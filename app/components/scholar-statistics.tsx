import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle } from "lucide-react"

interface FacultyStats {
  total: number
  FT: number
  IPT: number
  EPT: number
}

interface ModeStats {
  FT: number
  IPT: number
  EPT: number
}

interface Statistics {
  facultyStats: { [key: string]: FacultyStats }
  modeStats: ModeStats
  total: number
}

interface ErrorResponse {
  error: string
  details?: string
}

export function ScholarStatistics() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [drilldownGroup, setDrilldownGroup] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/admin/statistics')
        const data = await response.json()
        
        if (!response.ok) {
          const errorData = data as ErrorResponse
          throw new Error(errorData.details || errorData.error || 'Failed to fetch statistics')
        }
        
        // Validate the data structure
        if (!data.facultyStats || !data.modeStats) {
          throw new Error('Invalid data structure received from server')
        }

        setStatistics(data)
        setError(null)
        setErrorDetails(null)
      } catch (error) {
        console.error('Error fetching statistics:', error)
        setError(error instanceof Error ? error.message : 'Failed to load statistics')
        setErrorDetails(error instanceof Error ? (error.stack ?? null) : null)
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          <p>{error}</p>
          {errorDetails && (
            <pre className="mt-2 text-xs bg-red-50 p-2 rounded">
              {errorDetails}
            </pre>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  if (!statistics || !statistics.facultyStats || !statistics.modeStats) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>
          No statistics data available or invalid data format.
        </AlertDescription>
      </Alert>
    )
  }

  // Add this function to clean faculty names
  function cleanFacultyName(name: string) {
    // Remove 'PhD', 'engg', hyphens, and trim spaces
    return name
      .replace(/^PhD engg-?/i, '')
      .replace(/^PhD-engg-?/i, '')
      .replace(/^PhDengg-?/i, '')
      .replace(/^PhDengg/i, '')
      .replace(/^PhD /i, '')
      .replace(/^PhD/i, '')
      .replace(/^engg-?/i, '')
      .replace(/-/g, '')
      .trim();
  }

  // Update the function to group only core engineering departments
  function mapToEngineering(name: string) {
    const normalized = name.toUpperCase().replace(/\s+/g, '');
    const engDepts = ['CSE', 'CV', 'ECE', 'EEE', 'ME'];
    if (engDepts.includes(normalized)) {
      return 'Engineering';
    }
    return name;
  }

  // Add this function to group pharmacy departments
  function mapToPharmacy(name: string) {
    const normalized = name.toUpperCase().replace(/\s+/g, '');
    const pharmacyDepts = ['PHARMACY', 'PHARMACOLOGY', 'PHARMACEUTICS', 'PHARMACOGNOSY', 'PHARMACY PRACTICE', 'PHARMACEUTICAL CHEMISTRY']; // Add more as needed
    if (pharmacyDepts.includes(normalized)) {
      return 'Pharmacy';
    }
    return name;
  }

  // Prepare data for faculty chart with Engineering aggregation
  const facultyAgg: { [key: string]: { FT: number, IPT: number, EPT: number } } = {};

  Object.entries(statistics.facultyStats).forEach(([faculty, stats]) => {
    let name = cleanFacultyName(faculty);
    if (name.toUpperCase().replace(/\s+/g, '') === 'DIRECTPHD') return; // Skip Direct PhD
    name = mapToEngineering(name);
    name = mapToPharmacy(name);

    if (!facultyAgg[name]) {
      facultyAgg[name] = { FT: 0, IPT: 0, EPT: 0 };
    }
    facultyAgg[name].FT += stats.FT;
    facultyAgg[name].IPT += stats.IPT;
    facultyAgg[name].EPT += stats.EPT;
  });

  // Prepare and sort faculty data with 'total' for sorting
  const facultyDataWithTotal = Object.entries(facultyAgg)
    .map(([name, stats]) => ({
      name,
      'Full Time': stats.FT,
      'Internal Part Time': stats.IPT,
      'External Part Time': stats.EPT,
      total: stats.FT + stats.IPT + stats.EPT
    }))
    .sort((a, b) => b.total - a.total); // Sort descending by total

  // Prepare facultyData for display (without 'total')
  const facultyData = facultyDataWithTotal.map(({ total, ...rest }) => rest);

  // Drilldown data for Engineering, Science, or Pharmacy (based on Department field from CSV)
  let drilldownData: any[] = [];
  if (drilldownGroup && statistics && (statistics as any).rawRecords) {
    // Get the original CSV records
    const records = (statistics as any).rawRecords as any[];
    // Define department lists for each group
    const engineeringDepartments = ['CSE', 'CV', 'ECE', 'EEE', 'ME'];
    const scienceDepartments = ['PHYSICS', 'CHEMISTRY', 'MATHS', 'BIOLOGY'];
    const pharmacyDepartments = ['PHARMACY', 'PHARMACOLOGY', 'PHARMACEUTICS', 'PHARMACOGNOSY', 'PHARMACY PRACTICE', 'PHARMACEUTICAL CHEMISTRY']; // Add more as needed
    // Aggregate by Department
    const deptAgg: { [key: string]: { FT: number, IPT: number, EPT: number } } = {};
    records.forEach((record: any) => {
      const dept = (record.Department || '').toUpperCase().trim();
      const mode = record.Mode?.toUpperCase() || 'UNKNOWN';
      let include = false;
      if (drilldownGroup === 'Engineering' && engineeringDepartments.includes(dept)) include = true;
      if (drilldownGroup === 'Science' && scienceDepartments.includes(dept)) include = true;
      if (drilldownGroup === 'Pharmacy' && pharmacyDepartments.includes(dept)) include = true;
      if (!include) return;
      if (!deptAgg[dept]) deptAgg[dept] = { FT: 0, IPT: 0, EPT: 0 };
      if (mode === 'FT') deptAgg[dept].FT++;
      else if (mode === 'IPT') deptAgg[dept].IPT++;
      else if (mode === 'EPT') deptAgg[dept].EPT++;
    });
    drilldownData = Object.entries(deptAgg).map(([name, stats]) => ({
      name,
      'Full Time': stats.FT,
      'Internal Part Time': stats.IPT,
      'External Part Time': stats.EPT,
      total: stats.FT + stats.IPT + stats.EPT
    })).sort((a, b) => b.total - a.total);
    drilldownData.forEach(d => { delete d.total; });
  }

  // Prepare data for mode chart
  const modeData = [
    { name: 'Full Time', value: statistics.modeStats.FT },
    { name: 'Internal Part Time', value: statistics.modeStats.IPT },
    { name: 'External Part Time', value: statistics.modeStats.EPT }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PhD Scholar Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{statistics.total}</div>
                <p className="text-xs text-muted-foreground">Total Scholars</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{statistics.modeStats.FT}</div>
                <p className="text-xs text-muted-foreground">Full Time Scholars</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {statistics.modeStats.IPT + statistics.modeStats.EPT}
                </div>
                <p className="text-xs text-muted-foreground">Part Time Scholars</p>
              </CardContent>
            </Card>
          </div>

          {facultyData.length > 0 ? (
            drilldownGroup ? (
              <div className="h-[400px] mb-6">
                <button onClick={() => setDrilldownGroup(null)} className="mb-2 text-blue-600 underline">Back</button>
                <h3 className="text-lg font-semibold mb-4">{drilldownGroup} - Department-wise Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={drilldownData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} interval={0} tick={{ fontSize: 12, dy: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Full Time" stackId="a" fill="#2196F3" name="PhD FT" />
                    <Bar dataKey="Internal Part Time" stackId="a" fill="#4CAF50" name="PhD IPT" />
                    <Bar dataKey="External Part Time" stackId="a" fill="#9E9E9E" name="PhD EPT" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[400px] mb-6">
                <h3 className="text-lg font-semibold mb-4">Faculty-wise Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={facultyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} interval={0} tick={{ fontSize: 12, dy: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Full Time" stackId="a" fill="#2196F3" name="PhD FT" onClick={(_, index) => {
                      const groupName = facultyData[index].name;
                      if (groupName === 'Engineering' || groupName === 'Science' || groupName === 'Pharmacy') {
                        setDrilldownGroup(groupName);
                      }
                    }} cursor="pointer" />
                    <Bar dataKey="Internal Part Time" stackId="a" fill="#4CAF50" name="PhD IPT" onClick={(_, index) => {
                      const groupName = facultyData[index].name;
                      if (groupName === 'Engineering' || groupName === 'Science' || groupName === 'Pharmacy') {
                        setDrilldownGroup(groupName);
                      }
                    }} cursor="pointer" />
                    <Bar dataKey="External Part Time" stackId="a" fill="#9E9E9E" name="PhD EPT" onClick={(_, index) => {
                      const groupName = facultyData[index].name;
                      if (groupName === 'Engineering' || groupName === 'Science' || groupName === 'Pharmacy') {
                        setDrilldownGroup(groupName);
                      }
                    }} cursor="pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Faculty Data</AlertTitle>
              <AlertDescription>
                No faculty-wise distribution data available.
              </AlertDescription>
            </Alert>
          )}

          {/* Summary Table and Mode-wise Chart Side by Side */}
          <div className="flex flex-row gap-x-8 mt-8 w-full">
            {/* Enhanced Table */}
            <div className="w-2/3 overflow-x-auto">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Summary Table (Top-level Groups)</h3>
              <table className="min-w-full border border-gray-200 rounded-lg shadow-sm bg-white">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 border-b font-semibold text-gray-700">Group</th>
                    <th className="px-4 py-3 border-b font-semibold text-gray-700">Full Time</th>
                    <th className="px-4 py-3 border-b font-semibold text-gray-700">Internal Part Time</th>
                    <th className="px-4 py-3 border-b font-semibold text-gray-700">External Part Time</th>
                    <th className="px-4 py-3 border-b font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyData.map((row, idx) => (
                    <tr key={row.name} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-2 border-b font-medium text-gray-800">{row.name}</td>
                      <td className="px-4 py-2 border-b text-center">{row['Full Time']}</td>
                      <td className="px-4 py-2 border-b text-center">{row['Internal Part Time']}</td>
                      <td className="px-4 py-2 border-b text-center">{row['External Part Time']}</td>
                      <td className="px-4 py-2 border-b text-center font-semibold">{row['Full Time'] + row['Internal Part Time'] + row['External Part Time']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Enhanced Chart Card */}
            <div className="w-1/3 flex justify-center items-start">
              <div className="w-full max-w-xs bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Mode-wise Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={modeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#1B3668" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 