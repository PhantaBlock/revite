const protocol = window.__SKY_CLIENT_ENV__ === "daily" ? "http" : "https";

export const REVITE_DOMAIN = window.__SERVICE_DOMAIN__
    ? `${protocol}://${window.__SERVICE_DOMAIN__?.["REVOLT"]}`
    : import.meta.env.VITE_API_URL;
