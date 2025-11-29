export function evaluate(expr: string, ctx: Record<string, any>): boolean {
  try {
    return Boolean(new Function('ctx', `return (${expr});`)(ctx));
  } catch {
    return false;
  }
}

export function safeUrl(url: string): string {
  try {
    const u = new URL(url, window.location.origin);
    if (u.protocol === 'javascript:') return '#';
    return u.toString();
  } catch {
    return '#';
  }
}

type Action =
  | { kind: 'link'; href: string; target?: '_self' | '_blank' }
  | { kind: 'openModal'; id: string }
  | { kind: 'emit'; event: string; payload?: any };

export function handleAction(action?: Action) {
  if (!action) return;

  switch (action.kind) {
    case 'link':
      if (action.target === '_blank') {
        window.open(action.href, '_blank');
      } else {
        window.location.href = action.href;
      }
      break;

    case 'openModal':
      window.dispatchEvent(
        new CustomEvent('open-modal', { detail: action.id }),
      );
      break;

    case 'emit':
      window.dispatchEvent(
        new CustomEvent(action.event, { detail: action.payload }),
      );
      break;

    default:
      console.warn('Unknown action', action);
  }
}

export function hash(obj: unknown): string {
  const str = JSON.stringify(obj);
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return '0';
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return String(hash);
}
