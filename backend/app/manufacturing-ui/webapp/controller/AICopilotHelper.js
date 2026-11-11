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

            var oComponent = null;
            if (sap.ui.core.Component && sap.ui.core.Component.registry) {
                oComponent = Array.from(sap.ui.core.Component.registry.filter(function (c) {
                    return c.getMetadata().getName() === "manufacturingui.Component";
                }))[0];
            }

            var fnCreateView = function () {
                return XMLView.create({
                    viewName: "manufacturingui.view.AICopilot"
                });
            };

            var pView = oComponent ? oComponent.runAsOwner(fnCreateView) : fnCreateView();

            pView.then(function (oView) {
                oDialog = new Dialog({
                    title: "SAP Manufacturing AI Copilot",
                    contentWidth: "760px",
                    contentHeight: "82vh",
                    horizontalPadding: false,
                    verticalPadding: false,
                    showHeader: false, // Custom header provided in View
                    verticalScrolling: false, // Internal ScrollContainer handles scrolling
                    horizontalScrolling: false,
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

                // Self-healing: if session storage has invalid markup, clear it and retry view creation
                try {
                    sessionStorage.removeItem("sap_manufacturing_copilot_history");
                } catch (e) {}

                XMLView.create({
                    viewName: "manufacturingui.view.AICopilot"
                }).then(function (oCleanView) {
                    oDialog = new Dialog({
                        title: "SAP Manufacturing AI Copilot",
                        contentWidth: "760px",
                        contentHeight: "82vh",
                        horizontalPadding: false,
                        verticalPadding: false,
                        showHeader: false,
                        verticalScrolling: false,
                        horizontalScrolling: false,
                        content: [oCleanView],
                        beforeOpen: function () {
                            hideFab();
                        },
                        afterClose: function () {
                            showFab();
                        }
                    });

                    oDialog.addStyleClass("copilot-dialog");
                    oDialog.open();
                }).catch(function (retryErr) {
                    console.error("Self-healing retry failed:", retryErr);
                });
            });
        }
    };
});
