sap.ui.define([
    "sap/ui/core/mvc/XMLView",
    "sap/m/Dialog"
], function (XMLView, Dialog) {
    "use strict";

    var oDialog = null;

    function hideFab() {
        var fab = document.getElementById("jouleCopilotFab");
        if (fab) {
            fab.style.display = "none";
        }
    }

    function showFab() {
        var fab = document.getElementById("jouleCopilotFab");
        if (fab) {
            fab.style.display = "flex";
        }
    }

    function attachResizeHandle(dialog) {
        var dom = dialog.getDomRef();
        if (!dom || dom.querySelector(".copilot-resize-handle")) {
            return;
        }

        var handle = document.createElement("div");
        handle.className = "copilot-resize-handle";
        handle.title = "Drag left/right to resize panel width";
        dom.appendChild(handle);

        var isResizing = false;

        handle.addEventListener("mousedown", function (e) {
            isResizing = true;
            handle.classList.add("resizing");
            document.body.style.cursor = "ew-resize";
            document.body.style.userSelect = "none";
            e.preventDefault();
        });

        window.addEventListener("mousemove", function (e) {
            if (!isResizing) return;
            var newWidth = window.innerWidth - e.clientX;
            if (newWidth < 460) newWidth = 460;
            if (newWidth > window.innerWidth - 60) newWidth = window.innerWidth - 60;
            dom.style.setProperty("width", newWidth + "px", "important");
        });

        window.addEventListener("mouseup", function () {
            if (isResizing) {
                isResizing = false;
                handle.classList.remove("resizing");
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
            }
        });
    }

    return {
        openCopilotDialog: function () {
            hideFab();

            if (oDialog) {
                oDialog.open();
                setTimeout(function () {
                    attachResizeHandle(oDialog);
                }, 100);
                return;
            }

            XMLView.create({
                viewName: "manufacturingui.view.AICopilot"
            }).then(function (oView) {
                oDialog = new Dialog({
                    title: "SAP Manufacturing AI Copilot",
                    contentWidth: "620px",
                    contentHeight: "100%",
                    horizontalPadding: false,
                    verticalPadding: false,
                    showHeader: false, // View contains its own custom header and footer
                    verticalScrolling: false,   // Allow internal ScrollContainer to scroll
                    horizontalScrolling: false, // Prevent outer scroll clipping
                    content: [oView],
                    beforeOpen: function () {
                        hideFab();
                    },
                    afterOpen: function () {
                        attachResizeHandle(oDialog);
                    },
                    afterClose: function () {
                        showFab();
                    }
                });

                oDialog.addStyleClass("copilot-dialog");
                oDialog.open();
            }).catch(function (err) {
                showFab();
                console.error("Error creating AI Copilot View:", err);
            });
        }
    };
});
