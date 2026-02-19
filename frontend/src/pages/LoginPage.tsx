import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Loader2, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkipLink } from "@/components/common/SkipLink";
import { UserCombobox } from "@/components/auth/UserCombobox";
import { UserPreviewCard } from "@/components/auth/UserPreviewCard";
import { useAuthStore } from "@/stores/authStore";
import { getUsers, login } from "@/api/authApi";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";

export function LoginPage() {
  const [selected, setSelected] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const authLogin = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const handleLogin = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const res = await login(selected.email);
      authLogin(
        { displayName: res.display_name, email: res.email, policyType: res.policy_type, customerId: res.customer_id, age: selected.age },
        res.session_id,
        res.customer_id
      );
      navigate("/chat");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50/50 via-background to-violet-50/50 dark:from-indigo-950/20 dark:to-violet-950/20 p-4">
      <SkipLink />
      <main id="main-content" className="w-full max-w-md">
        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-2xl">Welcome to InsureAI</CardTitle>
            <CardDescription>Select your profile to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                <span className="ml-2 text-sm text-muted-foreground">Loading users...</span>
              </div>
            ) : (
              <UserCombobox users={users} selected={selected} onSelect={setSelected} />
            )}

            {selected && <UserPreviewCard user={selected} />}

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}

            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-md h-11"
              onClick={handleLogin}
              disabled={!selected || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Continue"
              )}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Demo mode — select any profile to explore</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
