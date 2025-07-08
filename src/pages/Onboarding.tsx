import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VoiceTextInput } from "@/components/VoiceTextInput";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question_text: string;
  question_order: number;
  metadata: any;
}

interface Response {
  question_id: string;
  response: string;
}

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [dynamicQuestions, setDynamicQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

  // Fetch onboarding questions
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['onboarding-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_questions')
        .select('*')
        .order('question_order');
      
      if (error) throw error;
      return data as Question[];
    },
  });

  // Fetch existing responses
  const { data: existingResponses = [] } = useQuery({
    queryKey: ['onboarding-responses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('onboarding_responses')
        .select('question_id, response')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as Response[];
    },
    enabled: !!user?.id,
  });

  // Save response mutation
  const saveResponseMutation = useMutation({
    mutationFn: async ({ questionId, response }: { questionId: string; response: string }) => {
      if (!user?.id) throw new Error('No user');
      
      const { error } = await supabase
        .from('onboarding_responses')
        .upsert({
          user_id: user.id,
          question_id: questionId,
          response,
        }, {
          onConflict: 'user_id,question_id'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-responses'] });
    },
  });

  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      // TODO: Call edge function to create passport
      const { data, error } = await supabase.functions.invoke('create-passport', {
        body: { responses },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Onboarding completed!",
        description: "Your skill passport has been created.",
      });
      navigate('/passport');
    },
    onError: (error) => {
      console.error('Passport creation error:', error);
      toast({
        title: "Error creating passport",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (questions.length > 0) {
      setAllQuestions([...questions]);
      setDynamicQuestions([]);
    }
  }, [questions]);

  useEffect(() => {
    if (existingResponses.length > 0) {
      const responseMap: Record<string, string> = {};
      existingResponses.forEach((resp) => {
        responseMap[resp.question_id] = resp.response;
      });
      setResponses(responseMap);
    }
  }, [existingResponses]);

  const getCurrentQuestion = () => {
    const allQuestionsList = [...allQuestions, ...dynamicQuestions];
    return allQuestionsList[currentStep];
  };

  const handleNext = async () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    const response = responses[currentQuestion.id];
    if (!response?.trim()) {
      toast({
        title: "Response required",
        description: "Please provide a response before continuing.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save the response
      await saveResponseMutation.mutateAsync({
        questionId: currentQuestion.id,
        response,
      });

      // Generate skill-specific questions for section B
      if (currentQuestion.question_order === 4) { // "Name up to five skills" question
        const skills = response.split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 0).slice(0, 5);
        
        const newDynamicQuestions: Question[] = [];
        skills.forEach((skill, index) => {
          const baseOrder = 6.1 + (index * 0.4);
          newDynamicQuestions.push(
            {
              id: `skill-confidence-${skill.replace(/\s+/g, '-').toLowerCase()}`,
              question_text: `On a scale from 1 (novice) to 5 (expert), how confident are you in ${skill}?`,
              question_order: baseOrder,
              metadata: { section: "C", type: "scale", scale: [1, 2, 3, 4, 5], skill }
            },
            {
              id: `skill-frequency-${skill.replace(/\s+/g, '-').toLowerCase()}`,
              question_text: `How often did you use ${skill} in the past month?`,
              question_order: baseOrder + 0.1,
              metadata: { section: "C", type: "select", options: ["Daily", "Weekly", "Monthly", "Rarely"], skill }
            },
            {
              id: `skill-achievement-${skill.replace(/\s+/g, '-').toLowerCase()}`,
              question_text: `What was the largest or most complex thing you achieved with ${skill}?`,
              question_order: baseOrder + 0.2,
              metadata: { section: "C", type: "text", skill }
            },
            {
              id: `skill-training-${skill.replace(/\s+/g, '-').toLowerCase()}`,
              question_text: `When did you last up-skill or train on ${skill}?`,
              question_order: baseOrder + 0.3,
              metadata: { section: "C", type: "select", options: ["Less than 6 months ago", "6-12 months ago", "More than 1 year ago", "Never"], skill }
            }
          );
        });

        setDynamicQuestions(prev => [...prev, ...newDynamicQuestions]);
      }

      // Check for follow-up question
      if (currentQuestion.metadata?.follow_up_question) {
        const followUpQuestion: Question = {
          id: `follow-up-${currentQuestion.id}`,
          question_text: currentQuestion.metadata.follow_up_question,
          question_order: currentQuestion.question_order + 0.5,
          metadata: {},
        };

        setDynamicQuestions(prev => {
          const exists = prev.find(q => q.id === followUpQuestion.id);
          if (!exists) {
            return [...prev, followUpQuestion];
          }
          return prev;
        });
      }

      const allQuestionsList = [...allQuestions, ...dynamicQuestions];
      const totalQuestions = allQuestionsList.length;
      
      if (currentStep < totalQuestions - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete onboarding
        await completeOnboardingMutation.mutateAsync();
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      toast({
        title: "Error",
        description: "Failed to save response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResponseChange = (value: string) => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      setResponses(prev => ({
        ...prev,
        [currentQuestion.id]: value,
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const totalQuestions = allQuestions.length + dynamicQuestions.length;
  const progress = ((currentStep + 1) / Math.max(totalQuestions, 1)) * 100;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>No questions available. Please contact support.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Skill Assessment</h1>
            <Badge variant="secondary">
              {currentStep + 1} of {totalQuestions}
            </Badge>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestion.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <VoiceTextInput
              value={responses[currentQuestion.id] || ""}
              onChange={handleResponseChange}
              placeholder="Type your answer or use voice input..."
              className="w-full"
            />

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={saveResponseMutation.isPending || completeOnboardingMutation.isPending}
              >
                {currentStep === totalQuestions - 1 ? (
                  completeOnboardingMutation.isPending ? "Creating passport..." : "Complete"
                ) : (
                  saveResponseMutation.isPending ? "Saving..." : "Next"
                )}
                {currentStep < totalQuestions - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress stepper */}
        <div className="mt-8">
          <div className="flex justify-center space-x-2">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}