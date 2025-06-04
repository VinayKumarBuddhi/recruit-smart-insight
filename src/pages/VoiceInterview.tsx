
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';

const VoiceInterview = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [answers, setAnswers] = useState<Blob[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      question: "Tell me about yourself and your professional background.",
      timeLimit: 120, // 2 minutes
      category: "Introduction"
    },
    {
      id: 2,
      question: "Describe a challenging project you worked on and how you overcame the obstacles.",
      timeLimit: 180, // 3 minutes
      category: "Problem Solving"
    },
    {
      id: 3,
      question: "How do you handle working in a team environment? Give me a specific example.",
      timeLimit: 150, // 2.5 minutes
      category: "Teamwork"
    },
    {
      id: 4,
      question: "What are your career goals and how does this position align with them?",
      timeLimit: 120, // 2 minutes
      category: "Career Goals"
    },
    {
      id: 5,
      question: "Do you have any questions about the role or our company?",
      timeLimit: 90, // 1.5 minutes
      category: "Questions"
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= currentQuestion.timeLimit) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to record your answers.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = () => {
    if (recordedBlob) {
      const audioUrl = URL.createObjectURL(recordedBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);

      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const retakeRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const submitAnswer = () => {
    if (recordedBlob) {
      const newAnswers = [...answers, recordedBlob];
      setAnswers(newAnswers);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setRecordedBlob(null);
        setRecordingTime(0);
      } else {
        setIsComplete(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeRemaining = currentQuestion.timeLimit - recordingTime;

  if (isComplete) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Interview Complete!</h1>
            <p className="text-slate-600">
              Thank you for completing the voice interview. Your responses are being analyzed.
            </p>
          </div>

          <Card className="bg-blue-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">AI Analysis in Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-800">Transcribing audio responses...</span>
                  <span className="text-blue-600">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-800">Analyzing communication skills...</span>
                  <span className="text-blue-600">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-800">Evaluating responses...</span>
                  <span className="text-blue-600">70%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">What we're analyzing:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Communication clarity and confidence</li>
                  <li>• Content relevance and depth</li>
                  <li>• Professional demeanor and tone</li>
                  <li>• Problem-solving approach</li>
                  <li>• Cultural fit indicators</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Voice Interview</h1>
          <p className="text-slate-600">
            Answer interview questions by recording your voice responses. Speak clearly and take your time.
          </p>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Current Question */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Question {currentQuestion.id}</CardTitle>
                <CardDescription>{currentQuestion.category}</CardDescription>
              </div>
              <span className="text-sm text-slate-500">
                Time Limit: {formatTime(currentQuestion.timeLimit)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-slate-900 mb-6">{currentQuestion.question}</p>
            
            {/* Recording Controls */}
            <div className="space-y-6">
              <div className="text-center">
                {!isRecording && !recordedBlob && (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 h-16 px-8"
                  >
                    <Mic className="w-6 h-6 mr-3" />
                    Start Recording
                  </Button>
                )}

                {isRecording && (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg font-semibold">
                        Recording: {formatTime(recordingTime)}
                      </div>
                      <div className="text-sm text-slate-600">
                        Time Remaining: {formatTime(timeRemaining)}
                      </div>
                    </div>
                    <Button
                      onClick={stopRecording}
                      variant="outline"
                      size="lg"
                    >
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop Recording
                    </Button>
                  </div>
                )}

                {recordedBlob && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600 mb-2">
                        ✓ Recording Complete
                      </div>
                      <div className="text-sm text-slate-600">
                        Duration: {formatTime(recordingTime)}
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-3">
                      <Button
                        onClick={isPlaying ? pausePlayback : playRecording}
                        variant="outline"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Play
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={retakeRecording}
                        variant="outline"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {recordedBlob && (
                <div className="text-center">
                  <Button
                    onClick={submitAnswer}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">Recording Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Speak clearly and at a moderate pace</p>
            </div>
            <div className="flex items-start space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Use the STAR method: Situation, Task, Action, Result</p>
            </div>
            <div className="flex items-start space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Be specific with examples and achievements</p>
            </div>
            <div className="flex items-start space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>You can retake your recording if needed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VoiceInterview;
