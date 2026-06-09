function parseTime(timeStr) {
  const now = new Date();

  const [time, meridian] = timeStr.split(" ");

  let [hours, minutes, seconds] = time
    .split(":")
    .map(Number);

  if (meridian === "PM" && hours !== 12) {
    hours += 12;
  }

  if (meridian === "AM" && hours === 12) {
    hours = 0;
  }

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    seconds
  );
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
}

async function calculateAttendance() {

  const todayRow =
  document.querySelector(
    ".attendance-logs-row"
  );

let logs = [];

if (todayRow) {

  logs = [
    ...todayRow.querySelectorAll(
      ".d-flex.mt-10.ng-star-inserted span.ng-star-inserted"
    )
  ]
    .map(el => el.textContent.trim())
    .filter(text =>
      /\d{1,2}:\d{2}:\d{2}\s?(AM|PM)/i.test(text)
    );
}

  // Logs not loaded yet
  if (logs.length === 0) {

    const attendanceRow =
      document.querySelector(
        ".attendance-logs-row [dropdowntoggle]"
      );

    if (attendanceRow) {

      attendanceRow.click();

      await new Promise(resolve =>
        setTimeout(resolve, 1000)
      );

      logs = [
  ...todayRow.querySelectorAll(
    ".d-flex.mt-10.ng-star-inserted span.ng-star-inserted"
  )
]
  .map(el => el.textContent.trim())
  .filter(text =>
    /\d{1,2}:\d{2}:\d{2}\s?(AM|PM)/i.test(text)
  );
    }
  }

  if (logs.length === 0) {
    return {
      success: false,
      message: "Could not find attendance logs."
    };
  }

const punches = logs
  .map(parseTime)
  .sort((a, b) => a - b);

const punchIn = punches[0];

let totalBreakMs = 0;

// Every odd index = OUT
// Every even index after that = IN
for (
  let i = 1;
  i < punches.length - 1;
  i += 2
) {
  totalBreakMs += punches[i + 1] - punches[i];
}

  const settings =
  await chrome.storage.sync.get(
    ["requiredHours"]
  );

const requiredHours =
  settings.requiredHours || 8;

const leaveTime = new Date(
  punchIn.getTime() +
  (requiredHours *
    60 *
    60 *
    1000) +
  totalBreakMs
);

  return {
    success: true,
    punchIn: formatTime(punchIn),
    breakTime: formatDuration(totalBreakMs),
    leaveTime: formatTime(leaveTime),
    logs
  };
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {

    if (request.action === "getAttendanceData") {

      calculateAttendance()
        .then(sendResponse);

      return true;
    }
  }
);