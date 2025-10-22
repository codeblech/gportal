import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { fetchProfileData, fetchOfficialDetailsData, fetchQualificationData } from "../utils/profile";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";

export default function Profile() {
  const { payloadData } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");

  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile", payloadData?.hdnStudentId],
    queryFn: () => {
      if (!payloadData) {
        throw new Error("Not authenticated");
      }
      console.log("Fetching profile with payload:", payloadData);
      return fetchProfileData(payloadData);
    },
    enabled: !!payloadData && activeTab === "personal",
  });

  const {
    data: officialData,
    isLoading: officialLoading,
    error: officialError,
  } = useQuery({
    queryKey: ["official-details", payloadData?.hdnStudentId],
    queryFn: () => {
      if (!payloadData) {
        throw new Error("Not authenticated");
      }
      console.log("Fetching official details with payload:", payloadData);
      return fetchOfficialDetailsData(payloadData);
    },
    enabled: !!payloadData && activeTab === "official",
  });

  const {
    data: qualificationData,
    isLoading: qualificationLoading,
    error: qualificationError,
  } = useQuery({
    queryKey: ["qualification", payloadData?.hdnStudentId],
    queryFn: () => {
      if (!payloadData) {
        throw new Error("Not authenticated");
      }
      console.log("Fetching qualification with payload:", payloadData);
      return fetchQualificationData(payloadData);
    },
    enabled: !!payloadData && activeTab === "academic",
  });

  if (!payloadData) {
    return (
      <div className="px-3 py-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 pb-8 pt-2">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-background gap-3 mb-4">
          <TabsTrigger
            value="personal"
            className="cursor-pointer text-muted-foreground bg-background data-[state=active]:bg-muted data-[state=active]:text-foreground"
          >
            Personal
          </TabsTrigger>
          <TabsTrigger
            value="official"
            className="cursor-pointer text-muted-foreground bg-background data-[state=active]:bg-muted data-[state=active]:text-foreground"
          >
            Official
          </TabsTrigger>
          <TabsTrigger
            value="academic"
            className="cursor-pointer text-muted-foreground bg-background data-[state=active]:bg-muted data-[state=active]:text-foreground"
          >
            Academic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          {profileLoading && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          )}

          {profileError && (
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <p className="text-destructive">Failed to load profile data. Please try again.</p>
            </div>
          )}

          {profileData && (
            <div className="space-y-4">
              {/* Profile Photo and Basic Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold">{profileData.name}</h2>
                      <p className="text-muted-foreground">{profileData.admissionNo}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                    {profileData.admissionNo && (
                      <>
                        <div className="text-muted-foreground font-medium">Admission No:</div>
                        <div>{profileData.admissionNo}</div>
                      </>
                    )}
                    {profileData.regFormNo && (
                      <>
                        <div className="text-muted-foreground font-medium">Reg. Form No:</div>
                        <div>{profileData.regFormNo}</div>
                      </>
                    )}
                    {profileData.name && (
                      <>
                        <div className="text-muted-foreground font-medium">Name:</div>
                        <div>{profileData.name}</div>
                      </>
                    )}
                    {profileData.gender && (
                      <>
                        <div className="text-muted-foreground font-medium">Gender:</div>
                        <div>{profileData.gender}</div>
                      </>
                    )}
                    {profileData.bloodGroup && (
                      <>
                        <div className="text-muted-foreground font-medium">Blood Group:</div>
                        <div>{profileData.bloodGroup}</div>
                      </>
                    )}
                    {profileData.dob && (
                      <>
                        <div className="text-muted-foreground font-medium">Date of Birth:</div>
                        <div>{profileData.dob}</div>
                      </>
                    )}
                    {profileData.email && (
                      <>
                        <div className="text-muted-foreground font-medium">Email:</div>
                        <div>{profileData.email}</div>
                      </>
                    )}
                    {profileData.phone && (
                      <>
                        <div className="text-muted-foreground font-medium">Phone:</div>
                        <div>{profileData.phone}</div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Present Address */}
              {(profileData.presentAddress || profileData.city || profileData.state || profileData.pinCode) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Present Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                      {profileData.presentAddress && (
                        <>
                          <div className="text-muted-foreground font-medium">Address:</div>
                          <div>{profileData.presentAddress}</div>
                        </>
                      )}
                      {profileData.city && (
                        <>
                          <div className="text-muted-foreground font-medium">City:</div>
                          <div>{profileData.city}</div>
                        </>
                      )}
                      {profileData.state && (
                        <>
                          <div className="text-muted-foreground font-medium">State:</div>
                          <div>{profileData.state}</div>
                        </>
                      )}
                      {profileData.pinCode && (
                        <>
                          <div className="text-muted-foreground font-medium">Pin Code:</div>
                          <div>{profileData.pinCode}</div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Local Guardian Information */}
              {(profileData.localGuardianName ||
                profileData.localGuardianAddress ||
                profileData.localGuardianPhone) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Local Guardian Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                      {profileData.localGuardianName && (
                        <>
                          <div className="text-muted-foreground font-medium">Name:</div>
                          <div>{profileData.localGuardianName}</div>
                        </>
                      )}
                      {profileData.localGuardianAddress && (
                        <>
                          <div className="text-muted-foreground font-medium">Address:</div>
                          <div>{profileData.localGuardianAddress}</div>
                        </>
                      )}
                      {profileData.localGuardianPhone && (
                        <>
                          <div className="text-muted-foreground font-medium">Phone:</div>
                          <div>{profileData.localGuardianPhone}</div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Father's Information */}
              {(profileData.fatherName || profileData.fatherMobile || profileData.fatherEmail) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Father's Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                      {profileData.fatherName && (
                        <>
                          <div className="text-muted-foreground font-medium">Name:</div>
                          <div>{profileData.fatherName}</div>
                        </>
                      )}
                      {profileData.fatherMobile && (
                        <>
                          <div className="text-muted-foreground font-medium">Mobile:</div>
                          <div>{profileData.fatherMobile}</div>
                        </>
                      )}
                      {profileData.fatherEmail && (
                        <>
                          <div className="text-muted-foreground font-medium">Email:</div>
                          <div>{profileData.fatherEmail}</div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mother's Information */}
              {(profileData.motherName || profileData.motherMobile || profileData.motherEmail) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mother's Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                      {profileData.motherName && (
                        <>
                          <div className="text-muted-foreground font-medium">Name:</div>
                          <div>{profileData.motherName}</div>
                        </>
                      )}
                      {profileData.motherMobile && (
                        <>
                          <div className="text-muted-foreground font-medium">Mobile:</div>
                          <div>{profileData.motherMobile}</div>
                        </>
                      )}
                      {profileData.motherEmail && (
                        <>
                          <div className="text-muted-foreground font-medium">Email:</div>
                          <div>{profileData.motherEmail}</div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Guardian Additional Information */}
              {(profileData.occupation ||
                profileData.designation ||
                profileData.annualIncome ||
                profileData.guardianMobile) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Guardian Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                      {profileData.occupation && (
                        <>
                          <div className="text-muted-foreground font-medium">Occupation:</div>
                          <div>{profileData.occupation}</div>
                        </>
                      )}
                      {profileData.designation && (
                        <>
                          <div className="text-muted-foreground font-medium">Designation:</div>
                          <div>{profileData.designation}</div>
                        </>
                      )}
                      {profileData.annualIncome && (
                        <>
                          <div className="text-muted-foreground font-medium">Annual Income:</div>
                          <div>{profileData.annualIncome}</div>
                        </>
                      )}
                      {profileData.guardianMobile && (
                        <>
                          <div className="text-muted-foreground font-medium">Mobile:</div>
                          <div>{profileData.guardianMobile}</div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Permanent Address */}
              {(profileData.permanentAddress ||
                profileData.permanentCity ||
                profileData.permanentState ||
                profileData.permanentPinCode ||
                profileData.permanentPhone) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Permanent Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                      {profileData.permanentAddress && (
                        <>
                          <div className="text-muted-foreground font-medium">Address:</div>
                          <div>{profileData.permanentAddress}</div>
                        </>
                      )}
                      {profileData.permanentCity && (
                        <>
                          <div className="text-muted-foreground font-medium">City:</div>
                          <div>{profileData.permanentCity}</div>
                        </>
                      )}
                      {profileData.permanentState && (
                        <>
                          <div className="text-muted-foreground font-medium">State:</div>
                          <div>{profileData.permanentState}</div>
                        </>
                      )}
                      {profileData.permanentPinCode && (
                        <>
                          <div className="text-muted-foreground font-medium">Pin Code:</div>
                          <div>{profileData.permanentPinCode}</div>
                        </>
                      )}
                      {profileData.permanentPhone && (
                        <>
                          <div className="text-muted-foreground font-medium">Phone:</div>
                          <div>{profileData.permanentPhone}</div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="official">
          {officialLoading && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          )}

          {officialError && (
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <p className="text-destructive">Failed to load official details. Please try again.</p>
            </div>
          )}

          {officialData && (
            <div className="space-y-4">
              {/* Official Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Official Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                    {officialData.admissionNo && (
                      <>
                        <div className="text-muted-foreground font-medium">Admission No:</div>
                        <div>{officialData.admissionNo}</div>
                      </>
                    )}
                    {officialData.accountId && (
                      <>
                        <div className="text-muted-foreground font-medium">Account ID:</div>
                        <div>{officialData.accountId}</div>
                      </>
                    )}
                    {officialData.admissionDate && (
                      <>
                        <div className="text-muted-foreground font-medium">Admission Date:</div>
                        <div>{officialData.admissionDate}</div>
                      </>
                    )}
                    {officialData.status && (
                      <>
                        <div className="text-muted-foreground font-medium">Status:</div>
                        <div className="font-semibold text-primary">{officialData.status}</div>
                      </>
                    )}
                    {officialData.session && (
                      <>
                        <div className="text-muted-foreground font-medium">Session:</div>
                        <div>{officialData.session}</div>
                      </>
                    )}
                    {officialData.program && (
                      <>
                        <div className="text-muted-foreground font-medium">Program:</div>
                        <div>{officialData.program}</div>
                      </>
                    )}
                    {officialData.admSem && (
                      <>
                        <div className="text-muted-foreground font-medium">Admission Sem:</div>
                        <div>{officialData.admSem}</div>
                      </>
                    )}
                    {officialData.currentSem && (
                      <>
                        <div className="text-muted-foreground font-medium">Current Sem:</div>
                        <div>{officialData.currentSem}</div>
                      </>
                    )}
                    {officialData.groupName && (
                      <>
                        <div className="text-muted-foreground font-medium">Group Name:</div>
                        <div>{officialData.groupName}</div>
                      </>
                    )}
                    {officialData.quota && (
                      <>
                        <div className="text-muted-foreground font-medium">Quota:</div>
                        <div>{officialData.quota}</div>
                      </>
                    )}
                    {officialData.hostel && (
                      <>
                        <div className="text-muted-foreground font-medium">Hostel:</div>
                        <div>{officialData.hostel}</div>
                      </>
                    )}
                    {officialData.transport && (
                      <>
                        <div className="text-muted-foreground font-medium">Transport:</div>
                        <div>{officialData.transport}</div>
                      </>
                    )}
                    {officialData.officialMail && (
                      <>
                        <div className="text-muted-foreground font-medium">Official Email:</div>
                        <div>{officialData.officialMail}</div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Registration Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Registration Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                    {officialData.name && (
                      <>
                        <div className="text-muted-foreground font-medium">Name:</div>
                        <div>{officialData.name}</div>
                      </>
                    )}
                    {officialData.category && (
                      <>
                        <div className="text-muted-foreground font-medium">Category:</div>
                        <div>{officialData.category}</div>
                      </>
                    )}
                    {officialData.rollNo && (
                      <>
                        <div className="text-muted-foreground font-medium">Roll No:</div>
                        <div>{officialData.rollNo}</div>
                      </>
                    )}
                    {officialData.enrollmentNo && (
                      <>
                        <div className="text-muted-foreground font-medium">Enrollment No:</div>
                        <div>{officialData.enrollmentNo}</div>
                      </>
                    )}
                    {officialData.regFormNo && (
                      <>
                        <div className="text-muted-foreground font-medium">Reg. Form No:</div>
                        <div>{officialData.regFormNo}</div>
                      </>
                    )}
                    {officialData.serialNo && (
                      <>
                        <div className="text-muted-foreground font-medium">Serial No:</div>
                        <div>{officialData.serialNo}</div>
                      </>
                    )}
                    {officialData.lateralEntry && (
                      <>
                        <div className="text-muted-foreground font-medium">Lateral Entry:</div>
                        <div>{officialData.lateralEntry}</div>
                      </>
                    )}
                    {officialData.xiiPcm && (
                      <>
                        <div className="text-muted-foreground font-medium">XII PCM %:</div>
                        <div>{officialData.xiiPcm}</div>
                      </>
                    )}
                    {officialData.xiiAgg && (
                      <>
                        <div className="text-muted-foreground font-medium">XII AGG %:</div>
                        <div>{officialData.xiiAgg}</div>
                      </>
                    )}
                    {officialData.mess && (
                      <>
                        <div className="text-muted-foreground font-medium">Mess:</div>
                        <div>{officialData.mess}</div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Mentor Details */}
              {(officialData.mentorName ||
                officialData.mentorCode ||
                officialData.mentorMobile ||
                officialData.mentorEmail) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mentor Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                      {officialData.mentorName && (
                        <>
                          <div className="text-muted-foreground font-medium">Mentor Name:</div>
                          <div>{officialData.mentorName}</div>
                        </>
                      )}
                      {officialData.mentorCode && (
                        <>
                          <div className="text-muted-foreground font-medium">Mentor Code:</div>
                          <div>{officialData.mentorCode}</div>
                        </>
                      )}
                      {officialData.mentorMobile && (
                        <>
                          <div className="text-muted-foreground font-medium">Mentor Mobile:</div>
                          <div>{officialData.mentorMobile}</div>
                        </>
                      )}
                      {officialData.mentorEmail && (
                        <>
                          <div className="text-muted-foreground font-medium">Mentor Email:</div>
                          <div>{officialData.mentorEmail}</div>
                        </>
                      )}
                      {officialData.department && (
                        <>
                          <div className="text-muted-foreground font-medium">Department:</div>
                          <div>{officialData.department}</div>
                        </>
                      )}
                      {officialData.mentorDesignation && (
                        <>
                          <div className="text-muted-foreground font-medium">Designation:</div>
                          <div>{officialData.mentorDesignation}</div>
                        </>
                      )}
                      {officialData.cabinNo && (
                        <>
                          <div className="text-muted-foreground font-medium">Cabin No:</div>
                          <div>{officialData.cabinNo}</div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="academic">
          {qualificationLoading && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          )}

          {qualificationError && (
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <p className="text-destructive">Failed to load qualification details. Please try again.</p>
            </div>
          )}

          {qualificationData && (
            <div className="space-y-4">
              {/* Student Info Header */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                    {qualificationData.name && (
                      <>
                        <div className="text-muted-foreground font-medium">Name:</div>
                        <div>{qualificationData.name}</div>
                      </>
                    )}
                    {qualificationData.admissionNo && (
                      <>
                        <div className="text-muted-foreground font-medium">Admission No:</div>
                        <div>{qualificationData.admissionNo}</div>
                      </>
                    )}
                    {qualificationData.admissionDate && (
                      <>
                        <div className="text-muted-foreground font-medium">Admission Date:</div>
                        <div>{qualificationData.admissionDate}</div>
                      </>
                    )}
                    {qualificationData.status && (
                      <>
                        <div className="text-muted-foreground font-medium">Status:</div>
                        <div className="font-semibold text-chart-3">{qualificationData.status}</div>
                      </>
                    )}
                    {qualificationData.session && (
                      <>
                        <div className="text-muted-foreground font-medium">Session:</div>
                        <div>{qualificationData.session}</div>
                      </>
                    )}
                    {qualificationData.program && (
                      <>
                        <div className="text-muted-foreground font-medium">Program:</div>
                        <div>{qualificationData.program}</div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Qualifications */}
              {qualificationData.qualifications && qualificationData.qualifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Qualifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {qualificationData.qualifications.map((qual, index) => (
                        <div key={index} className="pb-4 border-b last:border-b-0 last:pb-0">
                          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                            {qual.qualification && (
                              <>
                                <div className="text-muted-foreground font-medium">Qualification:</div>
                                <div className="font-semibold text-primary">{qual.qualification}</div>
                              </>
                            )}
                            {qual.subject && (
                              <>
                                <div className="text-muted-foreground font-medium">Subject:</div>
                                <div>{qual.subject}</div>
                              </>
                            )}
                            {qual.college && (
                              <>
                                <div className="text-muted-foreground font-medium">School/College:</div>
                                <div>{qual.college}</div>
                              </>
                            )}
                            {qual.board && (
                              <>
                                <div className="text-muted-foreground font-medium">Board:</div>
                                <div>{qual.board}</div>
                              </>
                            )}
                            {qual.medium && (
                              <>
                                <div className="text-muted-foreground font-medium">Medium:</div>
                                <div>{qual.medium}</div>
                              </>
                            )}
                            {qual.yearPassing && (
                              <>
                                <div className="text-muted-foreground font-medium">Year of Passing:</div>
                                <div>{qual.yearPassing}</div>
                              </>
                            )}
                            {qual.percentage && qual.percentage !== "0" && (
                              <>
                                <div className="text-muted-foreground font-medium">Percentage:</div>
                                <div className="font-semibold text-chart-1">{qual.percentage}%</div>
                              </>
                            )}
                            {qual.cgpa && qual.cgpa !== "0" && (
                              <>
                                <div className="text-muted-foreground font-medium">CGPA:</div>
                                <div className="font-semibold text-chart-1">{qual.cgpa}</div>
                              </>
                            )}
                            {qual.grade && (
                              <>
                                <div className="text-muted-foreground font-medium">Grade:</div>
                                <div>{qual.grade}</div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {qualificationData.qualifications && qualificationData.qualifications.length === 0 && (
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-muted-foreground">No qualification records found.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
