import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useGradesStore } from "../stores/grades-store";
import { fetchSemestersAndExams, fetchGradesData } from "../utils/grades";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function Grades() {
  const { payloadData } = useAuth();
  const { selectedSemester, setSelectedSemester } = useGradesStore();

  // Fetch available semesters and exams
  const { data: semesterData, isLoading: semestersLoading } = useQuery({
    queryKey: ["semesters-exams", payloadData?.hdnStudentId],
    queryFn: () => {
      if (!payloadData) {
        throw new Error("Not authenticated");
      }
      console.log("Fetching semesters and exams with payload:", payloadData);
      return fetchSemestersAndExams(payloadData);
    },
    enabled: !!payloadData,
  });

  // Fetch grades for selected semester
  const {
    data: gradesRecords,
    isLoading: gradesLoading,
    error: gradesError,
  } = useQuery({
    queryKey: ["grades", payloadData?.hdnStudentId, selectedSemester],
    queryFn: () => {
      if (!payloadData || !selectedSemester) {
        throw new Error("Not authenticated or semester not selected");
      }
      console.log("Fetching grades with payload:", payloadData);
      // Use updated payload from semesterData if available
      const payload = semesterData?.updatedPayload || payloadData;
      return fetchGradesData(payload, selectedSemester);
    },
    enabled: !!payloadData && !!selectedSemester && !!semesterData,
  });

  return (
    <div className="px-3 pb-8 pt-2">
      {!payloadData && (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-muted-foreground">Please log in to view your grades.</p>
        </div>
      )}

      {payloadData && (
        <div className="space-y-4">
          <div className="space-y-2">
            {semestersLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesterData?.semesters.map((semester) => (
                    <SelectItem key={semester.value} value={semester.value}>
                      {semester.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedSemester && (
            <>
              {gradesLoading && (
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

              {gradesError && (
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-destructive">Failed to load grades data. Please try again.</p>
                </div>
              )}

              {gradesRecords && gradesRecords.length > 0 && (
                <div className="space-y-4">
                  {gradesRecords.map((record, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base flex flex-col gap-1">
                          <span className="text-muted-foreground text-xs">{record.subjectCode}</span>
                          <span>{record.subject}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {record.s1 && record.s1.trim() !== "" && (
                            <>
                              <div className="text-muted-foreground">Sessional 1:</div>
                              <div className="font-medium">{record.s1}</div>
                            </>
                          )}

                          {record.st2 && record.st2.trim() !== "" && (
                            <>
                              <div className="text-muted-foreground">ST2:</div>
                              <div className="font-medium">{record.st2}</div>
                            </>
                          )}

                          {record.put && record.put.trim() !== "" && (
                            <>
                              <div className="text-muted-foreground">PUT:</div>
                              <div className="font-semibold text-primary">{record.put}</div>
                            </>
                          )}

                          {record.ta && record.ta.trim() !== "" && (
                            <>
                              <div className="text-muted-foreground">Teacher Asst:</div>
                              <div className="font-medium">{record.ta}</div>
                            </>
                          )}

                          {record.mt1 && record.mt1.trim() !== "" && (
                            <>
                              <div className="text-muted-foreground">MT1:</div>
                              <div className="font-medium">{record.mt1}</div>
                            </>
                          )}

                          {record.st1 && record.st1.trim() !== "" && (
                            <>
                              <div className="text-muted-foreground">ST1:</div>
                              <div className="font-medium">{record.st1}</div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {gradesRecords && gradesRecords.length === 0 && !gradesLoading && (
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-muted-foreground">No grade records found for the selected semester.</p>
                </div>
              )}
            </>
          )}

          {!selectedSemester && !semestersLoading && (
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <p className="text-muted-foreground">Please select a semester to view grades.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
