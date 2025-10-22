import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, User, BookOpen, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchTodayTimeTable, fetchWeeklyTimeTable, type TimeTableEvent } from "@/utils/timetable";

export default function TimeTable() {
  const { payloadData } = useAuth();
  const [activeTab, setActiveTab] = useState("today");
  const [selectedDay, setSelectedDay] = useState<string>("Monday");

  const {
    data: todaySchedule,
    isLoading: todayLoading,
    error: todayError,
  } = useQuery({
    queryKey: ["timetable-today", payloadData?.hdnStudentId],
    queryFn: () => {
      if (!payloadData) {
        throw new Error("Not authenticated");
      }
      console.log("Fetching today timetable with payload:", payloadData);
      return fetchTodayTimeTable(payloadData);
    },
    enabled: !!payloadData && activeTab === "today",
  });

  const {
    data: weeklySchedule,
    isLoading: weeklyLoading,
    error: weeklyError,
  } = useQuery({
    queryKey: ["timetable-weekly", payloadData?.hdnStudentId],
    queryFn: () => {
      if (!payloadData) {
        throw new Error("Not authenticated");
      }
      console.log("Fetching weekly timetable with payload:", payloadData);
      return fetchWeeklyTimeTable(payloadData);
    },
    enabled: !!payloadData && activeTab === "weekly",
  });

  const extractPeriodNumber = (timeSlot: string): number => {
    const match = timeSlot.match(/\(P(\d+)\)/);
    return match ? parseInt(match[1]) : 0;
  };

  const sortedTodaySchedule = todaySchedule
    ? [...todaySchedule].sort((a, b) => {
        return extractPeriodNumber(a.timeSlot) - extractPeriodNumber(b.timeSlot);
      })
    : [];

  const getEventType = (subjectCode: string): string => {
    if (subjectCode.includes("55")) return "Practical";
    if (subjectCode.includes("BNC")) return "Non-Credit";
    return "Lecture";
  };

  const groupByDay = (events: TimeTableEvent[]) => {
    const grouped: Record<string, TimeTableEvent[]> = {};
    events.forEach((event) => {
      if (!grouped[event.day]) {
        grouped[event.day] = [];
      }
      grouped[event.day].push(event);
    });

    // Sort events within each day by period
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => extractPeriodNumber(a.timeSlot) - extractPeriodNumber(b.timeSlot));
    });

    return grouped;
  };

  const weeklyByDay = weeklySchedule ? groupByDay(weeklySchedule) : {};
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const EventCard = ({ event }: { event: TimeTableEvent }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-semibold">{getEventType(event.subjectCode)}</CardTitle>
          <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
            {event.subjectCode}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start gap-2">
          <BookOpen className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <p className="text-xs font-medium">{event.subject}</p>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground">{event.faculty}</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground">{event.group}</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground">{event.timeSlot}</p>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground">{event.hall}</p>
        </div>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="mb-4">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="px-3 pb-8 pt-2">
      {!payloadData && (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-muted-foreground">Please log in to view your timetable.</p>
        </div>
      )}

      {payloadData && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-background gap-3 mb-4">
            <TabsTrigger
              value="today"
              className="cursor-pointer text-muted-foreground bg-background data-[state=active]:bg-muted data-[state=active]:text-foreground"
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="cursor-pointer text-muted-foreground bg-background data-[state=active]:bg-muted data-[state=active]:text-foreground"
            >
              Weekly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-0">
            {todayLoading && <LoadingSkeleton />}

            {todayError && (
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <p className="text-destructive">Failed to load timetable. Please try again.</p>
              </div>
            )}

            {sortedTodaySchedule && sortedTodaySchedule.length === 0 && !todayLoading && (
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <p className="text-muted-foreground">No classes scheduled for today.</p>
              </div>
            )}

            {sortedTodaySchedule && sortedTodaySchedule.length > 0 && (
              <div>
                <Card className="mb-4 bg-muted/50">
                  <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Showing schedule for {sortedTodaySchedule[0]?.day || "Today"}
                    </CardDescription>
                  </CardHeader>
                </Card>
                {sortedTodaySchedule.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="weekly" className="mt-0">
            {weeklyLoading && <LoadingSkeleton />}

            {weeklyError && (
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <p className="text-destructive">Failed to load weekly timetable. Please try again.</p>
              </div>
            )}

            {weeklySchedule && weeklySchedule.length === 0 && !weeklyLoading && (
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <p className="text-muted-foreground">No classes scheduled this week.</p>
              </div>
            )}

            {weeklySchedule && weeklySchedule.length > 0 && (
              <div className="space-y-4">
                {/* Day selector */}
                <div className="flex flex-col gap-2">
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => {
                        const dayEvents = weeklyByDay[day];
                        if (!dayEvents || dayEvents.length === 0) return null;
                        return (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Show events for selected day */}
                {weeklyByDay[selectedDay] && weeklyByDay[selectedDay].length > 0 ? (
                  <div>
                    {weeklyByDay[selectedDay].map((event, index) => (
                      <EventCard key={`${selectedDay}-${index}`} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                    <p className="text-muted-foreground">No classes scheduled for {selectedDay}.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
