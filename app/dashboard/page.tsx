import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export default function StakeholderDashboard() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Stakeholder Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Overall completion of active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={75} className="w-full" />
            <p className="text-right mt-2">75% Complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Financial Transparency</CardTitle>
            <CardDescription>Budget allocation and utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span>Budget Used:</span>
              <span className="font-bold">$750,000 / $1,000,000</span>
            </div>
            <Progress value={75} className="w-full mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Community Sentiment</CardTitle>
            <CardDescription>Based on recent feedback and surveys</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <span className="text-4xl font-bold text-green-500">Positive</span>
              <p className="mt-2">85% approval rating</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Engagement Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Submit Feedback</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Register as Volunteer</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

