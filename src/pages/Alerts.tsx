import { useQuery } from "@tanstack/react-query";
import { Bell, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchAlertsData } from "@/utils/alerts";

export default function Alerts() {
  const { payloadData } = useAuth();

  const {
    data: alertsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["alerts", payloadData?.hdnStudentId],
    queryFn: () => {
      if (!payloadData) {
        throw new Error("Not authenticated");
      }
      return fetchAlertsData(payloadData);
    },
    enabled: !!payloadData,
  });

  if (isLoading) {
    return (
      <div className="px-3 py-4">
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-4">
        <div className="flex items-center justify-center p-8">
          <p className="text-destructive">Failed to load alerts. Please try again.</p>
        </div>
      </div>
    );
  }

  const unreadAlerts = alertsData?.unreadAlerts || [];
  const readAlerts = alertsData?.readAlerts || [];

  return (
    <div className="px-3 py-4">
      {/* Unread Alerts Section */}
      <div className="mb-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Bell className="h-5 w-5" />
          Unread Alerts
        </h2>

        {unreadAlerts.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-center text-card-foreground shadow-sm">
            <p className="text-muted-foreground">No alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unreadAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                    {alert.title}
                  </span>
                  <span className="text-sm font-semibold">{alert.heading}</span>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">{alert.description}</p>
                <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {alert.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Read Alerts Section */}
      {readAlerts.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Read Alerts</h2>
          <div className="space-y-3">
            {readAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border bg-muted/50 p-4 opacity-70"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {alert.title}
                  </span>
                  <span className="text-sm font-semibold">{alert.heading}</span>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">{alert.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {alert.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
