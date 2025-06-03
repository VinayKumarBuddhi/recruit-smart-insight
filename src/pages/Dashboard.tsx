
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Code, Mic, Brain, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';

const Dashboard = () => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState({
    resume: false,
    profile: false,
    coding: false,
    interview: false
  });

  const assessmentSteps = [
    {
      id: 'resume',
      title: 'Upload Resume',
      description: 'Upload your resume for AI-powered analysis',
      icon: Upload,
      route: '/resume-upload',
      completed: completedSteps.resume,
      time: '2 min'
    },
    {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Review and enhance your auto-filled profile',
      icon: Brain,
      route: '/profile',
      completed: completedSteps.profile,
      time: '5 min'
    },
    {
      id: 'coding',
      title: 'Coding Assessment',
      description: 'Solve coding challenges with AI evaluation',
      icon: Code,
      route: '/coding-assessment',
      completed: completedSteps.coding,
      time: '30 min'
    },
    {
      id: 'interview',
      title: 'Voice Interview',
      description: 'Answer interview questions via voice recording',
      icon: Mic,
      route: '/voice-interview',
      completed: completedSteps.interview,
      time: '15 min'
    }
  ];

  const completionPercentage = Object.values(completedSteps).filter(Boolean).length * 25;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Assessment</h1>
          <p className="text-blue-100 mb-6">
            Complete your AI-powered recruitment journey in just 4 simple steps
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{completionPercentage}% Complete</span>
              </div>
              <Progress value={completionPercentage} className="h-2 bg-blue-500" />
            </div>
          </div>
        </div>

        {/* Assessment Steps */}
        <div className="grid gap-6">
          <h2 className="text-2xl font-bold text-slate-900">Assessment Steps</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {assessmentSteps.map((step) => (
              <Card 
                key={step.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  step.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-slate-200 hover:border-blue-300'
                }`}
                onClick={() => navigate(step.route)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-500' 
                          : 'bg-gradient-to-br from-blue-600 to-teal-600'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <step.icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>{step.time}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                  <div className="mt-4">
                    <Button 
                      variant={step.completed ? "secondary" : "default"}
                      className={step.completed ? "" : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"}
                    >
                      {step.completed ? 'Review' : 'Start'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-blue-600">
                {Object.values(completedSteps).filter(Boolean).length}
              </CardTitle>
              <CardDescription>Steps Completed</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-teal-600">0</CardTitle>
              <CardDescription>AI Feedback Reports</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-slate-600">--</CardTitle>
              <CardDescription>Overall Score</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
