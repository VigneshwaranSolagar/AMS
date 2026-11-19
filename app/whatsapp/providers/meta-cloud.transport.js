"use strict";

/**
 * Official WhatsApp Cloud API transport.
 * Server-side use only. Never bundle access tokens in Electron.
 * This module does not authorize a send: the caller MUST enforce
 * recipient opt-in, approved template status, and suppression checks.
 */
class MetaCloudTransport {
  constructor({ accessToken, phoneNumberId, graphVersion, fetchImpl = globalThis.fetch }) {
    if (!accessToken || !phoneNumberId || !/^v\d+\.\d+$/.test(graphVersion || "")) {
      throw new Error("Meta Cloud API configuration incomplete");
    }
    if (typeof fetchImpl !== "function") throw new Error("fetch implementation required");
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
    this.graphVersion = graphVersion;
    this.fetch = fetchImpl;
  }

  async sendApprovedTemplate({ to, templateName, languageCode = "en", components = [] }) {
    if (!/^\d{8,15}$/.test(String(to))) throw new Error("Invalid E.164 recipient number");
    if (!/^[a-z0-9_]+$/.test(templateName || "")) throw new Error("Invalid template name");
    if (!/^[a-z]{2,3}(?:_[A-Z]{2})?$/.test(languageCode)) throw new Error("Invalid language code");
    if (!Array.isArray(components)) throw new Error("Invalid template components");
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: String(to),
      type: "template",
      template: { name: templateName, language: { code: languageCode } }
    };
    if (components.length) payload.template.components = components;
    const url = `https://graph.facebook.com/${this.graphVersion}/${encodeURIComponent(this.phoneNumberId)}/messages`;
    const response = await this.fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) {
      const err = new Error("Meta Cloud API rejected the message");
      err.status = response.status;
      err.code = result?.error?.code;
      err.retryable = response.status === 429 || response.status >= 500;
      throw err;
    }
    return {
      provider: "meta_cloud",
      status: "ACCEPTED",
      providerMessageId: result?.messages?.[0]?.id || null,
      raw: result
    };
  }
}

module.exports = { MetaCloudTransport };
