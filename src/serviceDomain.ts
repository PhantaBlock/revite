export const REVITE_DOMAIN = window.__SERVICE_DOMAIN__
    ? `http://${window.__SERVICE_DOMAIN__?.["REVOLT"]}`
    : import.meta.env.VITE_API_URL;
