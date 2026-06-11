function parseTime(timeStr) {
  const now = new Date();

  const [time, meridian] = timeStr.split(" ");

  let [hours, minutes, seconds] =
    time.split(":").map(Number);

  if (
    meridian === "PM" &&
    hours !== 12
  ) {
    hours += 12;
  }

  if (
    meridian === "AM" &&
    hours === 12
  ) {
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

  const totalSeconds =
    Math.floor(ms / 1000);

  const hours =
    Math.floor(totalSeconds / 3600);

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const seconds =
    totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

function formatMinutes(totalMinutes) {

  const hours =
    Math.floor(totalMinutes / 60);

  const minutes =
    totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

function formatTime(date) {

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }
  );
}

function parseHoursText(text) {

  const hours =
    parseInt(
      text.match(/(\d+)h/)?.[1] || 0
    );

  const minutes =
    parseInt(
      text.match(/(\d+)m/)?.[1] || 0
    );

  return (
    hours * 60 +
    minutes
  );
}

function calculateWeeklyWorkedMinutes() {

  const rows = [
    ...document.querySelectorAll(
      ".attendance-logs-row"
    )
  ];

  const dayOrder = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5
  };

  let totalMinutes = 0;

  let previousDayValue = null;

  for (const row of rows) {

    const dayLabel =
      row.querySelector(".mr-8")
        ?.innerText
        ?.trim() || "";

    const dayName =
      dayLabel.split(",")[0];

    const currentDayValue =
      dayOrder[dayName];

    if (
      previousDayValue !== null &&
      currentDayValue > previousDayValue
    ) {
      break;
    }

    previousDayValue =
      currentDayValue;

    const spans =
      [...row.querySelectorAll(".w-50 span")]
        .map(x => x.innerText.trim())
        .filter(Boolean);

    const effectiveHours =
      spans[0];

    if (
      /\d+h\s+\d+m/.test(
        effectiveHours
      )
    ) {
      totalMinutes +=
        parseHoursText(
          effectiveHours
        );
    }
  }

  return totalMinutes;
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
      .map(el =>
        el.textContent.trim()
      )
      .filter(text =>
        /\d{1,2}:\d{2}:\d{2}\s?(AM|PM)/i.test(
          text
        )
      );
  }

  if (
    logs.length === 0
  ) {

    const attendanceRow =
      document.querySelector(
        ".attendance-logs-row [dropdowntoggle]"
      );

    if (
      attendanceRow
    ) {

      attendanceRow.click();

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            1000
          )
      );

      logs = [
        ...todayRow.querySelectorAll(
          ".d-flex.mt-10.ng-star-inserted span.ng-star-inserted"
        )
      ]
        .map(el =>
          el.textContent.trim()
        )
        .filter(text =>
          /\d{1,2}:\d{2}:\d{2}\s?(AM|PM)/i.test(
            text
          )
        );
    }
  }

  if (
    logs.length === 0
  ) {
    return {
      success: false,
      message:
        "Could not find attendance logs."
    };
  }

  const punches =
    logs
      .map(parseTime)
      .sort(
        (a, b) =>
          a - b
      );

  const punchIn =
    punches[0];

  let totalBreakMs = 0;

  for (
    let i = 1;
    i < punches.length - 1;
    i += 2
  ) {

    totalBreakMs +=
      punches[i + 1] -
      punches[i];
  }

  const settings =
    await chrome.storage.sync.get([
      "requiredHours",
      "workingDays"
    ]);

  const requiredHours =
    settings.requiredHours || 8;

  const workingDays =
    settings.workingDays || 5;

  const leaveTime =
    new Date(
      punchIn.getTime() +
      (
        requiredHours *
        60 *
        60 *
        1000
      ) +
      totalBreakMs
    );

  const weeklyWorkedMinutes =
    calculateWeeklyWorkedMinutes();

  const weeklyTargetMinutes =
    requiredHours *
    workingDays *
    60;

  const weeklyRemainingMinutes =
    Math.max(
      0,
      weeklyTargetMinutes -
      weeklyWorkedMinutes
    );

  return {

    success: true,

    punchIn:
      formatTime(
        punchIn
      ),

    breakTime:
      formatDuration(
        totalBreakMs
      ),

    leaveTime:
      formatTime(
        leaveTime
      ),

    weeklyWorked:
      formatMinutes(
        weeklyWorkedMinutes
      ),

    weeklyRemaining:
      formatMinutes(
        weeklyRemainingMinutes
      ),

    weeklyTarget:
      formatMinutes(
        weeklyTargetMinutes
      ),

    logs
  };
}

chrome.runtime.onMessage.addListener(
  (
    request,
    sender,
    sendResponse
  ) => {

    if (
      request.action ===
      "getAttendanceData"
    ) {

      calculateAttendance()
        .then(
          sendResponse
        );

      return true;
    }
  }
);