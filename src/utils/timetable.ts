import { getApiUrl } from "@/config/api";

export interface TimeTableEvent {
  subjectCode: string;
  subject: string;
  faculty: string;
  group: string;
  timeSlot: string;
  hall: string;
  day: string;
}

export interface PayloadData {
  __VIEWSTATE: string;
  __VIEWSTATEGENERATOR: string;
  __EVENTVALIDATION: string;
  hdnStudentId: string;
}

export async function fetchTodayTimeTable(payloadData: PayloadData): Promise<TimeTableEvent[]> {
  console.log("fetchTodayTimeTable called");

  // First, GET the TimeTable page to get the correct VIEWSTATE
  console.log("Fetching TimeTable page to get VIEWSTATE...");
  const pageResponse = await fetch(getApiUrl("/Student/TimeTable"), {
    credentials: "include",
  });

  if (!pageResponse.ok) {
    throw new Error(`Failed to fetch TimeTable page: ${pageResponse.status} ${pageResponse.statusText}`);
  }

  const pageHtml = await pageResponse.text();
  const parser = new DOMParser();
  const pageDoc = parser.parseFromString(pageHtml, "text/html");

  // Extract the page-specific payload data
  const viewstate = pageDoc.querySelector('input[name="__VIEWSTATE"]')?.getAttribute("value") || "";
  const viewstateGenerator = pageDoc.querySelector('input[name="__VIEWSTATEGENERATOR"]')?.getAttribute("value") || "";
  const eventValidation = pageDoc.querySelector('input[name="__EVENTVALIDATION"]')?.getAttribute("value") || "";
  const studentId = pageDoc.querySelector('input[name="ctl00$ctl00$MCPH1$SCPH$hdnStudentId"]')?.getAttribute("value") || payloadData.hdnStudentId;

  console.log("Extracted TimeTable page VIEWSTATE");

  // Prepare form data with all required fields
  const formData = new URLSearchParams();
  formData.append("__VIEWSTATE", viewstate);
  formData.append("__VIEWSTATEGENERATOR", viewstateGenerator);
  formData.append("__EVENTVALIDATION", eventValidation);
  formData.append("ctl00$ctl00$hdnForSchoolMaster", "0");
  formData.append("ctl00$ctl00$txtCaseCSS", "textDefault");
  formData.append("ctl00$ctl00$MCPH1$SCPH$hdnStudentId", studentId);
  formData.append("ctl00$ctl00$MCPH1$SCPH$Button2", "Today");

  console.log("Sending timetable POST request...");

  const response = await fetch(getApiUrl("/Student/TimeTable"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: "include",
  });

  console.log("Timetable response status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch timetable data: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log("Timetable HTML length:", html.length);
  const responseParser = new DOMParser();
  const doc = responseParser.parseFromString(html, "text/html");

  // Parse the timetable table
  const timeTableEvents: TimeTableEvent[] = [];
  const table = doc.querySelector("#MCPH1_SCPH_gvTimeTable");

  console.log("Timetable table found:", !!table);

  if (table) {
    const rows = table.querySelectorAll("tr");
    console.log("Total timetable rows:", rows.length);

    let currentDay = "";

    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      console.log(`Timetable row ${i} cells:`, cells.length);

      if (cells.length >= 6) {
        // Determine if this row has a day column (7 cells) or not (6 cells)
        let offset = 0;

        if (cells.length === 7) {
          // This row has the day column
          currentDay = cells[0]?.textContent?.trim() || currentDay;
          offset = 1;
        }

        const subjectCodeSpan = cells[offset]?.querySelector("span");
        const subjectSpan = cells[offset + 1]?.querySelector("span");
        const facultySpan = cells[offset + 2]?.querySelector("span");
        const groupSpan = cells[offset + 3]?.querySelector("span");
        const timeSlotSpan = cells[offset + 4]?.querySelector("span");
        const hallSpan = cells[offset + 5]?.querySelector("span");

        const event: TimeTableEvent = {
          day: currentDay,
          subjectCode: subjectCodeSpan?.textContent?.trim() || "",
          subject: subjectSpan?.textContent?.trim() || "",
          faculty: facultySpan?.textContent?.trim() || "",
          group: groupSpan?.textContent?.trim() || "",
          timeSlot: timeSlotSpan?.textContent?.trim() || "",
          hall: hallSpan?.textContent?.trim() || "",
        };

        console.log(`Parsed timetable event ${i}:`, event);
        timeTableEvents.push(event);
      }
    }
  } else {
    console.error("Table with ID MCPH1_SCPH_gvTimeTable not found");
  }

  console.log("Total timetable events parsed:", timeTableEvents.length);
  return timeTableEvents;
}

export async function fetchWeeklyTimeTable(payloadData: PayloadData): Promise<TimeTableEvent[]> {
  console.log("fetchWeeklyTimeTable called");

  // First, GET the TimeTable page to get the correct VIEWSTATE
  console.log("Fetching TimeTable page to get VIEWSTATE...");
  const pageResponse = await fetch(getApiUrl("/Student/TimeTable"), {
    credentials: "include",
  });

  if (!pageResponse.ok) {
    throw new Error(`Failed to fetch TimeTable page: ${pageResponse.status} ${pageResponse.statusText}`);
  }

  const pageHtml = await pageResponse.text();
  const parser = new DOMParser();
  const pageDoc = parser.parseFromString(pageHtml, "text/html");

  // Extract the page-specific payload data
  const viewstate = pageDoc.querySelector('input[name="__VIEWSTATE"]')?.getAttribute("value") || "";
  const viewstateGenerator = pageDoc.querySelector('input[name="__VIEWSTATEGENERATOR"]')?.getAttribute("value") || "";
  const eventValidation = pageDoc.querySelector('input[name="__EVENTVALIDATION"]')?.getAttribute("value") || "";
  const studentId = pageDoc.querySelector('input[name="ctl00$ctl00$MCPH1$SCPH$hdnStudentId"]')?.getAttribute("value") || payloadData.hdnStudentId;

  console.log("Extracted TimeTable page VIEWSTATE");

  // Prepare form data with all required fields
  const formData = new URLSearchParams();
  formData.append("__VIEWSTATE", viewstate);
  formData.append("__VIEWSTATEGENERATOR", viewstateGenerator);
  formData.append("__EVENTVALIDATION", eventValidation);
  formData.append("ctl00$ctl00$hdnForSchoolMaster", "0");
  formData.append("ctl00$ctl00$txtCaseCSS", "textDefault");
  formData.append("ctl00$ctl00$MCPH1$SCPH$hdnStudentId", studentId);
  formData.append("ctl00$ctl00$MCPH1$SCPH$Button1", "Weekly");

  console.log("Sending weekly timetable POST request...");

  const response = await fetch(getApiUrl("/Student/TimeTable"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: "include",
  });

  console.log("Weekly timetable response status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch weekly timetable data: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log("Weekly timetable HTML length:", html.length);
  const responseParser = new DOMParser();
  const doc = responseParser.parseFromString(html, "text/html");

  // Parse the weekly timetable table (same structure as today)
  const timeTableEvents: TimeTableEvent[] = [];
  const table = doc.querySelector("#MCPH1_SCPH_gvTimeTable");

  console.log("Weekly timetable table found:", !!table);

  if (table) {
    const rows = table.querySelectorAll("tr");
    console.log("Total weekly timetable rows:", rows.length);
    console.log("Raw table HTML:", table.outerHTML.substring(0, 1000)); // Log first 1000 chars

    let currentDay = "";

    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      console.log(`Weekly timetable row ${i} cells:`, cells.length);
      console.log(`Row ${i} HTML:`, rows[i].outerHTML);

      if (cells.length >= 6) {
        // Determine if this row has a day column (7 cells) or not (6 cells due to rowspan)
        let offset = 0;

        if (cells.length === 7) {
          // This row has the day column
          currentDay = cells[0]?.textContent?.trim() || currentDay;
          offset = 1;
          console.log(`Row ${i}: New day detected: ${currentDay}, cells: 7, offset: 1`);
        } else {
          console.log(`Row ${i}: Continuing day: ${currentDay}, cells: ${cells.length}, offset: 0`);
        }
        // else: cells.length === 6, no day column, offset stays 0, use currentDay from previous row

        const subjectCodeSpan = cells[offset]?.querySelector("span");
        const subjectSpan = cells[offset + 1]?.querySelector("span");
        const facultySpan = cells[offset + 2]?.querySelector("span");
        const groupSpan = cells[offset + 3]?.querySelector("span");
        const timeSlotSpan = cells[offset + 4]?.querySelector("span");
        const hallSpan = cells[offset + 5]?.querySelector("span");

        const event: TimeTableEvent = {
          day: currentDay,
          subjectCode: subjectCodeSpan?.textContent?.trim() || "",
          subject: subjectSpan?.textContent?.trim() || "",
          faculty: facultySpan?.textContent?.trim() || "",
          group: groupSpan?.textContent?.trim() || "",
          timeSlot: timeSlotSpan?.textContent?.trim() || "",
          hall: hallSpan?.textContent?.trim() || "",
        };

        console.log(`Parsed weekly timetable event ${i}:`, event);
        timeTableEvents.push(event);
      } else {
        console.log(`Row ${i}: Skipped - only ${cells.length} cells`);
      }
    }
  } else {
    console.error("Table with ID MCPH1_SCPH_gvTimeTable not found");
  }

  console.log("Total weekly timetable events parsed:", timeTableEvents.length);
  return timeTableEvents;
}
