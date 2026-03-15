async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function getAuth(): Promise<{ user: { email: string } | null }> {
  return fetchApi("/api/auth");
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function setAuth(email: string): Promise<{ user: { email: string } }> {
  return fetchApi("/api/auth", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function clearAuth(): Promise<void> {
  await fetchApi("/api/auth", { method: "DELETE" });
}

export async function getProgress(): Promise<{ progress: Record<string, Record<string, boolean>> }> {
  return fetchApi("/api/progress");
}

export async function setStepComplete(moduleSlug: string, stepId: string, complete: boolean): Promise<void> {
  await fetchApi("/api/progress", {
    method: "PATCH",
    body: JSON.stringify({ moduleSlug, stepId, complete }),
  });
}

export async function setProgress(progress: Record<string, Record<string, boolean>>): Promise<void> {
  await fetchApi("/api/progress", {
    method: "PATCH",
    body: JSON.stringify({ progress }),
  });
}

export async function deleteModuleProgress(moduleSlug: string): Promise<void> {
  await fetchApi(`/api/progress?module=${encodeURIComponent(moduleSlug)}`, { method: "DELETE" });
}

export async function setUpdatesAnswerApi(answer: "yes" | "no"): Promise<void> {
  await fetchApi("/api/updates-answer", {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
}

export async function getUpdatesAnswer(): Promise<"yes" | "no" | null> {
  const { answer } = await fetchApi<{ answer: "yes" | "no" | null }>("/api/updates-answer");
  return answer;
}

export async function clearUpdatesAnswer(): Promise<void> {
  await fetchApi("/api/updates-answer", { method: "DELETE" });
}

export async function setSuspiciousAnswerApi(answer: string): Promise<void> {
  await fetchApi("/api/suspicious-answer", {
    method: "POST",
    body: JSON.stringify({ answer }),
  });
}

export async function getSuspiciousAnswer(): Promise<string | null> {
  const { answer } = await fetchApi<{ answer: string | null }>("/api/suspicious-answer");
  return answer;
}

export async function clearSuspiciousAnswer(): Promise<void> {
  await fetchApi("/api/suspicious-answer", { method: "DELETE" });
}

