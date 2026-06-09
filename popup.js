function loadAttendanceData() {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    tabs => {

      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "getAttendanceData"
        },
        response => {

          if (
            !response ||
            !response.success
          ) {

            document.getElementById(
              "error"
            ).innerText =
              response?.message ||
              "Open a Keka page first or Refresh if already open.";

            return;
          }

          document.getElementById(
            "punchIn"
          ).innerText =
            response.punchIn;

          document.getElementById(
            "breakTime"
          ).innerText =
            response.breakTime;

          document.getElementById(
            "leaveTime"
          ).innerText =
            response.leaveTime;
        }
      );
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {

  const manifest = chrome.runtime.getManifest();

document.getElementById(
  "version"
).innerText =
  `Version ${manifest.version}`;

  chrome.storage.sync.get(
    ["requiredHours"],
    result => {

      document.getElementById(
        "requiredHours"
      ).value =
        result.requiredHours || 8;
    }
  );

  // Initial calculation
  loadAttendanceData();

  document
    .getElementById("saveHours")
    .addEventListener("click", () => {

      const hours = parseFloat(
        document.getElementById(
          "requiredHours"
        ).value
      );

      chrome.storage.sync.set(
        {
          requiredHours: hours
        },
        () => {

          // Recalculate immediately
          loadAttendanceData();
        }
      );
    });
});