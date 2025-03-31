import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PhDPrograms() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Ph.D. by Research Programs</h1>

      <Card className="mb-8 bg-gradient-to-br from-blue-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Part-time opportunities also available for teachers and industry professionals.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cutting-edge research areas in engineering, science, and management.</li>
            <li>Highly experienced Ph.D. faculty on campus: over 70</li>
            <li>TEQIP/World Bank funding including COE</li>
            <li>Crucible of Research and Innovation (CORI) – for multi-disciplinary research</li>
            <li>Several ongoing funded research projects</li>
            <li>Collaboration with reputed universities and industries</li>
            <li>Fellowship/Scholarship/Financial Assistance available</li>
            <li>Computer Science & Engineering</li>
            <li>Electrical Engineering</li>
            <li>Electronics and Communication Engineering</li>
            <li>Mechanical Engineering</li>
            <li>Biotechnology</li>
          </ul>
          <div>
            <h3 className="font-semibold text-lg mb-2">Ph.D in:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Commerce & Management</li>
              <li>Science (Maths, Physics & Chemistry)</li>
              <li>Computer Applications</li>
              <li>Psychology</li>
              <li>Nursing</li>
              <li>Pharmacy</li>
            </ul>
          </div>
          <p className="font-medium text-blue-700">
            Candidates wishing to pursue research careers in interdisciplinary areas are especially encouraged.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-gradient-to-br from-blue-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800">Minimum Qualification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Ph.D.:</h3>
            <p>
              A post-graduate degree in a related field of study from a UGC recognized university, with a minimum of 60%
              aggregate marks (or equivalent grade point average)
            </p>
          </div>
          <div>
            <Badge variant="secondary" className="text-sm">
              Reservation Categories (as notified by Govt. of Karnataka): 10% relaxation
            </Badge>
          </div>
          <p className="text-red-600 font-medium">Distance Education Degrees: not recognized</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800">
            Eligibility for the Award of Ph.D. by Research Degree
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-decimal pl-5 space-y-2">
            <li>Credit compliance for course work within the stipulated maximum time duration</li>
            <li>Successful Proposal Defense</li>
            <li>Credit compliance for Research work within the stipulated maximum time duration</li>
            <li>Compliance with publications requirement</li>
            <li>Open seminars</li>
            <li>Pre-Submission seminar of Synopsis</li>
            <li>Submission of Synopsis</li>
            <li>Submission of Thesis/Dissertation</li>
            <li>Successful defense of the Thesis/Dissertation in the open viva-voce</li>
            <li>Submission of final revised Thesis/Dissertation</li>
            <li>Minimum duration requirement of THREE for Ph.D. by Research</li>
            <li>No pending disciplinary action; and no dues of any kind to the University</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

