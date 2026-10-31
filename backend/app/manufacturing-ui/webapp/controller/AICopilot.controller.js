sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("manufacturingui.controller.AICopilot", {
        onInit: function () {
            var oChatModel = new JSONModel({
                messages: [
                    {
                        sender: "Manufacturing AI Copilot",
                        timestamp: this._getTimeString(),
                        text: "Hello! I am your SAP Manufacturing AI Copilot. I have live access to S/4HANA production orders and the company's Standard Operating Procedures (SOPs). How can I assist you today?",
                        html: "<p>Hello! I am your <strong>SAP Manufacturing AI Copilot</strong>. I have live access to <strong>S/4HANA production orders</strong> and the company's <strong>Standard Operating Procedures (SOPs)</strong>.<br/><br/>You can ask me to analyze live order status, check for delays, or look up plant procedures.</p>",
                        tools: []
                    }
                ],
                currentInput: "",
                isThinking: false
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
        },

        onSendMessage: async function () {
            var oModel = this.getView().getModel("chat");
            var sQuestion = (oModel.getProperty("/currentInput") || "").trim();

            if (!sQuestion) {
                return;
            }

            var aMessages = oModel.getProperty("/messages") || [];

            // Add User message
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
            this._scrollToBottom();

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
                    throw new Error("Server responded with " + response.status + ": " + errorText);
                }

                var data = await response.json();
                var result = typeof data.value === "string" ? JSON.parse(data.value) : data.value;

                var sAnswer = result.answer || "No response received.";
                var aTools = result.toolsExecuted || [];
                var sHtml = this._formatMarkdown(sAnswer);

                aMessages.push({
                    sender: "Manufacturing AI Copilot",
                    timestamp: this._getTimeString(),
                    text: sAnswer,
                    html: sHtml,
                    tools: aTools
                });

                oModel.setProperty("/messages", aMessages);

            } catch (err) {
                console.error("AI Copilot request failed:", err);
                aMessages.push({
                    sender: "Manufacturing AI Copilot",
                    timestamp: this._getTimeString(),
                    text: "Error: " + err.message,
                    html: "<p style='color: #b91c1c;'>⚠️ <strong>Unable to process request:</strong> " + err.message + "</p>",
                    tools: []
                });
                oModel.setProperty("/messages", aMessages);
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

        onClearChat: function () {
            var oModel = this.getView().getModel("chat");
            oModel.setProperty("/messages", [
                {
                    sender: "Manufacturing AI Copilot",
                    timestamp: this._getTimeString(),
                    text: "Conversation cleared. How can I assist you with your manufacturing orders or SOPs?",
                    html: "<p>Conversation cleared. How can I assist you with your <strong>manufacturing orders</strong> or <strong>SOPs</strong>?</p>",
                    tools: []
                }
            ]);
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
            setTimeout(function () {
                var oScroll = this.byId("chatScroll");
                if (oScroll && oScroll.getDomRef()) {
                    var dom = oScroll.getDomRef();
                    dom.scrollTop = dom.scrollHeight;
                }
            }.bind(this), 100);
        },

        _formatMarkdown: function (markdown) {
            if (!markdown) return "";

            // Escape raw HTML entities
            var html = markdown
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            // Format markdown headers
            html = html.replace(/^### (.*$)/gim, "<h4>$1</h4>");
            html = html.replace(/^## (.*$)/gim, "<h3>$1</h3>");
            html = html.replace(/^# (.*$)/gim, "<h2>$1</h2>");

            // Format bold and italics
            html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

            // Format inline code
            html = html.replace(/`([^`]+)`/g, "<code class='copilot-code'>$1</code>");

            // Format Markdown Tables
            var tableRegex = /((?:\|[^\n]+\|\r?\n)+)/g;
            html = html.replace(tableRegex, function (tableBlock) {
                var lines = tableBlock.trim().split(/\r?\n/);
                if (lines.length < 2) return tableBlock;

                var res = "<div class='copilot-table-container'><table class='copilot-table'>";
                var isHeader = true;

                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (/^\|[\s\-:|]+\|$/.test(line)) {
                        isHeader = false;
                        continue;
                    }

                    var cells = line.split("|").slice(1, -1);
                    res += "<tr>";
                    for (var c = 0; c < cells.length; c++) {
                        var tag = isHeader ? "th" : "td";
                        res += "<" + tag + ">" + cells[c].trim() + "</" + tag + ">";
                    }
                    res += "</tr>";
                }
                res += "</table></div>";
                return res;
            });

            // Format Unordered Lists
            html = html.replace(/^\s*[\*\-]\s+(.*$)/gim, "<li class='copilot-li'>$1</li>");
            html = html.replace(/(<li class='copilot-li'>.*?<\/li>)/gs, "<ul class='copilot-ul'>$1</ul>");

            // Clean multiple newlines into paragraphs
            html = html.replace(/\n\n+/g, "<br/><br/>");
            html = html.replace(/\n/g, "<br/>");

            return html;
        }
    });
});
