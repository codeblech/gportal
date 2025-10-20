import { getApiUrl } from "@/config/api";

export interface AttendanceRecord {
  srNo: string;
  year: string;
  course: string;
  semester: string;
  subject: string;
  time: string;
  type: string;
  status: string;
}

export interface MonthlyAttendanceRecord {
  srNo: string;
  year: string;
  course: string;
  semester: string;
  month: string;
  percentage: string;
}

export interface SubjectWiseAttendanceRecord {
  srNo: string;
  year: string;
  course: string;
  semester: string;
  subject: string;
  percentage: string;
}

export interface DateWiseAttendanceRecord {
  srNo: string;
  year: string;
  course: string;
  semester: string;
  date: string;
  subject: string;
  timeSlot: string;
  type: string;
  status: string;
}

export interface SemesterAttendanceRecord {
  srNo: string;
  year: string;
  course: string;
  semester: string;
  percentage: string;
}

export interface PayloadData {
  __VIEWSTATE: string;
  __VIEWSTATEGENERATOR: string;
  __EVENTVALIDATION: string;
  hdnStudentId: string;
}

export async function fetchAttendanceData(payloadData: PayloadData): Promise<AttendanceRecord[]> {
  console.log("fetchAttendanceData called with payload:", payloadData);

  // Prepare form data with all required fields
  const formData = new URLSearchParams();
  formData.append("__VIEWSTATE", payloadData.__VIEWSTATE);
  formData.append("__VIEWSTATEGENERATOR", payloadData.__VIEWSTATEGENERATOR);
  formData.append("__EVENTVALIDATION", payloadData.__EVENTVALIDATION);
  formData.append("ctl00$ctl00$hdnForSchoolMaster", "0");
  formData.append("ctl00$ctl00$txtCaseCSS", "textDefault");
  formData.append("ctl00$ctl00$MCPH1$SCPH$hdnStudentId", payloadData.hdnStudentId);
  formData.append("ctl00$ctl00$MCPH1$SCPH$btntodayAtt", "Today Attendance");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtDFrom", "");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtDTo", "");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtFrom", "");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtTo", "");

  console.log("Sending attendance POST request...");
  console.log("Attendance form data:", formData.toString().substring(0, 200) + "...");

  const response = await fetch(getApiUrl("/Student/TodayAttendence"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: "include",
  });

  console.log("Attendance response status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch attendance data: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log("Attendance HTML length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Parse the attendance table
  const attendanceRecords: AttendanceRecord[] = [];
  const table = doc.querySelector("#MCPH1_SCPH_gvDailyAttendence1");

  console.log("Table found:", !!table);

  if (table) {
    const rows = table.querySelectorAll("tr");
    console.log("Total rows:", rows.length);

    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      console.log(`Row ${i} cells:`, cells.length);

      if (cells.length >= 8) {
        const record = {
          srNo: cells[0]?.textContent?.trim() || "",
          year: cells[1]?.textContent?.trim() || "",
          course: cells[2]?.textContent?.trim() || "",
          semester: cells[3]?.textContent?.trim() || "",
          subject: cells[4]?.textContent?.trim() || "",
          time: cells[5]?.textContent?.trim() || "",
          type: cells[6]?.textContent?.trim() || "",
          status: cells[7]?.textContent?.trim() || "",
        };
        console.log(`Parsed record ${i}:`, record);
        attendanceRecords.push(record);
      }
    }
  } else {
    console.error("Table with ID MCPH1_SCPH_gvDailyAttendence1 not found");
    console.log("Document body:", doc.body?.innerHTML.substring(0, 500));
  }

  console.log("Total attendance records parsed:", attendanceRecords.length);
  return attendanceRecords;
}

export async function fetchMonthlyAttendanceData(payloadData: PayloadData): Promise<MonthlyAttendanceRecord[]> {
  console.log("fetchMonthlyAttendanceData called with payload:", payloadData);

  // Prepare form data with all required fields for monthly attendance
  const formData = new URLSearchParams();
  formData.append("__VIEWSTATE", payloadData.__VIEWSTATE);
  formData.append("__VIEWSTATEGENERATOR", payloadData.__VIEWSTATEGENERATOR);
  formData.append("__EVENTVALIDATION", payloadData.__EVENTVALIDATION);
  formData.append("ctl00$ctl00$hdnForSchoolMaster", "0");
  formData.append("ctl00$ctl00$txtCaseCSS", "textDefault");
  formData.append("ctl00$ctl00$MCPH1$SCPH$hdnStudentId", payloadData.hdnStudentId);
  formData.append("ctl00$ctl00$MCPH1$SCPH$btnMonthlyAtt", "Monthly Attendance");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtDFrom", "");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtDTo", "");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtFrom", "");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtTo", "");

  console.log("Sending monthly attendance POST request...");

  const response = await fetch(getApiUrl("/Student/TodayAttendence"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: "include",
  });

  console.log("Monthly attendance response status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch monthly attendance data: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log("Monthly attendance HTML length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Parse the monthly attendance table
  const monthlyRecords: MonthlyAttendanceRecord[] = [];
  const table = doc.querySelector("#MCPH1_SCPH_gvMonthly");

  console.log("Monthly table found:", !!table);

  if (table) {
    const rows = table.querySelectorAll("tr");
    console.log("Monthly total rows:", rows.length);

    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      console.log(`Monthly row ${i} cells:`, cells.length);

      if (cells.length >= 6) {
        // Extract percentage from the span inside the 6th cell
        const percentageSpan = cells[5]?.querySelector("span");
        const percentageText = percentageSpan?.textContent?.trim() || "";

        const record = {
          srNo: cells[0]?.textContent?.trim() || "",
          year: cells[1]?.textContent?.trim() || "",
          course: cells[2]?.textContent?.trim() || "",
          semester: cells[3]?.textContent?.trim() || "",
          month: cells[4]?.textContent?.trim() || "",
          percentage: percentageText,
        };
        console.log(`Parsed monthly record ${i}:`, record);
        monthlyRecords.push(record);
      }
    }
  } else {
    console.error("Table with ID MCPH1_SCPH_gvMonthly not found");
  }

  console.log("Total monthly attendance records parsed:", monthlyRecords.length);
  return monthlyRecords;
}

export async function fetchSubjectWiseAttendanceData(
  payloadData: PayloadData,
  dateFrom: string,
  dateTo: string
): Promise<SubjectWiseAttendanceRecord[]> {
  console.log("fetchSubjectWiseAttendanceData called with payload:", payloadData);
  console.log("Date range:", dateFrom, "to", dateTo);

  // Prepare form data with all required fields for subject-wise attendance
  const formData = new URLSearchParams();
  formData.append("__VIEWSTATE", payloadData.__VIEWSTATE);
  formData.append("__VIEWSTATEGENERATOR", payloadData.__VIEWSTATEGENERATOR);
  formData.append("__EVENTVALIDATION", payloadData.__EVENTVALIDATION);
  formData.append("ctl00$ctl00$hdnForSchoolMaster", "0");
  formData.append("ctl00$ctl00$txtCaseCSS", "textDefault");
  formData.append("ctl00$ctl00$MCPH1$SCPH$hdnStudentId", payloadData.hdnStudentId);
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtDFrom", dateFrom);
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtDTo", dateTo);
  formData.append("ctl00$ctl00$MCPH1$SCPH$btnShowSubject", "Show");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtFrom", "");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtTo", "");

  console.log("Sending subject-wise attendance POST request...");

  const response = await fetch(getApiUrl("/Student/TodayAttendence"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: "include",
  });

  console.log("Subject-wise attendance response status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch subject-wise attendance data: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log("Subject-wise attendance HTML length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Parse the subject-wise attendance table
  const subjectRecords: SubjectWiseAttendanceRecord[] = [];
  const table = doc.querySelector("#MCPH1_SCPH_GVSubject");

  console.log("Subject-wise table found:", !!table);

  if (table) {
    const rows = table.querySelectorAll("tr");
    console.log("Subject-wise total rows:", rows.length);

    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      console.log(`Subject-wise row ${i} cells:`, cells.length);

      if (cells.length >= 6) {
        // Extract percentage from the span inside the last cell (6th column)
        const percentageSpan = cells[5]?.querySelector("span");
        const percentageText = percentageSpan?.textContent?.trim() || "";

        const record = {
          srNo: cells[0]?.textContent?.trim() || "",
          year: cells[1]?.textContent?.trim() || "",
          course: cells[2]?.textContent?.trim() || "",
          semester: cells[3]?.textContent?.trim() || "",
          subject: cells[4]?.textContent?.trim() || "",
          percentage: percentageText,
        };
        console.log(`Parsed subject-wise record ${i}:`, record);
        subjectRecords.push(record);
      }
    }
  } else {
    console.error("Table with ID MCPH1_SCPH_GVSubject not found");
  }

  console.log("Total subject-wise attendance records parsed:", subjectRecords.length);
  return subjectRecords;
}

export async function fetchDateWiseAttendanceData(
  payloadData: PayloadData,
  dateFrom: string,
  dateTo: string
): Promise<DateWiseAttendanceRecord[]> {
  console.log("fetchDateWiseAttendanceData called with payload:", payloadData);
  console.log("Date range:", dateFrom, "to", dateTo);

  // Prepare form data with all required fields for date-wise attendance
  const formData = new URLSearchParams();
  formData.append("__VIEWSTATE", payloadData.__VIEWSTATE);
  formData.append("__VIEWSTATEGENERATOR", payloadData.__VIEWSTATEGENERATOR);
  formData.append("__EVENTVALIDATION", payloadData.__EVENTVALIDATION);
  formData.append("ctl00$ctl00$hdnForSchoolMaster", "0");
  formData.append("ctl00$ctl00$txtCaseCSS", "textDefault");
  formData.append("ctl00$ctl00$MCPH1$SCPH$hdnStudentId", payloadData.hdnStudentId);
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtDFrom", "");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtDTo", "");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtFrom", dateFrom);
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtTo", dateTo);
  formData.append("ctl00$ctl00$MCPH1$SCPH$btnShowAtt", "Show");

  console.log("Sending date-wise attendance POST request...");

  const response = await fetch(getApiUrl("/Student/TodayAttendence"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: "include",
  });

  console.log("Date-wise attendance response status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch date-wise attendance data: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log("Date-wise attendance HTML length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Parse the date-wise attendance table
  const dateRecords: DateWiseAttendanceRecord[] = [];
  const table = doc.querySelector("#MCPH1_SCPH_gvDateWise");

  console.log("Date-wise table found:", !!table);

  if (table) {
    const rows = table.querySelectorAll("tr");
    console.log("Date-wise total rows:", rows.length);

    // Skip header row (index 0) and check for "No Record Found" message
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      console.log(`Date-wise row ${i} cells:`, cells.length);

      // Check if this is the "No Record Found" row
      if (cells.length === 1) {
        const cellText = cells[0]?.textContent?.trim() || "";
        if (cellText === "No Record Found") {
          console.log("No records found in date-wise table");
          break;
        }
      }

      if (cells.length >= 9) {
        const record = {
          srNo: cells[0]?.textContent?.trim() || "",
          year: cells[1]?.textContent?.trim() || "",
          course: cells[2]?.textContent?.trim() || "",
          semester: cells[3]?.textContent?.trim() || "",
          date: cells[4]?.textContent?.trim() || "",
          subject: cells[5]?.textContent?.trim() || "",
          timeSlot: cells[6]?.textContent?.trim() || "",
          type: cells[7]?.textContent?.trim() || "",
          status: cells[8]?.textContent?.trim() || "",
        };
        console.log(`Parsed date-wise record ${i}:`, record);
        dateRecords.push(record);
      }
    }
  } else {
    console.error("Table with ID MCPH1_SCPH_gvDateWise not found");
  }

  console.log("Total date-wise attendance records parsed:", dateRecords.length);
  return dateRecords;
}

export async function fetchSemesterAttendanceData(payloadData: PayloadData): Promise<SemesterAttendanceRecord[]> {
  console.log("fetchSemesterAttendanceData called with payload:", payloadData);

  // Prepare form data with all required fields for semester attendance
  const formData = new URLSearchParams();
  formData.append("__VIEWSTATE", payloadData.__VIEWSTATE);
  formData.append("__VIEWSTATEGENERATOR", payloadData.__VIEWSTATEGENERATOR);
  formData.append("__EVENTVALIDATION", payloadData.__EVENTVALIDATION);
  formData.append("ctl00$ctl00$hdnForSchoolMaster", "0");
  formData.append("ctl00$ctl00$txtCaseCSS", "textDefault");
  formData.append("ctl00$ctl00$MCPH1$SCPH$hdnStudentId", payloadData.hdnStudentId);
  formData.append("ctl00$ctl00$MCPH1$SCPH$btnSemAtt", "Semester Attendance");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtDFrom", "");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtDTo", "");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtFrom", "");
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtTo", "");

  console.log("Sending semester attendance POST request...");

  const response = await fetch(getApiUrl("/Student/TodayAttendence"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: "include",
  });

  console.log("Semester attendance response status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch semester attendance data: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log("Semester attendance HTML length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Parse the semester attendance table
  const semesterRecords: SemesterAttendanceRecord[] = [];
  const table = doc.querySelector("#MCPH1_SCPH_gvAttendanceDetail");

  console.log("Semester table found:", !!table);

  if (table) {
    const rows = table.querySelectorAll("tr");
    console.log("Semester total rows:", rows.length);

    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      console.log(`Semester row ${i} cells:`, cells.length);

      if (cells.length >= 5) {
        // Extract percentage from the span inside the 5th cell
        const percentageSpan = cells[4]?.querySelector("span");
        const percentageText = percentageSpan?.textContent?.trim() || "";

        const record = {
          srNo: cells[0]?.textContent?.trim() || "",
          year: cells[1]?.textContent?.trim() || "",
          course: cells[2]?.textContent?.trim() || "",
          semester: cells[3]?.textContent?.trim() || "",
          percentage: percentageText,
        };
        console.log(`Parsed semester record ${i}:`, record);
        semesterRecords.push(record);
      }
    }
  } else {
    console.error("Table with ID MCPH1_SCPH_gvAttendanceDetail not found");
  }

  console.log("Total semester attendance records parsed:", semesterRecords.length);
  return semesterRecords;
}
