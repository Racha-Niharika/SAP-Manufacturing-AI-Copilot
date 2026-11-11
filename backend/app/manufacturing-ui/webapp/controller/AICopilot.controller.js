sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
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
                oInput.attachBrowserEvent("keydown", function (e) {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        this.onSendMessage();
                    }
                }.bind(this));
            }
            this._scrollToBottom();
        },

        onSendMessage: async function () {
            var oModel = this.getView().getModel("chat");
            var sQuestion = (oModel.getProperty("/currentInput") || "").trim();

            if (!sQuestion) {
                return;
            }

            var aMessages = (oModel.getProperty("/messages") || []).slice();

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

            // 2. Call backend agent API
            try {
                var response = await fetch("/odata/v4/knowledge/askAgent", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ question: sQuestion })
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
                var sHtml = this._formatMarkdown(sAnswer);

                aMessages = (oModel.getProperty("/messages") || []).slice();
                aMessages.push({
                    sender: "Manufacturing AI Copilot",
                    timestamp: this._getTimeString(),
                    text: sAnswer,
                    html: sHtml,
                    tools: aTools
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
                        return parsed;
                    }
                }
            } catch (e) {}
            return [this._getWelcomeMessage()];
        },

        _getWelcomeMessage: function () {
            return {
                sender: "Manufacturing AI Copilot",
                timestamp: this._getTimeString(),
                text: "Hello! I am your SAP Manufacturing AI Copilot. I have live access to S/4HANA production orders and the company's Standard Operating Procedures (SOPs). You can ask me to analyze live order status, check for delays, or look up plant procedures.",
                html: "<p>Hello! I am your <strong>SAP Manufacturing AI Copilot</strong>.<br/><br/>I have live access to <strong>S/4HANA production orders</strong> and the company's <strong>Standard Operating Procedures (SOPs)</strong>.<br/><br/>You can ask me to analyze live order status, check for delays, or look up plant procedures.</p>",
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
            if (!markdown) return "";

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

            return html;
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
        }
    });
});
