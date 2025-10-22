import { getApiUrl } from "@/config/api";

export interface SemesterOption {
  value: string;
  label: string;
}

export interface ExamOption {
  value: string;
  label: string;
}

export interface GradeRecord {
  srNo: string;
  semester: string;
  subjectCode: string;
  subject: string;
  s1: string;
  st2: string;
  put: string;
  ta: string;
  mt1: string;
  st1: string;
}

export interface PayloadData {
  __VIEWSTATE: string;
  __VIEWSTATEGENERATOR: string;
  __EVENTVALIDATION: string;
  hdnStudentId: string;
}

export async function fetchSemestersAndExams(payloadData: PayloadData): Promise<{
  semesters: SemesterOption[];
  exams: ExamOption[];
  updatedPayload: PayloadData;
}> {
  console.log("fetchSemestersAndExams called with payload:", payloadData);

  const response = await fetch(getApiUrl("/Student/ExamResult"), {
    method: "GET",
    credentials: "include",
  });

  console.log("Semesters and exams response status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch semesters and exams: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log("Semesters and exams HTML length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Extract semester options
  const semesters: SemesterOption[] = [];
  const semesterSelect = doc.querySelector("#MCPH1_SCPH_ddldrp");
  if (semesterSelect) {
    const options = semesterSelect.querySelectorAll("option");
    options.forEach((option) => {
      const value = option.getAttribute("value") || "";
      const label = option.textContent?.trim() || "";
      if (value !== "--Select--") {
        semesters.push({ value, label });
      }
    });
  }

  // Extract exam options (we always use "All")
  const exams: ExamOption[] = [];
  const examSelect = doc.querySelector("#MCPH1_SCPH_ddlExamName");
  if (examSelect) {
    const options = examSelect.querySelectorAll("option");
    options.forEach((option) => {
      const value = option.getAttribute("value") || "";
      const label = option.textContent?.trim() || "";
      if (value !== "--Select--") {
        exams.push({ value, label });
      }
    });
  }

  // Extract updated payload data
  const viewstate = doc.querySelector<HTMLInputElement>("#__VIEWSTATE")?.value || payloadData.__VIEWSTATE;
  const viewstateGenerator = doc.querySelector<HTMLInputElement>("#__VIEWSTATEGENERATOR")?.value || payloadData.__VIEWSTATEGENERATOR;
  const eventValidation = doc.querySelector<HTMLInputElement>("#__EVENTVALIDATION")?.value || payloadData.__EVENTVALIDATION;
  const studentId = doc.querySelector<HTMLInputElement>("#hdnStudentId")?.value || payloadData.hdnStudentId;

  const updatedPayload: PayloadData = {
    __VIEWSTATE: viewstate,
    __VIEWSTATEGENERATOR: viewstateGenerator,
    __EVENTVALIDATION: eventValidation,
    hdnStudentId: studentId,
  };

  console.log("Semesters found:", semesters.length);
  console.log("Exams found:", exams.length);

  return { semesters, exams, updatedPayload };
}

export async function fetchGradesData(
  payloadData: PayloadData,
  semester: string
): Promise<GradeRecord[]> {
  console.log("fetchGradesData called with payload:", payloadData);
  console.log("Selected semester:", semester);

  // Prepare form data with all required fields
  const formData = new URLSearchParams();
  formData.append("__VIEWSTATE", payloadData.__VIEWSTATE);
  formData.append("__VIEWSTATEGENERATOR", payloadData.__VIEWSTATEGENERATOR);
  formData.append("__VIEWSTATEENCRYPTED", "");
  formData.append("__EVENTVALIDATION", payloadData.__EVENTVALIDATION);
  formData.append("ctl00$ctl00$hdnForSchoolMaster", "0");
  formData.append("ctl00$ctl00$txtCaseCSS", "textDefault");
  formData.append("ctl00$ctl00$MCPH1$SCPH$hdnStudentId", payloadData.hdnStudentId);
  formData.append("ctl00$ctl00$MCPH1$SCPH$hdnResult", "0");
  formData.append("ctl00$ctl00$MCPH1$SCPH$ddldrp", semester);
  formData.append("ctl00$ctl00$MCPH1$SCPH$ddlExamName", "All");
  formData.append("ctl00$ctl00$MCPH1$SCPH$btnRun", "Show");

  console.log("Sending grades POST request...");

  const response = await fetch(getApiUrl("/Student/ExamResult"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: "include",
  });

  console.log("Grades response status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch grades data: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log("Grades HTML length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Parse the grades table
  const gradeRecords: GradeRecord[] = [];

  // The actual grades data is in the table with ID MCPH1_SCPH_gvmarksdetails
  const table = doc.querySelector("#MCPH1_SCPH_gvmarksdetails");

  console.log("Table found:", !!table);

  if (table) {
    const rows = table.querySelectorAll("tbody tr");
    console.log("Total rows:", rows.length);

    // Parse each row
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      console.log(`Row ${i} cells:`, cells.length);

      // Check if this is a "No Record Found" row
      if (cells.length === 1) {
        const cellText = cells[0]?.textContent?.trim() || "";
        if (cellText.includes("No Record") || cellText.includes("No Data")) {
          console.log("No records found in grades table");
          break;
        }
      }

      // The table has 10 columns: SNo., Semester, Sub Code, Sub Name, S1, ST2, PUT, TA, MT1, ST1
      if (cells.length >= 10) {
        const record: GradeRecord = {
          srNo: cells[0]?.textContent?.trim() || "",
          semester: cells[1]?.textContent?.trim() || "",
          subjectCode: cells[2]?.textContent?.trim() || "",
          subject: cells[3]?.textContent?.trim() || "",
          s1: cells[4]?.textContent?.trim() || "",
          st2: cells[5]?.textContent?.trim() || "",
          put: cells[6]?.textContent?.trim() || "",
          ta: cells[7]?.textContent?.trim() || "",
          mt1: cells[8]?.textContent?.trim() || "",
          st1: cells[9]?.textContent?.trim() || "",
        };
        console.log(`Parsed grade record ${i}:`, record);
        gradeRecords.push(record);
      }
    }
  } else {
    console.error("Grades table with ID MCPH1_SCPH_gvmarksdetails not found");
    console.log("Available tables:", doc.querySelectorAll("table").length);
  }

  console.log("Total grade records parsed:", gradeRecords.length);
  return gradeRecords;
}
