"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Palette, Globe, Volume2, CreditCard } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [voice, setVoice] = useState("default");

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Manage your preferences and account
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-[var(--muted)] flex items-center justify-center text-2xl font-bold">
                  D
                </div>
                <div>
                  <h3 className="font-medium">Demo User</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    demo@example.com
                  </p>
                </div>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </CardContent>
          </Card>

          {/* Language Preference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-5" />
                Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 rounded-md border border-[var(--border)] bg-[var(--background)]"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                Default language for video generation and UI
              </p>
            </CardContent>
          </Card>

          {/* Voice Preference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="size-5" />
                Voice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full p-2 rounded-md border border-[var(--border)] bg-[var(--background)]"
              >
                <option value="default">Default Voice</option>
                <option value="female-1">Female Voice 1</option>
                <option value="male-1">Male Voice 1</option>
                <option value="professional">Professional</option>
              </select>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                Voice used for video narration
              </p>
            </CardContent>
          </Card>

          {/* Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="size-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-4 py-2 rounded-md border ${
                    theme === "dark"
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--border)]"
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTheme("light")}
                  className={`px-4 py-2 rounded-md border ${
                    theme === "light"
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--border)]"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`px-4 py-2 rounded-md border ${
                    theme === "system"
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--border)]"
                  }`}
                >
                  System
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Credits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">100</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Available credits
                  </p>
                </div>
                <Button>Get More Credits</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
