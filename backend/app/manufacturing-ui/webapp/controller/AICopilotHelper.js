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

    return {
        openCopilotDialog: function () {
            hideFab();

            if (oDialog) {
                oDialog.open();
                return;
            }

            XMLView.create({
                viewName: "manufacturingui.view.AICopilot"
            }).then(function (oView) {
                oDialog = new Dialog({
                    title: "SAP Manufacturing AI Copilot",
                    contentWidth: "540px",
                    contentHeight: "100%",
                    horizontalPadding: false,
                    verticalPadding: false,
                    showHeader: false, // View has its own header and footer
                    content: [oView],
                    beforeOpen: function () {
                        hideFab();
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
