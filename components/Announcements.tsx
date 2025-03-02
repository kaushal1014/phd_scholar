import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const announcements = [
  {
    id: 1,
    title: "New Research Grant Opportunity",
    content: "Applications are now open for the 2024 Innovative Research Grant. Deadline: August 31, 2024.",
  },
  {
    id: 2,
    title: "Upcoming Workshop",
    content: "Join us for a workshop on 'Advanced Data Analysis Techniques' on July 15, 2024.",
  },
  {
    id: 3,
    title: "Publication Achievement",
    content: "Congratulations to Dr. Jane Doe for publishing in Nature. Read the paper here.",
  },
]

export function Announcements() {
  return (
    <Card className="border-t-4 border-t-[#1B3668] bg-card text-card-foreground shadow-md">
      <CardHeader>
        <CardTitle className="text-[#1B3668]">Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {announcements.map((announcement) => (
            <li key={announcement.id} className="border-b pb-2 last:border-b-0 flex items-start">
              <div>
                <h4 className="font-semibold text-[#1B3668]">{announcement.title}</h4>
                <p className="text-sm text-muted-foreground">{announcement.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}