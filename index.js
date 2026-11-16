const DEFAULT_BASE_URL = "https://promiselandappraisals.com/api/v1";

export class AppraisalApiError extends Error {
  constructor(response, payload) {
    const details = payload?.error ?? {};
    super(details.message || `Promise Land Appraisal API returned HTTP ${response.status}.`);
    this.name = "AppraisalApiError";
    this.status = response.status;
    this.code = details.code || "HTTP_ERROR";
    this.resolution = details.resolution || "Check the API documentation and retry.";
  }
}

export function createAppraisalClient({ baseUrl = DEFAULT_BASE_URL, fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== "function") {
    throw new TypeError("A Fetch API implementation is required.");
  }

  const apiBase = new URL(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);

  async function request(path, options = {}) {
    const { headers, ...requestOptions } = options;
    const response = await fetchImpl(new URL(path, apiBase), {
      ...requestOptions,
      headers: { Accept: "application/json", ...headers },
    });
    let payload;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    if (!response.ok) {
      throw new AppraisalApiError(response, payload);
    }
    return payload;
  }

  return Object.freeze({
    getHealth: () => request("health"),
    getBusinessProfile: () => request("business"),
    listAppraisalServices: ({ limit, cursor } = {}) => request(listPath("services", { limit, cursor })),
    listServiceAreas: ({ limit, cursor } = {}) => request(listPath("service-areas", { limit, cursor })),
    getRequestInformation: () => request("request-information"),
    listGuides: ({ limit, cursor } = {}) => request(listPath("guides", { limit, cursor })),
    getGuide: (slug) => request(`guides/${encodeURIComponent(requireText(slug, "slug"))}`),
    searchGuides: (query) => request("search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: requireText(query, "query") }),
    }),
  });
}

function listPath(path, { limit, cursor }) {
  const query = new URLSearchParams();
  if (limit !== undefined) query.set("limit", String(limit));
  if (cursor !== undefined) query.set("cursor", String(cursor));
  const suffix = query.toString();
  return suffix ? `${path}?${suffix}` : path;
}

function requireText(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`${name} must be a non-empty string.`);
  }
  return value.trim();
}
