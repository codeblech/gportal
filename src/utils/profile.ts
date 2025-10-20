import { getApiUrl } from "@/config/api";

export interface ProfileData {
  photo: string;
  admissionNo: string;
  regFormNo: string;
  name: string;
  gender: string;
  bloodGroup: string;
  dob: string;
  presentAddress: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  email: string;
  remark: string;
  localGuardianName: string;
  localGuardianAddress: string;
  localGuardianPhone: string;
  fatherName: string;
  fatherMobile: string;
  fatherEmail: string;
  motherName: string;
  motherMobile: string;
  motherEmail: string;
  occupation: string;
  designation: string;
  annualIncome: string;
  permanentAddress: string;
  permanentCity: string;
  permanentState: string;
  permanentPinCode: string;
  permanentPhone: string;
  guardianMobile: string;
}

export interface OfficialDetailsData {
  // Official Details
  admissionNo: string;
  accountId: string;
  admissionDate: string;
  status: string;
  session: string;
  program: string;
  admSem: string;
  currentSem: string;
  groupName: string;
  quota: string;
  hostel: string;
  transport: string;
  officialMail: string;

  // Registration Details
  name: string;
  category: string;
  rollNo: string;
  enrollmentNo: string;
  regFormNo: string;
  serialNo: string;
  admThrough: string;
  referenceBy: string;
  lateralEntry: string;
  xiiPcm: string;
  xiiAgg: string;
  mess: string;

  // Mentor Details
  mentorName: string;
  mentorCode: string;
  mentorMobile: string;
  mentorEmail: string;
  department: string;
  mentorDesignation: string;
  cabinNo: string;
}

export interface QualificationRecord {
  sno: string;
  qualification: string;
  subject: string;
  college: string;
  board: string;
  medium: string;
  yearPassing: string;
  percentage: string;
  grade: string;
  cgpa: string;
}

export interface QualificationData {
  name: string;
  admissionNo: string;
  admissionDate: string;
  status: string;
  session: string;
  program: string;
  qualifications: QualificationRecord[];
}

export interface PayloadData {
  __VIEWSTATE: string;
  __VIEWSTATEGENERATOR: string;
  __EVENTVALIDATION: string;
  hdnStudentId: string;
}

export async function fetchProfileData(payloadData: PayloadData): Promise<ProfileData> {
  console.log("fetchProfileData called with payload:", payloadData);

  // Fetch the profile page
  const response = await fetch(getApiUrl("/Student/Course"), {
    method: "GET",
    credentials: "include",
  });

  console.log("Profile response status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch profile data: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log("Profile HTML length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Helper function to get text content safely
  const getText = (selector: string): string => {
    const element = doc.querySelector(selector);
    return element?.textContent?.trim() || "";
  };

  // Helper function to get attribute value safely
  const getAttr = (selector: string, attr: string): string => {
    const element = doc.querySelector(selector);
    return element?.getAttribute(attr) || "";
  };

  // Extract profile data from the HTML
  const profileData: ProfileData = {
    // Photo
    photo: getAttr("#MCPH1_SCPH_ViewStudentPhoto_ifrmaeImg", "src"),

    // Personal Information
    admissionNo: getText("#MCPH1_SCPH_lblAdmNo"),
    regFormNo: getText("#MCPH1_SCPH_lblRegNo"),
    name: getText("#MCPH1_SCPH_lblName"),
    gender: getText("#MCPH1_SCPH_lblGender"),
    bloodGroup: getText("#MCPH1_SCPH_lblBG"),
    dob: getText("#MCPH1_SCPH_lblDOB"),
    presentAddress: getText("#MCPH1_SCPH_lblPresentAdd"),
    city: getText("#MCPH1_SCPH_lblCity1"),
    state: getText("#MCPH1_SCPH_lblstate1"),
    pinCode: getText("#MCPH1_SCPH_lblPin1"),
    phone: getText("#MCPH1_SCPH_lblPhone1"),
    email: getText("#MCPH1_SCPH_lblEmail1"),
    remark: getText("#MCPH1_SCPH_lblRemark"),

    // Local Guardian Information
    localGuardianName: getText("#MCPH1_SCPH_lblLGuard"),
    localGuardianAddress: getText("#MCPH1_SCPH_lblAddress1"),
    localGuardianPhone: getText("#MCPH1_SCPH_lblPhone"),

    // Guardian Information
    fatherName: getText("#MCPH1_SCPH_lblfather"),
    fatherMobile: getText("#MCPH1_SCPH_lblfmob"),
    fatherEmail: getText("#MCPH1_SCPH_lblFEmail"),
    motherName: getText("#MCPH1_SCPH_lblmother"),
    motherMobile: getText("#MCPH1_SCPH_lblMobile"),
    motherEmail: getText("#MCPH1_SCPH_lblMEmail"),
    occupation: getText("#MCPH1_SCPH_lblOccupation"),
    designation: getText("#MCPH1_SCPH_lblDesi"),
    annualIncome: getText("#MCPH1_SCPH_lblMon"),
    permanentAddress: getText("#MCPH1_SCPH_lblParmanantAdd"),
    permanentCity: getText("#MCPH1_SCPH_lblCity2"),
    permanentState: getText("#MCPH1_SCPH_lblState2"),
    permanentPinCode: getText("#MCPH1_SCPH_lblpin2"),
    permanentPhone: getText("#MCPH1_SCPH_lblPhone2"),
    guardianMobile: getText("#MCPH1_SCPH_lblmob"),
  };

  console.log("Parsed profile data:", profileData);

  return profileData;
}

export async function fetchOfficialDetailsData(payloadData: PayloadData): Promise<OfficialDetailsData> {
  console.log("fetchOfficialDetailsData called with payload:", payloadData);

  // Fetch the official details page
  const response = await fetch(getApiUrl("/Student/StudentOfficial"), {
    method: "GET",
    credentials: "include",
  });

  console.log("Official details response status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch official details data: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log("Official details HTML length:", html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Helper function to get text content safely
  const getText = (selector: string): string => {
    const element = doc.querySelector(selector);
    return element?.textContent?.trim() || "";
  };

  // Extract official details data from the HTML
  const officialData: OfficialDetailsData = {
    // Official Details
    admissionNo: getText("#MCPH1_SCPH_lbladmissionNo"),
    accountId: getText("#MCPH1_SCPH_lblaccountID"),
    admissionDate: getText("#MCPH1_SCPH_lbladmissiondate"),
    status: getText("#MCPH1_SCPH_lblstatus"),
    session: getText("#MCPH1_SCPH_lblsession"),
    program: getText("#MCPH1_SCPH_lblprogram"),
    admSem: getText("#MCPH1_SCPH_lbladmSem"),
    currentSem: getText("#MCPH1_SCPH_lblcurrentSem"),
    groupName: getText("#MCPH1_SCPH_lblgroupName"),
    quota: getText("#MCPH1_SCPH_lblquota"),
    hostel: getText("#MCPH1_SCPH_lblhostel"),
    transport: getText("#MCPH1_SCPH_lblTransport"),
    officialMail: getText("#MCPH1_SCPH_lblOffMail"),

    // Registration Details
    name: getText("#MCPH1_SCPH_lblNa"),
    category: getText("#MCPH1_SCPH_lblcategory"),
    rollNo: getText("#MCPH1_SCPH_lblrollNo"),
    enrollmentNo: getText("#MCPH1_SCPH_lbkenrollmentNo"),
    regFormNo: getText("#MCPH1_SCPH_lblregformNo"),
    serialNo: getText("#MCPH1_SCPH_lblserialNo"),
    admThrough: getText("#MCPH1_SCPH_lblAdmthrough"),
    referenceBy: getText("#MCPH1_SCPH_lblReferenceBy"),
    lateralEntry: getText("#MCPH1_SCPH_lbllateralEntry"),
    xiiPcm: getText("#MCPH1_SCPH_lblXIIPCM"),
    xiiAgg: getText("#MCPH1_SCPH_lblXIIAGG"),
    mess: getText("#MCPH1_SCPH_lblmess"),

    // Mentor Details
    mentorName: getText("#MCPH1_SCPH_lblMentorName"),
    mentorCode: getText("#MCPH1_SCPH_lblMentorCode"),
    mentorMobile: getText("#MCPH1_SCPH_lblMobile"),
    mentorEmail: getText("#MCPH1_SCPH_lblEmail"),
    department: getText("#MCPH1_SCPH_lblDept"),
    mentorDesignation: getText("#MCPH1_SCPH_lblDesg"),
    cabinNo: getText("#MCPH1_SCPH_lblCabinNo"),
  };

  console.log("Parsed official details data:", officialData);

  return officialData;
}

export async function fetchQualificationData(payloadData: PayloadData): Promise<QualificationData> {
  console.log("fetchQualificationData called with payload:", payloadData);

  // First, fetch the qualification page with GET to get the form data
  const getResponse = await fetch(getApiUrl("/Student/StudentQualification"), {
    method: "GET",
    credentials: "include",
  });

  console.log("Qualification GET response status:", getResponse.status);

  if (!getResponse.ok) {
    throw new Error(`Failed to fetch qualification page: ${getResponse.status} ${getResponse.statusText}`);
  }

  const getHtml = await getResponse.text();
  const parser = new DOMParser();
  const getDoc = parser.parseFromString(getHtml, "text/html");

  // Extract form payload data from the GET response
  const viewstate = getDoc.querySelector('input[name="__VIEWSTATE"]')?.getAttribute("value") || "";
  const viewstateGenerator = getDoc.querySelector('input[name="__VIEWSTATEGENERATOR"]')?.getAttribute("value") || "";
  const viewstateEncrypted = getDoc.querySelector('input[name="__VIEWSTATEENCRYPTED"]')?.getAttribute("value") || "";
  const eventValidation = getDoc.querySelector('input[name="__EVENTVALIDATION"]')?.getAttribute("value") || "";
  const hdnStudentId = getDoc.querySelector('input[name="ctl00$ctl00$MCPH1$SCPH$hdnstdid"]')?.getAttribute("value") || "";
  const txtAdmNo = getDoc.querySelector('input[name="ctl00$ctl00$MCPH1$SCPH$txtadmno"]')?.getAttribute("value") || payloadData.hdnStudentId;

  console.log("Extracted form payload for POST request", {
    viewstateLength: viewstate.length,
    viewstateGenerator,
    viewstateEncrypted,
    hdnStudentId,
    txtAdmNo,
  });

  // Prepare POST request to fetch qualification data
  const formData = new URLSearchParams();
  formData.append("__VIEWSTATE", viewstate);
  formData.append("__VIEWSTATEGENERATOR", viewstateGenerator);
  formData.append("__VIEWSTATEENCRYPTED", viewstateEncrypted);
  formData.append("__EVENTVALIDATION", eventValidation);
  formData.append("ctl00$ctl00$hdnForSchoolMaster", "0");
  formData.append("ctl00$ctl00$txtCaseCSS", "textDefault");
  formData.append("ctl00$ctl00$MCPH1$SCPH$HiddenField1", "0");
  formData.append("ctl00$ctl00$MCPH1$SCPH$hdnstdid", hdnStudentId);
  formData.append("ctl00$ctl00$MCPH1$SCPH$txtadmno", txtAdmNo);
  formData.append("ctl00$ctl00$MCPH1$SCPH$btnsearchs", "Show");

  console.log("Sending qualification POST request...");

  // Send POST request to get qualification data
  const postResponse = await fetch(getApiUrl("/Student/StudentQualification"), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    credentials: "include",
  });

  console.log("Qualification POST response status:", postResponse.status);

  if (!postResponse.ok) {
    throw new Error(`Failed to fetch qualification data: ${postResponse.status} ${postResponse.statusText}`);
  }

  const postHtml = await postResponse.text();
  console.log("Qualification POST HTML length:", postHtml.length);
  const postDoc = parser.parseFromString(postHtml, "text/html");

  // Helper function to get text content safely
  const getText = (selector: string): string => {
    const element = postDoc.querySelector(selector);
    return element?.textContent?.trim() || "";
  };

  // Extract basic student info
  const qualificationData: QualificationData = {
    name: getText("#MCPH1_SCPH_lblNa"),
    admissionNo: getText("#MCPH1_SCPH_lbladmissionNo"),
    admissionDate: getText("#MCPH1_SCPH_lbladmissiondate"),
    status: getText("#MCPH1_SCPH_lblstatus"),
    session: getText("#MCPH1_SCPH_lblsession"),
    program: getText("#MCPH1_SCPH_lblprogram"),
    qualifications: [],
  };

  // Parse the qualification table
  const qualificationTable = postDoc.querySelector("#MCPH1_SCPH_GVQualification");
  if (qualificationTable) {
    const rows = qualificationTable.querySelectorAll("tr");

    // Skip the header row (index 0) and iterate through data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.querySelectorAll("td");

      if (cells.length >= 10) {
        const sno = cells[0].textContent?.trim() || "";
        const qualification = cells[1].textContent?.trim() || "";
        const subject = cells[2].textContent?.trim() || "";
        const college = cells[3].textContent?.trim() || "";
        const board = cells[4].textContent?.trim() || "";
        const medium = cells[5].textContent?.trim() || "";
        const yearPassing = cells[6].textContent?.trim() || "";
        const percentage = cells[7].textContent?.trim() || "";
        const grade = cells[8].textContent?.trim() || "";
        const cgpa = cells[9].textContent?.trim() || "";

        // Only add records with actual qualification data (skip empty rows)
        if (qualification && qualification !== "") {
          qualificationData.qualifications.push({
            sno,
            qualification,
            subject,
            college,
            board,
            medium,
            yearPassing,
            percentage,
            grade,
            cgpa,
          });
        }
      }
    }
  }

  console.log("Parsed qualification data:", qualificationData);

  return qualificationData;
}
