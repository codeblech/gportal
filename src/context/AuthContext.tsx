import { createContext, useContext, ReactNode, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/config/api";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string, captcha: string) => Promise<void>;
  logout: () => Promise<void>;
  payloadData: PayloadData | null;
}

interface PayloadData {
  __VIEWSTATE: string;
  __VIEWSTATEGENERATOR: string;
  __EVENTVALIDATION: string;
  hdnStudentId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem("isAuthenticated");
    return saved === "true";
  });
  const [payloadData, setPayloadData] = useState<PayloadData | null>(() => {
    const saved = localStorage.getItem("payloadData");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username: string, password: string, captcha: string) => {
    try {
      console.log("Starting login process...");

      // Clear all cached data before login
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();

      // First, get the login page to extract payload data
      console.log("Fetching login page...");
      const loginPageResponse = await fetch(getApiUrl("/Login"));
      console.log("Login page response status:", loginPageResponse.status);
      const loginHtml = await loginPageResponse.text();
      const parser = new DOMParser();
      const loginDoc = parser.parseFromString(loginHtml, "text/html");

      // Extract payload variables from login page
      const viewstate = loginDoc.querySelector('input[name="__VIEWSTATE"]')?.getAttribute("value") || "";
      const viewstateGenerator =
        loginDoc.querySelector('input[name="__VIEWSTATEGENERATOR"]')?.getAttribute("value") || "";
      const eventValidation = loginDoc.querySelector('input[name="__EVENTVALIDATION"]')?.getAttribute("value") || "";
      const captchaDiv = loginDoc.querySelector("#pnlInfo1");
      const captchaPayloadKey = captchaDiv?.querySelector("input")?.getAttribute("name") || "";

      console.log("Extracted payload keys:", {
        viewstate: viewstate.substring(0, 20) + "...",
        viewstateGenerator,
        eventValidation: eventValidation.substring(0, 20) + "...",
        captchaPayloadKey,
      });

      // Prepare login payload
      const formData = new URLSearchParams();
      formData.append("__LASTFOCUS", "");
      formData.append("__EVENTTARGET", "");
      formData.append("__EVENTARGUMENT", "");
      formData.append("__VIEWSTATE", viewstate);
      formData.append("__VIEWSTATEGENERATOR", viewstateGenerator);
      formData.append("__EVENTVALIDATION", eventValidation);
      formData.append("selector", "rdoStdudent");
      formData.append("__txtUserId100", username);
      formData.append("txtPass", password);
      formData.append(captchaPayloadKey, captcha);
      formData.append("btnLogin_", "LOGIN");
      formData.append("zx1234", username);
      formData.append("hidsetname", "ok");
      formData.append("hdnShowInstruction", "0");
      formData.append("txtUserName", "");
      formData.append("txtdateofBirth", "");

      console.log("Sending login POST request...");
      console.log("Login form data:", formData.toString().substring(0, 200) + "...");

      // Perform login
      const loginResponse = await fetch(getApiUrl("/Login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        credentials: "include",
      });

      console.log("Login response status:", loginResponse.status);
      console.log("Login response headers:", Object.fromEntries(loginResponse.headers.entries()));

      if (!loginResponse.ok) {
        throw new Error("Login failed");
      }

      // After successful login, fetch the attendance page to get payload data
      const attendancePageResponse = await fetch(getApiUrl("/Student/TodayAttendence"), {
        credentials: "include",
      });

      const attendanceHtml = await attendancePageResponse.text();
      const attendanceDoc = parser.parseFromString(attendanceHtml, "text/html");

      // Extract payload data for future requests
      const payload: PayloadData = {
        __VIEWSTATE: attendanceDoc.querySelector('input[name="__VIEWSTATE"]')?.getAttribute("value") || "",
        __VIEWSTATEGENERATOR:
          attendanceDoc.querySelector('input[name="__VIEWSTATEGENERATOR"]')?.getAttribute("value") || "",
        __EVENTVALIDATION: attendanceDoc.querySelector('input[name="__EVENTVALIDATION"]')?.getAttribute("value") || "",
        hdnStudentId:
          attendanceDoc.querySelector('input[name="ctl00$ctl00$MCPH1$SCPH$hdnStudentId"]')?.getAttribute("value") || "",
      };

      setPayloadData(payload);
      setIsAuthenticated(true);

      // Persist to localStorage
      localStorage.setItem("payloadData", JSON.stringify(payload));
      localStorage.setItem("isAuthenticated", "true");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // First, fetch the home page to get the current payload data needed for logout
      const homePageResponse = await fetch(getApiUrl("/Home"), {
        credentials: "include",
      });
      const homeHtml = await homePageResponse.text();
      const parser = new DOMParser();
      const homeDoc = parser.parseFromString(homeHtml, "text/html");

      // Extract payload variables
      const viewstate = homeDoc.querySelector('input[name="__VIEWSTATE"]')?.getAttribute("value") || "";
      const viewstateGenerator =
        homeDoc.querySelector('input[name="__VIEWSTATEGENERATOR"]')?.getAttribute("value") || "";
      const eventValidation = homeDoc.querySelector('input[name="__EVENTVALIDATION"]')?.getAttribute("value") || "";

      // Extract all the hidden fields needed for logout
      const hdncollegenewsalerts =
        homeDoc.querySelector('input[name="ctl00$hdncollegenewsalerts"]')?.getAttribute("value") || "";
      const hdnsystemalerts = homeDoc.querySelector('input[name="ctl00$hdnsystemalerts"]')?.getAttribute("value") || "";
      const hdnattendancealerts =
        homeDoc.querySelector('input[name="ctl00$hdnattendancealerts"]')?.getAttribute("value") || "";
      const hdnlibraryalerts =
        homeDoc.querySelector('input[name="ctl00$hdnlibraryalerts"]')?.getAttribute("value") || "";
      const hdnCollege = homeDoc.querySelector('input[name="ctl00$hdnCollege"]')?.getAttribute("value") || "";
      const hdnForSchoolMaster =
        homeDoc.querySelector('input[name="ctl00$hdnForSchoolMaster"]')?.getAttribute("value") || "";
      const txtCaseCSS = homeDoc.querySelector('input[name="ctl00$txtCaseCSS"]')?.getAttribute("value") || "";

      // Prepare logout payload
      const formData = new URLSearchParams();
      formData.append("__EVENTTARGET", "ctl00$btnLogOut");
      formData.append("__EVENTARGUMENT", "");
      formData.append("__VIEWSTATE", viewstate);
      formData.append("__VIEWSTATEGENERATOR", viewstateGenerator);
      formData.append("__EVENTVALIDATION", eventValidation);
      formData.append("ctl00$hdncollegenewsalerts", hdncollegenewsalerts);
      formData.append("ctl00$hdnsystemalerts", hdnsystemalerts);
      formData.append("ctl00$hdnattendancealerts", hdnattendancealerts);
      formData.append("ctl00$hdnlibraryalerts", hdnlibraryalerts);
      formData.append("ctl00$hdnCollege", hdnCollege);
      formData.append("ctl00$hdnForSchoolMaster", hdnForSchoolMaster);
      formData.append("ctl00$txtCaseCSS", txtCaseCSS);

      // POST to home which will trigger logout and cookie clearing
      const logoutResponse = await fetch(getApiUrl("/Home"), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        credentials: "include",
        redirect: "manual", // Don't follow the redirect to Login
      });

      console.log("Logout response status:", logoutResponse.status);
      console.log("Logout response headers:", Object.fromEntries(logoutResponse.headers.entries()));

      // Follow the redirect to complete the logout process
      if (logoutResponse.status === 302 || logoutResponse.status === 303) {
        const redirectUrl = logoutResponse.headers.get("Location");
        if (redirectUrl) {
          await fetch(getApiUrl(redirectUrl), {
            credentials: "include",
          });
        }
      }
    } catch (error) {
      console.error("Server logout failed:", error);
    }

    // Clear all cookies that JavaScript can access
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      // Clear cookie for all possible paths and domains
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
    });

    // Clear all cached query data
    queryClient.clear();

    // Clear client-side state regardless of server response
    setIsAuthenticated(false);
    setPayloadData(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, payloadData }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
