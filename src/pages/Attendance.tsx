import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { fetchAttendanceData, fetchMonthlyAttendanceData } from '../utils/attendance';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { useThemeStore } from '../stores/theme-store';

export default function Attendance() {
  const { payloadData } = useAuth();
  const [activeTab, setActiveTab] = useState('today');

  // Subscribe to theme changes to trigger re-render
  const themeState = useThemeStore((state) => state.themeState);

  // Force re-render when theme changes
  const [, setForceUpdate] = useState({});
  useEffect(() => {
    setForceUpdate({});
  }, [themeState]);

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

  return (
    <div className="px-3 pb-8">
      {!payloadData && (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-muted-foreground">Please log in to view your attendance data.</p>
        </div>
      )}

      {payloadData && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-background gap-3">
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
          </TabsList>

          <TabsContent value="today">
              {todayLoading && (
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-muted-foreground">Loading today's attendance...</p>
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
                                ? "text-green-600"
                                : record.status === "A"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {record.status === "P"
                              ? "Present"
                              : record.status === "A"
                              ? "Absent"
                              : record.status || "Not Marked"}
                          </div>

                          <div className="text-muted-foreground">Course:</div>
                          <div className="font-medium">{record.course}</div>

                          <div className="text-muted-foreground">Semester:</div>
                          <div className="font-medium">{record.semester}</div>
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
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-muted-foreground">Loading monthly attendance...</p>
                </div>
              )}

              {monthlyError && (
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-destructive">Failed to load monthly attendance. Please try again.</p>
                </div>
              )}

              {monthlyRecords && monthlyRecords.length > 0 && (
                <div className="space-y-4">
                  {monthlyRecords.map((record, index) => {
                    // Get chart color based on index (cycle through chart-1 to chart-5)
                    const getChartColor = (idx: number) => {
                      const colorIndex = (idx % 5) + 1;
                      return getComputedStyle(document.documentElement)
                        .getPropertyValue(`--chart-${colorIndex}`)
                        .trim();
                    };

                    return (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span>{record.month}</span>
                            <span
                              className="text-xl font-bold"
                              style={{ color: getChartColor(index) }}
                            >
                              {record.percentage}%
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">Session:</div>
                            <div className="font-medium">{record.year}</div>

                            <div className="text-muted-foreground">Course:</div>
                            <div className="font-medium">{record.course}</div>

                            <div className="text-muted-foreground">Semester:</div>
                            <div className="font-medium">{record.semester}</div>
                          </div>
                          {/* Progress bar */}
                          <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${record.percentage}%`,
                                backgroundColor: getChartColor(index)
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {monthlyRecords && monthlyRecords.length === 0 && !monthlyLoading && (
                <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                  <p className="text-muted-foreground">No monthly attendance records found.</p>
                </div>
              )}
            </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
