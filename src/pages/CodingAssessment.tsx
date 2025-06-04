
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Save, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import Editor from '@monaco-editor/react';

const CodingAssessment = () => {
  const [selectedProblem, setSelectedProblem] = useState('two-sum');
  const [code, setCode] = useState(`def two_sum(nums, target):
    """
    Given an array of integers nums and an integer target,
    return indices of the two numbers such that they add up to target.
    """
    # Your solution here
    pass`);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const problems = {
    'two-sum': {
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      template: `def two_sum(nums, target):
    """
    Given an array of integers nums and an integer target,
    return indices of the two numbers such that they add up to target.
    """
    # Your solution here
    pass`
    },
    'reverse-string': {
      title: 'Reverse String',
      difficulty: 'Easy',
      description: 'Write a function that reverses a string. The input string is given as an array of characters.',
      template: `def reverse_string(s):
    """
    Write a function that reverses a string.
    The input string is given as an array of characters.
    """
    # Your solution here
    pass`
    },
    'palindrome': {
      title: 'Valid Palindrome',
      difficulty: 'Medium',
      description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
      template: `def is_palindrome(s):
    """
    A phrase is a palindrome if, after converting all uppercase letters 
    into lowercase letters and removing all non-alphanumeric characters, 
    it reads the same forward and backward.
    """
    # Your solution here
    pass`
    }
  };

  const handleProblemChange = (problemKey: string) => {
    setSelectedProblem(problemKey);
    setCode(problems[problemKey as keyof typeof problems].template);
    setOutput('');
    setIsSubmitted(false);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput(`Running your code...
Test Case 1: PASSED
Test Case 2: PASSED
Test Case 3: FAILED
Expected: [0, 1]
Got: [1, 0]

Time Complexity: O(n²)
Space Complexity: O(1)`);
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    // Here you would send the code to your backend for AI analysis
    console.log('Submitting code for AI analysis:', code);
  };

  const currentProblem = problems[selectedProblem as keyof typeof problems];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Coding Assessment</h1>
          <p className="text-slate-600">
            Solve coding problems to demonstrate your programming skills. Your code will be analyzed by AI for quality and efficiency.
          </p>
        </div>

        {/* Problem Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Problem</CardTitle>
            <CardDescription>Choose a coding problem to solve</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedProblem} onValueChange={handleProblemChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a problem" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(problems).map(([key, problem]) => (
                  <SelectItem key={key} value={key}>
                    {problem.title} ({problem.difficulty})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{currentProblem.title}</CardTitle>
                  <CardDescription>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      currentProblem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      currentProblem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentProblem.difficulty}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">{currentProblem.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-slate-900">Example:</h4>
                  <div className="bg-slate-50 p-3 rounded-md text-sm font-mono">
                    <div>Input: nums = [2,7,11,15], target = 9</div>
                    <div>Output: [0,1]</div>
                    <div className="text-slate-600">Explanation: nums[0] + nums[1] = 2 + 7 = 9</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900">Constraints:</h4>
                  <ul className="text-sm text-slate-600 list-disc list-inside">
                    <li>2 ≤ nums.length ≤ 10⁴</li>
                    <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                    <li>-10⁹ ≤ target ≤ 10⁹</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Code Editor</CardTitle>
              <CardDescription>Write your solution below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Editor
                  height="400px"
                  defaultLanguage="python"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  variant="outline"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submitted
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Submit for Review
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output */}
        {output && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                {output}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* AI Feedback (shown after submission) */}
        {isSubmitted && (
          <Card className="bg-blue-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">AI Analysis Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">85/100</div>
                  <div className="text-sm text-blue-800">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">A-</div>
                  <div className="text-sm text-blue-800">Code Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">B+</div>
                  <div className="text-sm text-blue-800">Efficiency</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-blue-900">Strengths:</h4>
                  <ul className="text-blue-800 text-sm list-disc list-inside">
                    <li>Clean and readable code structure</li>
                    <li>Correct algorithm implementation</li>
                    <li>Good variable naming</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-900">Areas for Improvement:</h4>
                  <ul className="text-blue-800 text-sm list-disc list-inside">
                    <li>Consider using a hash map for O(n) time complexity</li>
                    <li>Add input validation</li>
                    <li>Include comprehensive comments</li>
                  </ul>
                </div>
              </div>
              
              <Button onClick={() => navigate('/voice-interview')} className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                Continue to Voice Interview
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CodingAssessment;
