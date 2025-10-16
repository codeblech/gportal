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

export interface PayloadData {
  __VIEWSTATE: string;
  __VIEWSTATEGENERATOR: string;
  __EVENTVALIDATION: string;
  hdnStudentId: string;
}

export async function fetchAttendanceData(payloadData: PayloadData): Promise<AttendanceRecord[]> {
  console.log('fetchAttendanceData called with payload:', payloadData);

  // Prepare form data with all required fields
  const formData = new URLSearchParams();
  formData.append('__VIEWSTATE', payloadData.__VIEWSTATE);
  formData.append('__VIEWSTATEGENERATOR', payloadData.__VIEWSTATEGENERATOR);
  formData.append('__EVENTVALIDATION', payloadData.__EVENTVALIDATION);
  formData.append('ctl00$ctl00$hdnForSchoolMaster', '0');
  formData.append('ctl00$ctl00$txtCaseCSS', 'textDefault');
  formData.append('ctl00$ctl00$MCPH1$SCPH$hdnStudentId', payloadData.hdnStudentId);
  formData.append('ctl00$ctl00$MCPH1$SCPH$btntodayAtt', 'Today Attendance');
  formData.append('ctl00$ctl00$MCPH1$SCPH$txtDFrom', '');
  formData.append('ctl00$ctl00$MCPH1$SCPH$txtDTo', '');
  formData.append('ctl00$ctl00$MCPH1$SCPH$txtFrom', '');
  formData.append('ctl00$ctl00$MCPH1$SCPH$txtTo', '');

  console.log('Sending attendance POST request...');
  console.log('Attendance form data:', formData.toString().substring(0, 200) + '...');

  const response = await fetch('/api/glbajaj/Student/TodayAttendence', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
    credentials: 'include',
  });

  console.log('Attendance response status:', response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch attendance data: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log('Attendance HTML length:', html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Parse the attendance table
  const attendanceRecords: AttendanceRecord[] = [];
  const table = doc.querySelector('#MCPH1_SCPH_gvDailyAttendence1');

  console.log('Table found:', !!table);

  if (table) {
    const rows = table.querySelectorAll('tr');
    console.log('Total rows:', rows.length);

    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('td');
      console.log(`Row ${i} cells:`, cells.length);

      if (cells.length >= 8) {
        const record = {
          srNo: cells[0]?.textContent?.trim() || '',
          year: cells[1]?.textContent?.trim() || '',
          course: cells[2]?.textContent?.trim() || '',
          semester: cells[3]?.textContent?.trim() || '',
          subject: cells[4]?.textContent?.trim() || '',
          time: cells[5]?.textContent?.trim() || '',
          type: cells[6]?.textContent?.trim() || '',
          status: cells[7]?.textContent?.trim() || '',
        };
        console.log(`Parsed record ${i}:`, record);
        attendanceRecords.push(record);
      }
    }
  } else {
    console.error('Table with ID MCPH1_SCPH_gvDailyAttendence1 not found');
    console.log('Document body:', doc.body?.innerHTML.substring(0, 500));
  }

  console.log('Total attendance records parsed:', attendanceRecords.length);
  return attendanceRecords;
}

export async function fetchMonthlyAttendanceData(payloadData: PayloadData): Promise<MonthlyAttendanceRecord[]> {
  console.log('fetchMonthlyAttendanceData called with payload:', payloadData);

  // Prepare form data with all required fields for monthly attendance
  const formData = new URLSearchParams();
  formData.append('__VIEWSTATE', payloadData.__VIEWSTATE);
  formData.append('__VIEWSTATEGENERATOR', payloadData.__VIEWSTATEGENERATOR);
  formData.append('__EVENTVALIDATION', payloadData.__EVENTVALIDATION);
  formData.append('ctl00$ctl00$hdnForSchoolMaster', '0');
  formData.append('ctl00$ctl00$txtCaseCSS', 'textDefault');
  formData.append('ctl00$ctl00$MCPH1$SCPH$hdnStudentId', payloadData.hdnStudentId);
  formData.append('ctl00$ctl00$MCPH1$SCPH$btnMonthlyAtt', 'Monthly Attendance');
  formData.append('ctl00$ctl00$MCPH1$SCPH$txtDFrom', '');
  formData.append('ctl00$ctl00$MCPH1$SCPH$txtDTo', '');
  formData.append('ctl00$ctl00$MCPH1$SCPH$txtFrom', '');
  formData.append('ctl00$ctl00$MCPH1$SCPH$txtTo', '');

  console.log('Sending monthly attendance POST request...');

  const response = await fetch('/api/glbajaj/Student/TodayAttendence', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
    credentials: 'include',
  });

  console.log('Monthly attendance response status:', response.status);

  if (!response.ok) {
    throw new Error(`Failed to fetch monthly attendance data: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log('Monthly attendance HTML length:', html.length);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Parse the monthly attendance table
  const monthlyRecords: MonthlyAttendanceRecord[] = [];
  const table = doc.querySelector('#MCPH1_SCPH_gvMonthly');

  console.log('Monthly table found:', !!table);

  if (table) {
    const rows = table.querySelectorAll('tr');
    console.log('Monthly total rows:', rows.length);

    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('td');
      console.log(`Monthly row ${i} cells:`, cells.length);

      if (cells.length >= 6) {
        // Extract percentage from the span inside the 6th cell
        const percentageSpan = cells[5]?.querySelector('span');
        const percentageText = percentageSpan?.textContent?.trim() || '';

        const record = {
          srNo: cells[0]?.textContent?.trim() || '',
          year: cells[1]?.textContent?.trim() || '',
          course: cells[2]?.textContent?.trim() || '',
          semester: cells[3]?.textContent?.trim() || '',
          month: cells[4]?.textContent?.trim() || '',
          percentage: percentageText,
        };
        console.log(`Parsed monthly record ${i}:`, record);
        monthlyRecords.push(record);
      }
    }
  } else {
    console.error('Table with ID MCPH1_SCPH_gvMonthly not found');
  }

  console.log('Total monthly attendance records parsed:', monthlyRecords.length);
  return monthlyRecords;
}
