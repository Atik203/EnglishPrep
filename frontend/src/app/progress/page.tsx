"use client";

import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetVocabularyQuery } from "@/redux/features/vocabulary/vocabularyApi";
import { useAppSelector } from "@/redux/hooks";
import {
  BookMarked,
  Brain,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function ProgressPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const { data: vocabData } = useGetVocabularyQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Filter learned words
  const learnedWords = useMemo(() => {
    return vocabData?.filter((word) => word.status === "learned") || [];
  }, [vocabData]);

  const totalWords = vocabData?.length || 0;
  const learnedCount = learnedWords.length;
  const learningProgress =
    totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;

  const daysActive = Math.floor(
    (new Date().getTime() - new Date(user.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const wordsPerDay =
    daysActive > 0 ? (totalWords / daysActive).toFixed(1) : "0";

  const stats = [
    {
      title: "Total Words",
      value: totalWords,
      icon: BookMarked,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Learned Words",
      value: learnedCount,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Progress",
      value: `${learningProgress}%`,
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: "Words/Day",
      value: wordsPerDay,
      icon: Target,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
  ];

  const achievements = [
    {
      title: "First Word",
      description: "Added your first vocabulary word",
      completed: totalWords > 0,
    },
    {
      title: "Quick Learner",
      description: "Added 10 words in one day",
      completed: false,
    },
    {
      title: "Vocabulary Master",
      description: "Reached 100 words",
      completed: totalWords >= 100,
    },
    {
      title: "Consistent Learner",
      description: "7-day learning streak",
      completed: false,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <FadeIn>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Your Learning Progress</h1>
          <p className="text-muted-foreground text-lg">
            Track your vocabulary journey and achievements
          </p>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={index}>
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerContainer>

      {/* Progress Chart Section */}
      <FadeIn delay={0.2}>
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Learning Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <TrendingUp className="h-12 w-12 mx-auto opacity-50" />
                <p>Activity chart coming soon</p>
                <p className="text-sm">Keep learning to see your progress!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Achievements */}
      <FadeIn delay={0.3}>
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                    achievement.completed
                      ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                      : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/30"
                  }`}
                >
                  <div
                    className={`mt-1 ${
                      achievement.completed ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <CheckCircle2
                      className={`h-6 w-6 ${
                        achievement.completed ? "fill-current" : ""
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Learned Words List */}
      <FadeIn delay={0.4}>
        <Card className="border-2 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              Learned Words ({learnedCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {learnedCount === 0 ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="h-16 w-16 mx-auto opacity-20" />
                <p className="text-muted-foreground text-lg font-medium">
                  No words learned yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Start marking words as learned to track your progress!
                </p>
              </div>
            ) : (
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {learnedWords.map((word, index) => (
                    <StaggerItem key={word._id}>
                      <Link href={`/words/${word._id}`}>
                        <Card className="group cursor-pointer border-2 hover:border-green-500 hover:shadow-lg transition-all duration-300 bg-linear-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950/30">
                          <CardContent className="p-4 space-y-3">
                            {/* Word Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                  {word.word}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {word.meaning}
                                </p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-green-500 group-hover:translate-x-1 transition-transform" />
                            </div>

                            {/* Bengali Meaning */}
                            {word.meaningBn && (
                              <div className="pt-2 border-t">
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-bengali line-clamp-1">
                                  {word.meaningBn}
                                </p>
                              </div>
                            )}

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  word.difficulty === "easy"
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                    : word.difficulty === "medium"
                                    ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                    : "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                }
                              >
                                {word.difficulty}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300"
                              >
                                ✓ Learned
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Learning Tips */}
      <FadeIn delay={0.5}>
        <Card className="border-2 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">💡 Learning Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Try to learn at least 5 new words every day</li>
              <li>• Review your vocabulary regularly to improve retention</li>
              <li>• Use the words in sentences to remember them better</li>
              <li>• Practice pronunciation using the audio feature</li>
            </ul>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
