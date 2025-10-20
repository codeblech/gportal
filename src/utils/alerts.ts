import { getApiUrl } from "@/config/api";

export interface Alert {
  id: string;
  title: string;
  heading: string;
  description: string;
  readStatus: string;
  date: string;
}

export interface AlertsData {
  unreadAlerts: Alert[];
  readAlerts: Alert[];
}

/**
 * Fetches and parses alert data from the API
 */
export async function fetchAlertsData(payloadData: {
  __VIEWSTATE: string;
  __VIEWSTATEGENERATOR: string;
  __EVENTVALIDATION: string;
  hdnStudentId: string;
}): Promise<AlertsData> {
  try {
    const response = await fetch(getApiUrl("/Student/Alerts"), {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch alerts: ${response.status}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Parse unread alerts
    const unreadTable = doc.querySelector("#MCPH1_SCPH_gvAlerts");
    const unreadAlerts = parseAlertsTable(unreadTable);

    // Parse read alerts
    const readTable = doc.querySelector("#MCPH1_SCPH_gvReadMessege");
    const readAlerts = parseAlertsTable(readTable);

    return {
      unreadAlerts,
      readAlerts,
    };
  } catch (error) {
    console.error("Error fetching alerts data:", error);
    throw error;
  }
}

/**
 * Helper function to parse alerts from a table element
 */
function parseAlertsTable(table: Element | null): Alert[] {
  if (!table) {
    return [];
  }

  const alerts: Alert[] = [];
  const rows = table.querySelectorAll("tr.GrdAltRow");

  rows.forEach((row) => {
    try {
      // Extract hidden ID field
      const hiddenIdInput = row.querySelector('input[type="hidden"][name*="hdnIdcode"]');
      const id = hiddenIdInput?.getAttribute("value") || "";

      // Extract title
      const titleSpan = row.querySelector('[id*="lblTitle"]');
      const title = titleSpan?.textContent?.trim() || "";

      // Extract heading
      const headingSpan = row.querySelector('[id*="lblHeading"]');
      const heading = headingSpan?.textContent?.trim() || "";

      // Extract description
      const descriptionSpan = row.querySelector('[id*="lblDescription"]');
      const description = descriptionSpan?.textContent?.trim() || "";

      // Extract read status
      const statusSpan = row.querySelector('[id*="lblReadStatus"]');
      const readStatus = statusSpan?.textContent?.trim() || "";

      // Extract date (check both update and read message fields)
      const dateSpan =
        row.querySelector('[id*="lblUpdate"]') ||
        row.querySelector('[id*="lblReadMessege"]');
      const date = dateSpan?.textContent?.trim() || "";

      // Only add if we have essential data
      if (id && title && heading && description) {
        alerts.push({
          id,
          title,
          heading,
          description,
          readStatus,
          date,
        });
      }
    } catch (error) {
      console.error("Error parsing alert row:", error);
    }
  });

  return alerts;
}
