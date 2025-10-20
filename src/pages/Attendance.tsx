import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchAttendanceData, fetchMonthlyAttendanceData, fetchSubjectWiseAttendanceData, fetchDateWiseAttendanceData, fetchSemesterAttendanceData } from '../utils/attendance';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useThemeStore } from '../stores/theme-store';
import type { DateRange } from 'react-day-picker';

export default function Attendance() {
  const { payloadData } = useAuth();
  const [activeTab, setActiveTab] = useState('today');
  const [subjectTab, setSubjectTab] = useState('subjectwise');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sharedDateRange, setSharedDateRange] = useState<{ from: string; to: string } | null>(null);

  // Subscribe to theme changes to trigger re-render
  const themeState = useThemeStore((state) => state.themeState);

  // Force re-render when theme changes
  const [, setForceUpdate] = useState({});
  useEffect(() => {
    setForceUpdate({});
  }, [themeState]);

  const { data: semesterRecords } = useQuery({
    queryKey: ['attendance-semester', payloadData?.hdnStudentId],
    queryFn: () => {
      if (!payloadData) {
        throw new Error('Not authenticated');
      }
      console.log('Fetching semester attendance with payload:', payloadData);
      return fetchSemesterAttendanceData(payloadData);
    },
    enabled: !!payloadData && activeTab === 'today',
  });

  const { data: todayRecords, isLoading: todayLoading, error: todayError } = useQuery({
    queryKey: ['attendance-today', payloadData?.hdnStudentId],
    queryFn: () => {
      if (!payloadData) {
        throw new Error('Not authenticated');
      }
      console.log('Fetching today attendance with payload:', payloadData);
      return fetchAttendanceData(payloadData);
    },
    enabled: !!payloadData && activeTab === 'today',
  });

  const { data: monthlyRecords, isLoading: monthlyLoading, error: monthlyError } = useQuery({
    queryKey: ['attendance-monthly', payloadData?.hdnStudentId],
    queryFn: () => {
      if (!payloadData) {
        throw new Error('Not authenticated');
      }
      console.log('Fetching monthly attendance with payload:', payloadData);
      return fetchMonthlyAttendanceData(payloadData);
    },
    enabled: !!payloadData && activeTab === 'monthly',
  });

  const { data: subjectRecords, isLoading: subjectLoading, error: subjectError } = useQuery({
    queryKey: ['attendance-subject', payloadData?.hdnStudentId, sharedDateRange?.from, sharedDateRange?.to],
    queryFn: () => {
      if (!payloadData || !sharedDateRange) {
        throw new Error('Not authenticated or date range not selected');
      }
      console.log('Fetching subject-wise attendance with payload:', payloadData);
      return fetchSubjectWiseAttendanceData(payloadData, sharedDateRange.from, sharedDateRange.to);
    },
    enabled: !!payloadData && activeTab === 'calendar' && subjectTab === 'subjectwise' && !!sharedDateRange,
  });

  const { data: datewiseRecords, isLoading: datewiseLoading, error: datewiseError } = useQuery({
    queryKey: ['attendance-datewise', payloadData?.hdnStudentId, sharedDateRange?.from, sharedDateRange?.to],
    queryFn: () => {
      if (!payloadData || !sharedDateRange) {
        throw new Error('Not authenticated or date range not selected');
      }
      console.log('Fetching date-wise attendance with payload:', payloadData);
      return fetchDateWiseAttendanceData(payloadData, sharedDateRange.from, sharedDateRange.to);
    },
    enabled: !!payloadData && activeTab === 'calendar' && subjectTab === 'datewise' && !!sharedDateRange,
  });

  const handleShowAttendance = () => {
    if (dateRange?.from && dateRange?.to) {
      setSharedDateRange({
        from: format(dateRange.from, 'dd/MM/yyyy'),
        to: format(dateRange.to, 'dd/MM/yyyy'),
      });
    }
  };

  return (
    <div className="px-3 pb-8">
      {!payloadData && (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-muted-foreground">Please log in to view your attendance data.</p>
        </div>
      )}

      {payloadData && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-background gap-3">
            <TabsTrigger
              value="today"
              className="cursor-pointer text-muted-foreground bg-background data-[state=active]:bg-muted data-[state=active]:text-foreground"
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="cursor-pointer text-muted-foreground bg-background data-[state=active]:bg-muted data-[state=active]:text-foreground"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="cursor-pointer text-muted-foreground bg-background data-[state=active]:bg-muted data-[state=active]:text-foreground"
            >
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
              {/* Overall Semester Attendance Card */}
              {semesterRecords && semesterRecords.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-xl">Semester Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {semesterRecords.map((record, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Session: {record.year}</p>
                            {/* <p className="text-sm text-muted-foreground">Course: {record.course}</p> */}
                            <p className="text-sm text-muted-foreground">Semester: {record.semester}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-primary">
                              {record.percentage}%
                            </div>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all bg-primary"
                            style={{ width: `${record.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {todayLoading && (
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

              {todayError && (
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-destructive">Failed to load attendance data. Please try again.</p>
                </div>
              )}

              {todayRecords && todayRecords.length > 0 && (
                <div className="space-y-4">
                  {todayRecords.map((record, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{record.subject}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Time:</div>
                          <div className="font-medium">{record.time}</div>

                          <div className="text-muted-foreground">Type:</div>
                          <div className="font-medium">{record.type}</div>

                          <div className="text-muted-foreground">Status:</div>
                          <div
                            className={`font-semibold ${
                              record.status === "P"
                                ? "text-chart-3"
                                : record.status === "A"
                                ? "text-chart-5"
                                : "text-yellow-600"
                            }`}
                          >
                            {record.status === "P"
                              ? "Present"
                              : record.status === "A"
                              ? "Absent"
                              : record.status || "Not Marked"}
                          </div>

                          {/* <div className="text-muted-foreground">Course:</div>
                          <div className="font-medium">{record.course}</div>

                          <div className="text-muted-foreground">Semester:</div>
                          <div className="font-medium">{record.semester}</div> */}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {todayRecords && todayRecords.length === 0 && !todayLoading && (
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-muted-foreground">No attendance records found for today.</p>
                </div>
              )}
            </TabsContent>

          <TabsContent value="monthly">
              {monthlyLoading && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </CardContent>
                  </Card>
                </div>
              )}

              {monthlyError && (
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-destructive">Failed to load monthly attendance. Please try again.</p>
                </div>
              )}

              {monthlyRecords && monthlyRecords.length > 0 && (
                <div className="space-y-4">
                  {monthlyRecords.map((record, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{record.month}</span>
                          <span className="text-xl font-bold text-chart-1">
                            {record.percentage}%
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {/* <div className="text-muted-foreground">Session:</div>
                          <div className="font-medium">{record.year}</div>

                          <div className="text-muted-foreground">Course:</div>
                          <div className="font-medium">{record.course}</div>

                          <div className="text-muted-foreground">Semester:</div>
                          <div className="font-medium">{record.semester}</div> */}
                        </div>
                        {/* Progress bar */}
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all bg-chart-1"
                            style={{ width: `${record.percentage}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {monthlyRecords && monthlyRecords.length === 0 && !monthlyLoading && (
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-muted-foreground">No monthly attendance records found.</p>
                </div>
              )}
            </TabsContent>

          <TabsContent value="calendar">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Date Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
                              </>
                            ) : (
                              format(dateRange.from, 'dd/MM/yyyy')
                            )
                          ) : (
                            'Pick a date range'
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          disabled={(date) => date > new Date()}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button
                    onClick={handleShowAttendance}
                    disabled={!dateRange?.from || !dateRange?.to}
                    className="w-full"
                  >
                    Show Attendance
                  </Button>
                </CardContent>
              </Card>

              <Tabs value={subjectTab} onValueChange={setSubjectTab} className="w-full">
                <TabsList className="w-full grid grid-cols-2 bg-background gap-3">
                  <TabsTrigger
                    value="subjectwise"
                    className="cursor-pointer text-muted-foreground bg-background data-[state=active]:bg-muted data-[state=active]:text-foreground"
                  >
                    Subject Wise
                  </TabsTrigger>
                  <TabsTrigger
                    value="datewise"
                    className="cursor-pointer text-muted-foreground bg-background data-[state=active]:bg-muted data-[state=active]:text-foreground"
                  >
                    Date Wise
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="subjectwise">
                  <div className="space-y-4">

              {subjectLoading && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </CardContent>
                  </Card>
                </div>
              )}

              {subjectError && (
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-destructive">Failed to load subject-wise attendance. Please try again.</p>
                </div>
              )}

              {subjectRecords && subjectRecords.length > 0 && (
                <div className="space-y-4">
                  {subjectRecords.map((record, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>{record.subject}</span>
                          <span className="text-xl font-bold text-chart-1">
                            {record.percentage}%
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {/* <div className="text-muted-foreground">Session:</div>
                          <div className="font-medium">{record.year}</div>

                          <div className="text-muted-foreground">Course:</div>
                          <div className="font-medium">{record.course}</div>

                          <div className="text-muted-foreground">Semester:</div>
                          <div className="font-medium">{record.semester}</div> */}
                        </div>
                        {/* Progress bar */}
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all bg-chart-1"
                            style={{ width: `${record.percentage}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {subjectRecords && subjectRecords.length === 0 && !subjectLoading && sharedDateRange && (
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-muted-foreground">No subject-wise attendance records found for the selected date range.</p>
                </div>
              )}
                  </div>
                </TabsContent>

                <TabsContent value="datewise">
                  <div className="space-y-4">
                    {datewiseLoading && (
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

                    {datewiseError && (
                      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                        <p className="text-destructive">Failed to load date-wise attendance. Please try again.</p>
                      </div>
                    )}

                    {datewiseRecords && datewiseRecords.length > 0 && (
                      <div className="space-y-4">
                        {datewiseRecords.map((record, index) => {
                          let statusColor = "text-yellow-600";
                          let statusText = record.status || "Not Marked";

                          if (record.status === "P") {
                            statusColor = "text-chart-3";
                            statusText = "Present";
                          } else if (record.status === "A") {
                            statusColor = "text-chart-5";
                            statusText = "Absent";
                          }

                          return (
                            <Card key={index}>
                              <CardHeader>
                                <CardTitle className="text-lg flex items-center justify-between">
                                  <span>{record.date}</span>
                                  <span className={`text-sm font-semibold ${statusColor}`}>
                                    {statusText}
                                  </span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
                                  <div className="text-muted-foreground">Subject:</div>
                                  <div className="font-medium">{record.subject}</div>

                                  <div className="text-muted-foreground">Time:</div>
                                  <div className="font-medium">{record.timeSlot}</div>

                                  <div className="text-muted-foreground">Type:</div>
                                  <div className="font-medium">{record.type}</div>

                                  {/* <div className="text-muted-foreground">Session:</div>
                                  <div className="font-medium">{record.year}</div>

                                  <div className="text-muted-foreground">Course:</div>
                                  <div className="font-medium">{record.course}</div>

                                  <div className="text-muted-foreground">Semester:</div>
                                  <div className="font-medium">{record.semester}</div> */}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}

                    {datewiseRecords && datewiseRecords.length === 0 && !datewiseLoading && sharedDateRange && (
                      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                        <p className="text-muted-foreground">No date-wise attendance records found for the selected date range.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
