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
            "error"
          ).innerText = "";

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

          document.getElementById(
            "weeklyWorked"
          ).innerText =
            response.weeklyWorked;

          document.getElementById(
            "weeklyRemaining"
          ).innerText =
            response.weeklyRemaining;

          document.getElementById(
            "weeklyTarget"
          ).innerText =
            response.weeklyTarget;
        }
      );
    }
  );
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const manifest =
      chrome.runtime.getManifest();

    document.getElementById(
      "version"
    ).innerText =
      `Version ${manifest.version}`;

    chrome.storage.sync.get(
      [
        "requiredHours",
        "workingDays"
      ],
      result => {

        document.getElementById(
          "requiredHours"
        ).value =
          result.requiredHours || 8;

        document.getElementById(
          "workingDays"
        ).value =
          result.workingDays || 5;
      }
    );

    loadAttendanceData();

    document
      .getElementById(
        "saveHours"
      )
      .addEventListener(
        "click",
        () => {

          const requiredHours =
            parseFloat(
              document.getElementById(
                "requiredHours"
              ).value
            );

          const workingDays =
            parseInt(
              document.getElementById(
                "workingDays"
              ).value
            );

          chrome.storage.sync.set(
            {
              requiredHours,
              workingDays
            },
            () => {

              document.getElementById(
                "savedMessage"
              ).innerText =
                "Saved ✓";

              setTimeout(() => {

                document.getElementById(
                  "savedMessage"
                ).innerText = "";

              }, 1500);

              loadAttendanceData();
            }
          );
        }
      );
  }
);