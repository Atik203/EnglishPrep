"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetVocabularyQuery } from "@/redux/features/vocabulary/vocabularyApi";
import { BookMarked, ChevronRight, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface VocabularyWord {
  _id: string;
  word: string;
  meaning: string;
  meaningBn?: string;
  partOfSpeech?: string;
  phonetic?: string;
  phoneticAudio?: string;
  exampleSentence?: string;
  synonyms: string[];
  antonyms: string[];
  examTags: string[];
  difficulty: string;
  status: string;
}

const ITEMS_PER_PAGE = 20;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function WordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [exam] = useState<string>("");
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: words, isLoading } = useGetVocabularyQuery({
    search: searchTerm || undefined,
    difficulty: (difficulty as "easy" | "medium" | "hard") || undefined,
    status: (status as "new" | "learning" | "learned") || undefined,
    exam: (exam as "IELTS" | "TOEFL" | "GRE") || undefined,
  });

  // Filter words by letter and apply pagination
  const filteredWords = useMemo(() => {
    if (!words || words.length === 0) return [];

    let filtered = [...words];

    // Apply letter filter
    if (selectedLetter) {
      filtered = filtered.filter(
        (word) => word.word.charAt(0).toUpperCase() === selectedLetter
      );
    }

    // Sort alphabetically
    filtered.sort((a, b) => a.word.localeCompare(b.word));

    return filtered;
  }, [words, selectedLetter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedWords = filteredWords.slice(startIndex, endIndex);

  // Get letter stats for filter buttons
  const letterStats = useMemo(() => {
    if (!words || words.length === 0) return {};
    const stats: Record<string, number> = {};
    words.forEach((word: VocabularyWord) => {
      const letter = word.word.charAt(0).toUpperCase();
      stats[letter] = (stats[letter] || 0) + 1;
    });
    return stats;
  }, [words]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedLetter, searchTerm, difficulty, status]);

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "hard":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (stat: string) => {
    switch (stat) {
      case "new":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "learning":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "learned":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold mb-3 bg-linear-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          My Vocabulary
        </h1>
        <p className="text-muted-foreground text-lg">
          Browse and explore your growing vocabulary collection (
          {filteredWords.length} words)
        </p>
      </div>

      {/* Filters */}
      <Card className="glass-card mb-8 border-2 shadow-xl">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search words..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-12 text-lg"
                />
              </div>
            </div>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="h-12">
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
              <SelectTrigger className="h-12">
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

      {/* Letter Filter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter by Letter
          </h2>
          {selectedLetter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLetter(null)}
              className="text-sm"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filter
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {ALPHABET.map((letter) => {
            const count = letterStats[letter] || 0;
            const isActive = selectedLetter === letter;

            return (
              <Button
                key={letter}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLetter(letter)}
                disabled={count === 0}
                className={`relative ${isActive ? "shadow-lg" : ""} ${
                  count === 0 ? "opacity-30" : ""
                }`}
              >
                {letter}
                {count > 0 && (
                  <span className="ml-1 text-xs opacity-70">({count})</span>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Words Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredWords.length === 0 ? (
        <Card className="glass-card border-2 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookMarked className="h-16 w-16 text-muted-foreground mb-6 animate-pulse" />
            <h3 className="text-2xl font-semibold mb-3">No words found</h3>
            <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
              {searchTerm || difficulty || status || exam || selectedLetter
                ? "Try adjusting your filters to see more results"
                : "Start building your vocabulary by adding your first word"}
            </p>
            <Link href="/add-word">
              <Button size="lg" className="shadow-lg">
                Add Your First Word
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Compact Words Grid */}
          <FadeIn>
            <StaggerContainer className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedWords.map((word: VocabularyWord, index) => (
                <StaggerItem key={word._id} index={index}>
                  <Link href={`/words/${word._id}`}>
                    <Card className="glass-card cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border h-full group">
                      <CardContent className="p-4">
                        {/* Compact Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold truncate group-hover:text-violet-500 transition-colors">
                              {word.word}
                            </h3>
                            {word.phonetic && (
                              <p className="text-xs text-muted-foreground font-mono truncate">
                                {word.phonetic}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-500 transition-colors shrink-0" />
                        </div>

                        {/* Meaning - Compact */}
                        <p className="text-sm text-foreground/80 line-clamp-2 mb-2">
                          {word.meaning}
                        </p>

                        {/* Badges Row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {word.partOfSpeech && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5 px-1.5"
                            >
                              {word.partOfSpeech}
                            </Badge>
                          )}
                          <Badge
                            className={`${getDifficultyColor(
                              word.difficulty
                            )} border text-[10px] h-5 px-1.5`}
                          >
                            {word.difficulty}
                          </Badge>
                          <Badge
                            className={`${getStatusColor(
                              word.status
                            )} border text-[10px] h-5 px-1.5`}
                          >
                            {word.status}
                          </Badge>
                          {word.examTags && word.examTags.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-5 px-1.5"
                            >
                              {word.examTags[0]}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeIn>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-9"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Results Info */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredWords.length)}{" "}
            of {filteredWords.length} words
          </div>
        </>
      )}
    </div>
  );
}
