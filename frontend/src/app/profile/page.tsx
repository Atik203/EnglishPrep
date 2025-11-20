"use client";

import { FadeIn } from "@/components/ui/animations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateUserMutation } from "@/redux/features/auth/authApi";
import { useAppSelector } from "@/redux/hooks";
import { Calendar, CheckCircle2, Mail, Save, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user) {
      setFormData({
        name: user.name,
        avatar: user.avatar || "",
      });
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData).unwrap();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <FadeIn>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground text-lg">
            Manage your account information
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <FadeIn delay={0.1}>
          <Card className="border-2 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32 border-4 border-primary/10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-linear-to-br from-blue-600 to-purple-600 text-white text-3xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </p>
                </div>
                <div className="w-full pt-4 border-t">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {joinDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Edit Form */}
        <FadeIn delay={0.2}>
          <Card className="border-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="border-2 bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                  <Input
                    id="avatar"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatar}
                    onChange={(e) =>
                      setFormData({ ...formData, avatar: e.target.value })
                    }
                    className="border-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a link to your profile picture
                  </p>
                </div>

                {isSuccess && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border-2 border-green-200 dark:border-green-900">
                    <CheckCircle2 className="h-4 w-4" />
                    Profile updated successfully!
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Account Info */}
      <FadeIn delay={0.3}>
        <Card className="border-2 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">🔐 Account Security</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                • Your account is secured with{" "}
                {user.googleId ? "Google OAuth" : "email and password"}
              </p>
              <p>• Two-factor authentication coming soon</p>
              <p>• Password reset feature coming soon</p>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
