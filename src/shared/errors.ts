export function msg(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return Object.entries(params).reduce(
    (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
    template,
  );
}

export const AUTH_NOT_AUTHENTICATED = "Not authenticated. Please log in.";
export const CAREER_NOT_FOUND = "Career not found (slug: {slug}).";
