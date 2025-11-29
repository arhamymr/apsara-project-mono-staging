export class HttpError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const CSRF_HEADER = 'X-CSRF-TOKEN';
const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_COOKIE_HEADER = 'X-XSRF-TOKEN';
const CSRF_META_SELECTOR = 'meta[name="csrf-token"]';
const CSRF_REFRESH_ENDPOINT = '/sanctum/csrf-cookie';
const CSRF_ERROR_STATUS = 419;
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

type CsrfHeader = {
  name: string;
  value: string;
};

let csrfRefreshPromise: Promise<CsrfHeader | null> | null = null;

const hasDocument = () => typeof document !== 'undefined';
const hasRequestCtor = () =>
  typeof Request !== 'undefined' && typeof Request === 'function';

function readCookieValue(name: string): string | null {
  if (!hasDocument()) {
    return null;
  }
  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.trim().split('=');
    if (key === name) {
      const value = rest.join('=');
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }
  return null;
}

function readMetaToken(): string | null {
  if (!hasDocument()) {
    return null;
  }
  const value = document
    .querySelector<HTMLMetaElement>(CSRF_META_SELECTOR)
    ?.getAttribute('content');
  return value && value.trim() ? value : null;
}


function resolveCsrfHeader(preferCookie = false): CsrfHeader | null {
  if (!hasDocument()) {
    return null;
  }
  const metaToken = readMetaToken();
  const cookieToken = readCookieValue(CSRF_COOKIE_NAME);

  const candidates: Array<CsrfHeader | null> = preferCookie
    ? [
        cookieToken && cookieToken.trim()
          ? { name: CSRF_COOKIE_HEADER, value: cookieToken }
          : null,
        metaToken && metaToken.trim()
          ? { name: CSRF_HEADER, value: metaToken }
          : null,
      ]
    : [
        metaToken && metaToken.trim()
          ? { name: CSRF_HEADER, value: metaToken }
          : null,
        cookieToken && cookieToken.trim()
          ? { name: CSRF_COOKIE_HEADER, value: cookieToken }
          : null,
      ];

  for (const candidate of candidates) {
    if (candidate) {
      return candidate;
    }
  }

  return null;
}

async function refreshCsrfToken(): Promise<CsrfHeader | null> {
  if (!hasDocument() || typeof fetch === 'undefined') {
    return null;
  }

  if (!csrfRefreshPromise) {
    const pending = (async () => {
      try {
        await fetch(CSRF_REFRESH_ENDPOINT, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
      } catch {
        // Ignore refresh errors; we'll fall back to whatever token we have.
      }
      return resolveCsrfHeader(true);
    })();

    csrfRefreshPromise = pending;
    pending.finally(() => {
      if (csrfRefreshPromise === pending) {
        csrfRefreshPromise = null;
      }
    });
  }

  return csrfRefreshPromise;
}

const shouldIncludeCsrf = (method: string) => !SAFE_METHODS.has(method);

function resolveMethod(input: RequestInfo, init?: RequestInit): string {
  if (init?.method) {
    return init.method;
  }
  if (hasRequestCtor() && input instanceof Request) {
    return input.method;
  }
  return 'GET';
}

function cloneRequestInput(input: RequestInfo): RequestInfo {
  if (hasRequestCtor() && input instanceof Request) {
    return input.clone();
  }
  return input;
}

export async function fetcher<T = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const method = resolveMethod(input, init).toUpperCase();
  const needsCsrf = hasDocument() && shouldIncludeCsrf(method);

  const performRequest = (preferCookie = false) => {
    const headers = new Headers(init?.headers ?? {});
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }
    if (!headers.has('X-Requested-With')) {
      headers.set('X-Requested-With', 'XMLHttpRequest');
    }
    if (needsCsrf) {
      const csrfHeader = resolveCsrfHeader(preferCookie);
      if (csrfHeader && !headers.has(csrfHeader.name)) {
        headers.set(csrfHeader.name, csrfHeader.value);
      }
    }

    return fetch(cloneRequestInput(input), {
      ...init,
      credentials: 'include',
      headers,
    });
  };

  let response = await performRequest();

  if (needsCsrf && response.status === CSRF_ERROR_STATUS) {
    await refreshCsrfToken();
    response = await performRequest(true);
  }

  const hasBody =
    response.status !== 204 &&
    response.status !== 205 &&
    response.status !== 304;

  let payload: unknown = undefined;
  if (hasBody) {
    const raw = await response.text();
    if (raw) {
      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        try {
          payload = JSON.parse(raw);
        } catch {
          payload = raw;
        }
      } else {
        payload = raw;
      }
    }
  }

  if (!response.ok) {
    let message = response.statusText;
    if (payload && typeof payload === 'object' && 'message' in payload) {
      const value = (payload as Record<string, unknown>).message;
      if (typeof value === 'string' && value.trim()) {
        message = value;
      }
    } else if (typeof payload === 'string' && payload.trim()) {
      message = payload;
    }

    throw new HttpError(response.status, message || 'Request failed', payload);
  }

  return payload as T;
}
