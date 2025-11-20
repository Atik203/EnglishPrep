"use client";

import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreatePracticeMutation,
  useGetPracticesQuery,
} from "@/redux/features/practice/practiceApi";
import {
  BookOpen,
  CheckCircle2,
  Headphones,
  Loader2,
  MessageSquare,
  PenTool,
  Send,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const EXAMS = [
  { value: "IELTS", label: "IELTS", color: "from-blue-500 to-cyan-500" },
  { value: "TOEFL", label: "TOEFL", color: "from-purple-500 to-pink-500" },
  { value: "GRE", label: "GRE", color: "from-orange-500 to-red-500" },
] as const;

const SKILLS = [
  {
    value: "reading",
    label: "Reading",
    icon: BookOpen,
    color: "text-blue-500",
  },
  {
    value: "listening",
    label: "Listening",
    icon: Headphones,
    color: "text-purple-500",
  },
  { value: "writing", label: "Writing", icon: PenTool, color: "text-pink-500" },
  {
    value: "speaking",
    label: "Speaking",
    icon: MessageSquare,
    color: "text-orange-500",
  },
] as const;

const PRACTICE_PROMPTS = {
  IELTS: {
    reading: [
      "Read the passage about climate change and answer the following questions...",
      "Identify the main idea of the given scientific article...",
      "Complete the summary using words from the passage...",
    ],
    listening: [
      "Listen to a conversation between two students discussing their project...",
      "You will hear a lecture about ancient civilizations...",
      "Listen to the radio interview and answer the questions...",
    ],
    writing: [
      "Some people believe that technology has made our lives more complicated. Do you agree or disagree?",
      "The chart shows the percentage of households with different types of technology. Summarize the information...",
      "Write a letter to your landlord about a problem in your apartment...",
    ],
    speaking: [
      "Describe a memorable event from your childhood...",
      "What are the advantages and disadvantages of living in a big city?",
      "Talk about a skill you would like to learn in the future...",
    ],
  },
  TOEFL: {
    reading: [
      "Read the academic passage about photosynthesis and answer the questions...",
      "Identify the author's purpose in the given text...",
      "Fill in the blanks with the correct information from the passage...",
    ],
    listening: [
      "Listen to a campus conversation about course registration...",
      "You will hear a lecture on marine biology...",
      "Listen to the discussion and identify the main points...",
    ],
    writing: [
      "Do you agree or disagree: Students should be required to take classes in many subjects?",
      "Summarize the points made in the lecture and explain how they relate to the reading...",
      "Some people prefer to work independently. Others prefer to work in teams. Which do you prefer?",
    ],
    speaking: [
      "Talk about a place you would like to visit and explain why...",
      "Do you prefer studying alone or in a group? Explain your preference...",
      "Describe a person who has influenced you in your life...",
    ],
  },
  GRE: {
    reading: [
      "Read the complex passage about quantum mechanics and answer analytical questions...",
      "Identify logical fallacies in the given argument...",
      "Analyze the author's tone and purpose in this scholarly article...",
    ],
    listening: [
      "Listen to the academic lecture on economic theories...",
      "You will hear a discussion about research methodology...",
      "Listen and take notes on the key points presented...",
    ],
    writing: [
      "Analyze the following argument and discuss how well-reasoned you find it...",
      "Present your perspective on: 'Technology has increased the gap between rich and poor.'",
      "Evaluate the evidence and logic in the provided statement...",
    ],
    speaking: [
      "Discuss the role of government in regulating technology companies...",
      "Explain a complex concept from your field of study...",
      "Present an argument for or against mandatory community service...",
    ],
  },
};

export default function PracticePage() {
  const [selectedExam, setSelectedExam] = useState<
    "IELTS" | "TOEFL" | "GRE" | ""
  >("");
  const [selectedSkill, setSelectedSkill] = useState<
    "reading" | "listening" | "writing" | "speaking" | ""
  >("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [yourAnswer, setYourAnswer] = useState("");
  const [feedbackOrNotes, setFeedbackOrNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: practices, isLoading: loadingPractices } =
    useGetPracticesQuery();
  const [createPractice, { isLoading: submitting }] =
    useCreatePracticeMutation();

  const getRandomPrompt = () => {
    if (!selectedExam || !selectedSkill) return "";
    const prompts = PRACTICE_PROMPTS[selectedExam][selectedSkill];
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const handleGeneratePrompt = () => {
    if (selectedExam && selectedSkill) {
      setCustomPrompt(getRandomPrompt());
    }
  };

  const handleSubmit = async () => {
    if (!selectedExam || !selectedSkill || !customPrompt) return;

    try {
      await createPractice({
        exam: selectedExam,
        skill: selectedSkill,
        prompt: customPrompt,
        yourAnswer: yourAnswer || undefined,
        feedbackOrNotes: feedbackOrNotes || undefined,
      }).unwrap();

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setCustomPrompt("");
        setYourAnswer("");
        setFeedbackOrNotes("");
      }, 2000);
    } catch (error) {
      console.error("Failed to save practice:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <FadeIn>
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-3 bg-linear-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Practice Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Master your English skills with structured practice sessions
          </p>
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Practice Form */}
        <FadeIn>
          <Card className="glass-card border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                New Practice Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exam Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Select Exam</label>
                <div className="grid grid-cols-3 gap-2">
                  {EXAMS.map((exam) => (
                    <Button
                      key={exam.value}
                      variant={
                        selectedExam === exam.value ? "default" : "outline"
                      }
                      onClick={() => setSelectedExam(exam.value)}
                      className={`${
                        selectedExam === exam.value
                          ? `bg-linear-to-r ${exam.color}`
                          : ""
                      }`}
                    >
                      {exam.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Skill Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Select Skill</label>
                <div className="grid grid-cols-2 gap-2">
                  {SKILLS.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <Button
                        key={skill.value}
                        variant={
                          selectedSkill === skill.value ? "default" : "outline"
                        }
                        onClick={() => setSelectedSkill(skill.value)}
                        className="justify-start"
                      >
                        <Icon
                          className={`h-4 w-4 mr-2 ${
                            selectedSkill === skill.value ? "" : skill.color
                          }`}
                        />
                        {skill.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Prompt Button */}
              <Button
                onClick={handleGeneratePrompt}
                disabled={!selectedExam || !selectedSkill}
                className="w-full bg-linear-to-r from-violet-500 to-purple-500"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Practice Prompt
              </Button>

              {/* Custom Prompt */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Practice Prompt</label>
                <Textarea
                  placeholder="Generate or enter your practice prompt..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Your Answer */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Your Answer (Optional)
                </label>
                <Textarea
                  placeholder="Write your answer or notes here..."
                  value={yourAnswer}
                  onChange={(e) => setYourAnswer(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Feedback / Notes (Optional)
                </label>
                <Textarea
                  placeholder="Add feedback, notes, or areas for improvement..."
                  value={feedbackOrNotes}
                  onChange={(e) => setFeedbackOrNotes(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={
                  !selectedExam || !selectedSkill || !customPrompt || submitting
                }
                className="w-full bg-linear-to-r from-pink-500 to-purple-500 shadow-lg"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Saved Successfully!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Save Practice Session
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Recent Practices */}
        <div className="space-y-4">
          <FadeIn>
            <Card className="glass-card border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-violet-500" />
                  Recent Practice Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingPractices ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !practices || practices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No practice sessions yet</p>
                    <p className="text-xs mt-1">
                      Start your first practice above!
                    </p>
                  </div>
                ) : (
                  <StaggerContainer className="space-y-3 max-h-[600px] overflow-y-auto">
                    {practices.slice(0, 10).map((practice) => {
                      const skill = SKILLS.find(
                        (s) => s.value === practice.skill
                      );
                      const Icon = skill?.icon || BookOpen;
                      const examColor =
                        EXAMS.find((e) => e.value === practice.exam)?.color ||
                        "from-gray-500 to-gray-600";

                      return (
                        <StaggerItem key={practice._id}>
                          <Card className="border hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <Icon
                                    className={`h-4 w-4 ${skill?.color || ""}`}
                                  />
                                  <Badge
                                    className={`bg-linear-to-r ${examColor} text-white border-0`}
                                  >
                                    {practice.exam}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {practice.skill}
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    practice.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm line-clamp-2 text-foreground/80">
                                {practice.prompt}
                              </p>
                              {practice.yourAnswer && (
                                <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                                  <span className="font-semibold">Answer:</span>{" "}
                                  {practice.yourAnswer}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Stats Card */}
          <FadeIn>
            <Card className="glass-card border-2 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Practice Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-violet-500">
                      {practices?.length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Sessions
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-500">
                      {practices?.filter((p) => p.yourAnswer).length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
