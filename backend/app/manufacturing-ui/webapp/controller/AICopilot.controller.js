sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    var STORAGE_KEY = "sap_manufacturing_copilot_history";

    return Controller.extend("manufacturingui.controller.AICopilot", {
        onInit: function () {
            var aInitialMessages = this._loadSavedChat();

            var oChatModel = new JSONModel({
                messages: aInitialMessages,
                currentInput: "",
                isThinking: false,
                isMaximized: false,
                showSuggestions: false
            });

            this.getView().setModel(oChatModel, "chat");
        },

        onAfterRendering: function () {
            var oInput = this.byId("questionInput");
            if (oInput) {
                var fnOnEnter = function (e) {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.onSendMessage();
                    }
                }.bind(this);

                oInput.attachBrowserEvent("keydown", fnOnEnter);
                var oDomRef = oInput.getDomRef();
                if (oDomRef) {
                    var oTextarea = oDomRef.querySelector("textarea") || oDomRef;
                    oTextarea.addEventListener("keydown", fnOnEnter);
                }
            }

            // Clicking input wrapper automatically focuses the textarea cursor
            var oViewDom = this.getView().getDomRef();
            if (oViewDom) {
                var oInputWrapper = oViewDom.querySelector(".copilot-inline-input-wrapper");
                if (oInputWrapper && !oInputWrapper._hasClickFocus) {
                    oInputWrapper._hasClickFocus = true;
                    oInputWrapper.addEventListener("click", function () {
                        this._focusInput();
                    }.bind(this));
                }
            }

            // Focus input immediately so cursor is visible initially
            setTimeout(function () {
                this._focusInput();
            }.bind(this), 80);
            setTimeout(function () {
                this._focusInput();
            }.bind(this), 250);
            setTimeout(function () {
                this._focusInput();
            }.bind(this), 500);

            // Delegated click handler for Production Order deep links
            var oScroll = this.byId("chatScroll");
            if (oScroll) {
                var oDom = oScroll.getDomRef();
                if (oDom && !oDom._hasOrderLinkHandler) {
                    oDom._hasOrderLinkHandler = true;
                    oDom.addEventListener("click", function (e) {
                        var oTarget = e.target.closest(".copilot-order-link");
                        if (oTarget) {
                            e.preventDefault();
                            var sOrderNumber = oTarget.getAttribute("data-order-number");
                            if (sOrderNumber) {
                                this._navigateToOrder(sOrderNumber);
                            }
                        }
                    }.bind(this));
                }
            }

            this._scrollToBottom();
        },

        _focusInput: function () {
            var oInput = this.byId("questionInput");
            if (oInput) {
                var oDom = oInput.getFocusDomRef() || (oInput.getDomRef() ? oInput.getDomRef().querySelector("textarea") : null);
                if (oDom && typeof oDom.focus === "function") {
                    try {
                        oDom.focus({ preventScroll: true });
                    } catch (e) {
                        try { oDom.focus(); } catch (err) {}
                    }
                }
            }
        },

        onSendMessage: async function () {
            var oModel = this.getView().getModel("chat");
            var oInput = this.byId("questionInput");

            // Extract question from control directly or model
            var sQuestion = "";
            if (oInput && typeof oInput.getValue === "function") {
                sQuestion = oInput.getValue();
            }
            if (!sQuestion) {
                sQuestion = oModel.getProperty("/currentInput") || "";
            }
            sQuestion = (sQuestion || "").trim();

            if (!sQuestion) {
                return;
            }

            // Clear input immediately so placeholder appears
            oModel.setProperty("/currentInput", "");
            if (oInput && typeof oInput.setValue === "function") {
                oInput.setValue("");
            }

            var aMessages = (oModel.getProperty("/messages") || []).slice();

            // Build conversation history (up to last 6 meaningful turns) for multi-turn memory
            var aHistory = aMessages
                .filter(function (m) {
                    return m.text && !m.text.startsWith("Error:") && !m.text.startsWith("Hello! I am your SAP");
                })
                .slice(-6)
                .map(function (m) {
                    return {
                        role: m.sender === "User" ? "user" : "model",
                        text: m.text
                    };
                });

            // 1. Add User message
            aMessages.push({
                sender: "User",
                timestamp: this._getTimeString(),
                text: sQuestion,
                html: "",
                tools: []
            });

            oModel.setProperty("/messages", aMessages);
            oModel.setProperty("/currentInput", "");
            oModel.setProperty("/isThinking", true);
            oModel.refresh(true);
            this._persistChat(aMessages);
            this._scrollToBottom();

            // 2. Call backend agent API with question & multi-turn history
            try {
                var response = await fetch("/odata/v4/knowledge/askAgent", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        question: sQuestion,
                        history: JSON.stringify(aHistory)
                    })
                });

                if (!response.ok) {
                    var errorText = await response.text();
                    try {
                        var parsedErr = JSON.parse(errorText);
                        if (parsedErr.error && parsedErr.error.message) {
                            errorText = parsedErr.error.message;
                        }
                    } catch (e) {}
                    throw new Error(errorText);
                }

                var data = await response.json();
                var result = typeof data.value === "string" ? JSON.parse(data.value) : data.value;

                var sAnswer = result.answer || "No response received.";
                var aTools = result.toolsExecuted || [];
                var oPendingAction = result.pendingAction || null;
                var sHtml = this._formatMarkdown(sAnswer);

                aMessages = (oModel.getProperty("/messages") || []).slice();
                aMessages.push({
                    sender: "Manufacturing AI Copilot",
                    timestamp: this._getTimeString(),
                    text: sAnswer,
                    html: sHtml,
                    tools: aTools,
                    pendingAction: oPendingAction
                });

                oModel.setProperty("/messages", aMessages);
                oModel.refresh(true);
                this._persistChat(aMessages);

            } catch (err) {
                console.error("AI Copilot request failed:", err);
                aMessages = (oModel.getProperty("/messages") || []).slice();
                aMessages.push({
                    sender: "Manufacturing AI Copilot",
                    timestamp: this._getTimeString(),
                    text: "Error: " + err.message,
                    html: "<div class='copilot-error-banner'>⚠️ <strong>Unable to process request:</strong> " + this._escapeHtml(err.message) + "</div>",
                    tools: []
                });
                oModel.setProperty("/messages", aMessages);
                oModel.refresh(true);
                this._persistChat(aMessages);
            } finally {
                oModel.setProperty("/isThinking", false);
                this._scrollToBottom();
            }
        },

        onSuggestionPress: function (oEvent) {
            var sText = oEvent.getSource().getText();
            var oModel = this.getView().getModel("chat");
            oModel.setProperty("/currentInput", sText);
            this.onSendMessage();
        },

        onToggleSuggestions: function () {
            var oModel = this.getView().getModel("chat");
            var bCurrent = oModel.getProperty("/showSuggestions");
            oModel.setProperty("/showSuggestions", !bCurrent);
        },

        onToggleMaximize: function () {
            var oModel = this.getView().getModel("chat");
            var bMax = !oModel.getProperty("/isMaximized");
            oModel.setProperty("/isMaximized", bMax);

            var oDialog = this.getView().getParent();
            if (oDialog && oDialog.addStyleClass) {
                if (bMax) {
                    oDialog.addStyleClass("copilot-dialog-maximized");
                } else {
                    oDialog.removeStyleClass("copilot-dialog-maximized");
                }
            }
            this._scrollToBottom();
        },

        onClearChat: function () {
            var oModel = this.getView().getModel("chat");
            try {
                sessionStorage.removeItem(STORAGE_KEY);
            } catch (e) {}

            var aDefault = [this._getWelcomeMessage()];
            oModel.setProperty("/messages", aDefault);
            oModel.refresh(true);
            this._scrollToBottom();
        },

        onClose: function () {
            var oDialog = this.getView().getParent();
            if (oDialog && typeof oDialog.close === "function") {
                oDialog.close();
            }
        },

        _getTimeString: function () {
            var now = new Date();
            return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        },

        _scrollToBottom: function () {
            var fnScroll = function () {
                var oScroll = this.byId("chatScroll");
                if (oScroll) {
                    if (typeof oScroll.scrollTo === "function") {
                        oScroll.scrollTo(0, 999999, 150);
                    }
                    var dom = oScroll.getDomRef();
                    if (dom) {
                        var scrollable = dom.querySelector(".sapMScrollContScroll") || dom;
                        scrollable.scrollTop = scrollable.scrollHeight;
                    }
                }
                // Keep pinned top header bar visible by resetting any ancestor scroll offset
                var oViewDom = this.getView().getDomRef();
                if (oViewDom) {
                    oViewDom.scrollTop = 0;
                    var oMainVbox = oViewDom.querySelector(".copilot-main-vbox");
                    if (oMainVbox) oMainVbox.scrollTop = 0;
                    var oDlgCont = oViewDom.closest(".sapMDialogScrollCont");
                    if (oDlgCont) oDlgCont.scrollTop = 0;
                }
                this._focusInput();
            }.bind(this);

            setTimeout(fnScroll, 50);
            setTimeout(fnScroll, 200);
            setTimeout(fnScroll, 500);
        },

        _persistChat: function (aMessages) {
            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(aMessages));
            } catch (e) {
                console.warn("Could not save copilot chat history:", e);
            }
        },

        _loadSavedChat: function () {
            try {
                var sSaved = sessionStorage.getItem(STORAGE_KEY);
                if (sSaved) {
                    var parsed = JSON.parse(sSaved);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        return parsed.map(function (m) {
                            if (m && m.sender !== "User") {
                                var sContent = (m.html || m.text || "").trim();
                                if (!sContent.startsWith("<div")) {
                                    sContent = "<div class='copilot-html-root'>" + sContent + "</div>";
                                }
                                m.html = sContent;
                                if (m.pendingAction && m.pendingAction.busy) {
                                    m.pendingAction.busy = false;
                                }
                            }
                            return m;
                        });
                    }
                }
            } catch (e) {
                console.warn("Could not parse saved chat, resetting:", e);
                try {
                    sessionStorage.removeItem(STORAGE_KEY);
                } catch (ex) {}
            }
            return [this._getWelcomeMessage()];
        },

        _getWelcomeMessage: function () {
            return {
                sender: "Manufacturing AI Copilot",
                timestamp: this._getTimeString(),
                text: "Hello! I am your SAP Manufacturing AI Copilot. How can I assist you with production orders or standard operating procedures today?",
                html: "<div class='copilot-welcome-card'>" +
                    "<div class='copilot-welcome-title'>👋 Hello! I am your SAP Manufacturing AI Copilot</div>" +
                    "<div class='copilot-welcome-subtitle'>I have live access to <strong>SAP S/4HANA production orders</strong> and <strong>manufacturing SOP documents</strong> via Vector AI.</div>" +
                    "<div class='copilot-welcome-prompt-label'>💡 Example questions you can ask:</div>" +
                    "<ul class='copilot-welcome-prompts'>" +
                    "<li>🔍 <em>\"Get details of order 1000001\"</em></li>" +
                    "<li>⚠️ <em>\"Which production orders are delayed?\"</em></li>" +
                    "<li>📋 <em>\"What is the SOP for material shortages?\"</em></li>" +
                    "<li>🔧 <em>\"How do I handle an emergency machine breakdown?\"</em></li>" +
                    "</ul>" +
                    "</div>",
                tools: []
            };
        },

        _escapeHtml: function (text) {
            if (!text) return "";
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        },

        _formatMarkdown: function (markdown) {
            if (!markdown) return "<div class='copilot-html-root'></div>";

            // 1. Escape HTML
            var html = this._escapeHtml(markdown);

            // 2. Format Markdown Tables
            var tableRegex = /((?:\|[^\n]+\|\r?\n?)+)/g;
            html = html.replace(tableRegex, function (tableBlock) {
                var lines = tableBlock.trim().split(/\r?\n/);
                if (lines.length < 2) return tableBlock;

                var res = "<div class='copilot-table-wrapper'><table class='copilot-table'>";
                var isHeader = true;

                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (!line || !line.startsWith("|")) continue;

                    // Separator row like | :--- | :--- |
                    if (/^\|[\s\-:|]+\|$/.test(line)) {
                        isHeader = false;
                        continue;
                    }

                    var rawCells = line.split("|").slice(1, -1);
                    res += "<tr>";
                    for (var c = 0; c < rawCells.length; c++) {
                        var tag = isHeader ? "th" : "td";
                        var cellContent = rawCells[c].trim();

                        if (!isHeader) {
                            cellContent = this._formatBadges(cellContent);
                            cellContent = cellContent.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                            cellContent = cellContent.replace(/`([^`]+)`/g, "<code class='copilot-code'>$1</code>");
                        }

                        res += "<" + tag + ">" + cellContent + "</" + tag + ">";
                    }
                    res += "</tr>";
                }
                res += "</table></div>";
                return res;
            }.bind(this));

            // 3. Format Horizontal Rules (--- or ***)
            html = html.replace(/^\s*(?:---|\*\*\*)\s*$/gim, "<hr class='copilot-divider' />");

            // 4. Format Markdown Headers
            html = html.replace(/^### (.*$)/gim, "<h4 class='copilot-h4'>$1</h4>");
            html = html.replace(/^## (.*$)/gim, "<h3 class='copilot-h3'>$1</h3>");
            html = html.replace(/^# (.*$)/gim, "<h2 class='copilot-h2'>$1</h2>");

            // 5. Format Callout Notes: (Note: ...) or Note: ...
            html = html.replace(/\((Note:[^)]+)\)/gi, "<div class='copilot-callout-note'>ℹ️ $1</div>");

            // 6. Format Bold and Italics
            html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

            // 7. Format Inline Code
            html = html.replace(/`([^`]+)`/g, "<code class='copilot-code'>$1</code>");

            // 8. Format Numbered Lists: 1. Item
            html = html.replace(/^\s*(\d+)\.\s+(.*$)/gim, "<li class='copilot-oli' value='$1'>$2</li>");
            html = html.replace(/((?:<li class='copilot-oli'[^>]*>.*?<\/li>\s*)+)/gs, "<ol class='copilot-ol'>$1</ol>");

            // 9. Format Bullet Lists: - Item or * Item
            html = html.replace(/^\s*[\*\-]\s+(.*$)/gim, "<li class='copilot-uli'>$1</li>");
            html = html.replace(/((?:<li class='copilot-uli'>.*?<\/li>\s*)+)/gs, "<ul class='copilot-ul'>$1</ul>");

            // 10. Clean up multiple newlines into paragraph breaks
            html = html.replace(/\n\n+/g, "<div class='copilot-p-break'></div>");
            html = html.replace(/\n/g, "<br/>");

            // 11. Format SAP Production Order numbers as clickable deep-links
            html = this._formatOrderLinks(html);

            return "<div class='copilot-html-root'>" + html + "</div>";
        },

        _formatBadges: function (cellText) {
            if (/^Delivered$/i.test(cellText)) {
                return "<span class='copilot-badge badge-delivered'>Delivered</span>";
            }
            if (/^Completed$/i.test(cellText)) {
                return "<span class='copilot-badge badge-completed'>Completed</span>";
            }
            if (/^In Progress$/i.test(cellText)) {
                return "<span class='copilot-badge badge-progress'>In Progress</span>";
            }
            if (/^Released$/i.test(cellText)) {
                return "<span class='copilot-badge badge-released'>Released</span>";
            }
            if (/^Delayed$/i.test(cellText)) {
                return "<span class='copilot-badge badge-delayed'>Delayed</span>";
            }
            return cellText;
        },

        _formatOrderLinks: function (text) {
            if (!text) return "";
            // Replace 7-digit order numbers starting with 10 (e.g. 1000001) that are not already within an HTML tag or attribute
            return text.replace(/(?<![0-9a-zA-Z_=\/"])(10\d{5})\b(?![^<]*>)(?![^<]*<\/a>)/g, function (match, sOrder) {
                return "<a href='javascript:void(0)' class='copilot-order-link' data-order-number='" + sOrder + "' title='Open Production Order " + sOrder + " in Fiori Elements'><span class='copilot-order-icon'>📋</span> " + sOrder + "</a>";
            });
        },

        _navigateToOrder: async function (sOrderNumber) {
            try {
                // 1. Fetch entity ID from production orders service
                var response = await fetch("/production/ProductionOrders?$filter=orderNumber eq '" + encodeURIComponent(sOrderNumber) + "'&$select=ID");
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                var data = await response.json();
                var aItems = data.value || [];
                if (aItems.length === 0 || !aItems[0].ID) {
                    MessageToast.show("Production Order " + sOrderNumber + " not found in S/4HANA records.");
                    return;
                }

                var sId = aItems[0].ID;

                // 2. If dialog is maximized, restore to standard sidebar mode so the Object Page is clearly visible
                var oModel = this.getView().getModel("chat");
                if (oModel && oModel.getProperty("/isMaximized")) {
                    this.onToggleMaximize();
                }

                MessageToast.show("Opening Production Order " + sOrderNumber + " in Fiori...");

                // 3. Navigate via UI5 Router or Launchpad Hash
                var oComponent = this.getOwnerComponent();
                if (!oComponent && sap.ui.core.Component && sap.ui.core.Component.registry) {
                    oComponent = Array.from(sap.ui.core.Component.registry.filter(function (c) {
                        return c.getMetadata && c.getMetadata().getName() === "manufacturingui.Component";
                    }))[0];
                }

                var bNavigated = false;
                if (oComponent && typeof oComponent.getRouter === "function") {
                    var oRouter = oComponent.getRouter();
                    if (oRouter) {
                        try {
                            oRouter.navTo("ProductionOrdersObjectPage", {
                                key: "ID=" + sId
                            });
                            bNavigated = true;
                        } catch (routerErr) {
                            console.warn("Router navTo failed, using hash navigation:", routerErr);
                        }
                    }
                }

                if (!bNavigated) {
                    window.location.hash = "#manufacturingui-display&/ProductionOrders(" + encodeURIComponent("ID=" + sId) + ")";
                }

            } catch (err) {
                console.error("Failed to navigate to order:", err);
                MessageToast.show("Unable to navigate to Production Order " + sOrderNumber);
            }
        },

        onConfirmAction: async function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext("chat");
            if (!oCtx) {
                return;
            }

            var sPath = oCtx.getPath();
            var oModel = oCtx.getModel();
            var oAction = oModel.getProperty(sPath + "/pendingAction");
            if (!oAction || oAction.status !== "pending" || oAction.busy) {
                return;
            }

            oModel.setProperty(sPath + "/pendingAction/busy", true);
            oModel.refresh(true);

            try {
                var response = await fetch("/odata/v4/knowledge/confirmAgentAction", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        tool: oAction.tool,
                        arguments: JSON.stringify(oAction.arguments || {})
                    })
                });

                if (!response.ok) {
                    var errorText = await response.text();
                    throw new Error(errorText || ("HTTP " + response.status));
                }

                var data = await response.json();
                var parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;

                if (!parsed || parsed.status === "ERROR") {
                    throw new Error((parsed && parsed.message) || "Confirmed action failed.");
                }

                var sSummary = this._formatConfirmedActionSummary(oAction.tool, parsed.result || {});
                var oUpdatedAction = Object.assign({}, oAction, {
                    status: "confirmed",
                    busy: false,
                    resolutionText: sSummary
                });
                oModel.setProperty(sPath + "/pendingAction", oUpdatedAction);

                var aMessages = (oModel.getProperty("/messages") || []).slice();
                aMessages.push({
                    sender: "Manufacturing AI Copilot",
                    timestamp: this._getTimeString(),
                    text: sSummary,
                    html: this._formatMarkdown("✅ **Confirmed & Executed:** " + sSummary),
                    tools: [{ tool: oAction.tool, status: "success" }],
                    pendingAction: null
                });

                oModel.setProperty("/messages", aMessages);
                oModel.refresh(true);
                this._persistChat(aMessages);
                this._scrollToBottom();
                MessageToast.show("Action executed successfully.");

                try {
                    var oComponent = this.getOwnerComponent();
                    if (oComponent && oComponent.getModel()) {
                        oComponent.getModel().refresh();
                    }
                } catch (e) {}

            } catch (err) {
                console.error("Confirmed action execution failed:", err);
                var oFailedAction = Object.assign({}, oAction, {
                    status: "failed",
                    busy: false,
                    resolutionText: "Execution failed: " + err.message
                });
                oModel.setProperty(sPath + "/pendingAction", oFailedAction);

                var aErrMessages = (oModel.getProperty("/messages") || []).slice();
                aErrMessages.push({
                    sender: "Manufacturing AI Copilot",
                    timestamp: this._getTimeString(),
                    text: "Action failed: " + err.message,
                    html: "<div class='copilot-error-banner'>⚠️ <strong>Action Failed:</strong> " + this._escapeHtml(err.message) + "</div>",
                    tools: [{ tool: oAction.tool, status: "failed" }],
                    pendingAction: null
                });

                oModel.setProperty("/messages", aErrMessages);
                oModel.refresh(true);
                this._persistChat(aErrMessages);
                this._scrollToBottom();
            }
        },

        onCancelAction: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext("chat");
            if (!oCtx) {
                return;
            }

            var sPath = oCtx.getPath();
            var oModel = oCtx.getModel();
            var oAction = oModel.getProperty(sPath + "/pendingAction");
            if (!oAction || oAction.status !== "pending" || oAction.busy) {
                return;
            }

            var sCancelMsg = "Cancelled: " + oAction.message + " No changes were written.";
            var oCancelled = Object.assign({}, oAction, {
                status: "cancelled",
                busy: false,
                resolutionText: "Cancelled by operator. No changes applied."
            });
            oModel.setProperty(sPath + "/pendingAction", oCancelled);

            var aMessages = (oModel.getProperty("/messages") || []).slice();
            aMessages.push({
                sender: "Manufacturing AI Copilot",
                timestamp: this._getTimeString(),
                text: sCancelMsg,
                html: this._formatMarkdown("❌ **Cancelled:** " + oAction.message + " No changes were made."),
                tools: [],
                pendingAction: null
            });

            oModel.setProperty("/messages", aMessages);
            oModel.refresh(true);
            this._persistChat(aMessages);
            this._scrollToBottom();
            MessageToast.show("Action cancelled.");
        },

        _formatConfirmedActionSummary: function (sTool, oResult) {
            if (sTool === "teco_production_order") {
                return "Order " + (oResult.orderNumber || "") + " has been set to TECO in SAP S/4HANA.";
            }
            if (sTool === "release_production_order") {
                return "Order " + (oResult.orderNumber || "") + " has been released in SAP S/4HANA.";
            }
            if (sTool === "create_maintenance_notification") {
                return "Maintenance Notification " + (oResult.notificationNumber || "") +
                    " created in CAP DB (Priority: " + (oResult.priority || "Medium") +
                    (oResult.orderNumber ? ", Order: " + oResult.orderNumber : "") + ").";
            }
            return "Action completed successfully.";
        }
    });
});
