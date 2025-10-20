import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import PublicHeader from "../components/PublicHeader";
import { getApiUrl } from "@/config/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [captchaUrl, setCaptchaUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      setLoading(true);
      // Add timestamp to bypass cache
      const response = await fetch(`${getApiUrl("/Login")}?_=${Date.now()}`);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const captchaImg = doc.querySelector("#Image1") as HTMLImageElement;

      if (captchaImg) {
        const captchaSrc = captchaImg.getAttribute("src");
        if (captchaSrc) {
          const fullCaptchaUrl = captchaSrc.startsWith("http") ? captchaSrc : `${getApiUrl("")}/${captchaSrc}`;
          // Add timestamp to captcha URL to prevent caching
          const cacheBustedUrl = fullCaptchaUrl.includes("?")
            ? `${fullCaptchaUrl}&_=${Date.now()}`
            : `${fullCaptchaUrl}?_=${Date.now()}`;
          setCaptchaUrl(cacheBustedUrl);
        }
      }
    } catch (error) {
      console.error("Failed to fetch captcha:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(username, password, captcha);
      navigate("/attendance");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pb-4 py-16">
      {/* Header with theme toggle */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <PublicHeader showStatsButton={false} />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="captcha">Captcha</Label>
              <div className="mb-3 flex min-h-[80px] items-center justify-center rounded-lg bg-muted p-4">
                {loading ? (
                  <span className="text-sm text-muted-foreground">Loading captcha...</span>
                ) : captchaUrl ? (
                  <img src={captchaUrl} alt="Captcha" className="h-auto max-w-full" />
                ) : (
                  <span className="text-sm text-muted-foreground">Failed to load captcha</span>
                )}
              </div>
              <Input
                id="captcha"
                type="text"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                placeholder="Enter captcha"
                required
                disabled={loading || !captchaUrl}
              />
            </div>

            <Button type="submit" className="cursor-pointer w-full" disabled={isSubmitting || loading || !captchaUrl}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
