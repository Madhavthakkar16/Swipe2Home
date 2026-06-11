function loadAttendanceData() {

  const error =
    document.getElementById(
      "error"
    );

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
            chrome.runtime.lastError
          ) {

            document.getElementById(
              "attendanceWarning"
            ).style.display =
              "none";

            error.innerText =
              "Open a Keka page or refresh the current tab.";

            return;
          }

          if (
            !response ||
            !response.success
          ) {

            if (
              response?.needsAttendancePage
            ) {

              document.getElementById(
                "attendanceWarning"
              ).style.display =
                "block";

              error.innerText =
                "";

              return;
            }

            document.getElementById(
              "attendanceWarning"
            ).style.display =
              "none";

            error.innerText =
              response?.message ||
              "Unable to fetch data.";

            return;
          }

          document.getElementById(
            "attendanceWarning"
          ).style.display =
            "none";

          error.innerText =
            "";

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

console.log("Interval started");

setInterval(() => {

  console.log(
    "Refreshing...",
    new Date().toLocaleTimeString()
  );

  loadAttendanceData();

}, 3000);

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

          if (
            isNaN(
              requiredHours
            ) ||
            isNaN(
              workingDays
            )
          ) {

            document.getElementById(
              "savedMessage"
            ).innerText =
              "Enter valid values";

            return;
          }

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

              setTimeout(
                () => {

                  document.getElementById(
                    "savedMessage"
                  ).innerText =
                    "";

                },
                1500
              );

              loadAttendanceData();
            }
          );
        }
      );

    document
      .getElementById(
        "openAttendancePage"
      )
      ?.addEventListener(
        "click",
        () => {

          document.getElementById(
            "leaveTime"
          ).innerText =
            "--";

          document.getElementById(
            "punchIn"
          ).innerText =
            "--";

          document.getElementById(
            "breakTime"
          ).innerText =
            "--";

          document.getElementById(
            "weeklyWorked"
          ).innerText =
            "--";

          document.getElementById(
            "weeklyRemaining"
          ).innerText =
            "--";

          document.getElementById(
            "weeklyTarget"
          ).innerText =
            "--";

          chrome.tabs.query(
            {
              active: true,
              currentWindow: true
            },
            tabs => {

              const currentUrl =
                new URL(
                  tabs[0].url
                );

              chrome.tabs.update(
                tabs[0].id,
                {
                  url:
                    currentUrl.origin +
                    "/#/me/attendance/logs"
                }
              );
            }
          );
        }
      );
  }
);