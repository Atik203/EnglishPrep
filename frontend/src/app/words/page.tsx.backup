"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDeleteVocabularyMutation,
  useGetVocabularyQuery,
} from "@/redux/features/vocabulary/vocabularyApi";
import { BookMarked, Loader2, Search, Trash2, Volume2 } from "lucide-react";
import { useState } from "react";

export default function WordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [exam] = useState<string>("");

  const { data: words, isLoading } = useGetVocabularyQuery({
    search: searchTerm || undefined,
    difficulty: (difficulty as "easy" | "medium" | "hard") || undefined,
    status: (status as "new" | "learning" | "learned") || undefined,
    exam: (exam as "IELTS" | "TOEFL" | "GRE") || undefined,
  });

  const [deleteWord, { isLoading: isDeleting }] = useDeleteVocabularyMutation();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this word?")) {
      await deleteWord(id);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-success/20 text-success-foreground";
      case "medium":
        return "bg-warning/20 text-warning-foreground";
      case "hard":
        return "bg-destructive/20 text-destructive-foreground";
      default:
        return "bg-muted";
    }
  };

  const getStatusColor = (stat: string) => {
    switch (stat) {
      case "new":
        return "bg-primary/20 text-primary-foreground";
      case "learning":
        return "bg-warning/20 text-warning-foreground";
      case "learned":
        return "bg-success/20 text-success-foreground";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">My Vocabulary</h1>
        <p className="text-muted-foreground">
          Browse and manage your vocabulary collection
        </p>
      </div>

      {/* Filters */}
      <Card className="glass-card mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search words..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="learned">Learned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Words Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !words || words.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookMarked className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No words found</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {searchTerm || difficulty || status || exam
                ? "Try adjusting your filters"
                : "Start building your vocabulary by adding words"}
            </p>
            <Button onClick={() => (window.location.href = "/add-word")}>
              Add Your First Word
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <Card key={word._id} className="glass-card card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{word.word}</h3>
                    {word.phonetic && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{word.phonetic}</span>
                        {word.phoneticAudio && (
                          <button
                            onClick={() => playAudio(word.phoneticAudio!)}
                            className="hover:text-foreground transition-colors"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getDifficultyColor(word.difficulty)}>
                      {word.difficulty}
                    </Badge>
                    <Badge className={getStatusColor(word.status)}>
                      {word.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3 space-y-3">
                {word.partOfSpeech && (
                  <Badge variant="outline" className="text-xs">
                    {word.partOfSpeech}
                  </Badge>
                )}
                <p className="text-sm leading-relaxed">{word.meaning}</p>
                {word.meaningBn && (
                  <p className="text-sm text-muted-foreground">
                    {word.meaningBn}
                  </p>
                )}
                {word.exampleSentence && (
                  <p className="text-xs italic text-muted-foreground border-l-2 border-primary pl-3">
                    &ldquo;{word.exampleSentence}&rdquo;
                  </p>
                )}
                {word.synonyms && word.synonyms.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Synonyms:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {word.synonyms.slice(0, 5).map((syn, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {syn}
                        </Badge>
                      ))}
                      {word.synonyms.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{word.synonyms.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-3 border-t border-border/50">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-1">
                    {word.examTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(word._id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
