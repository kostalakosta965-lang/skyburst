export interface TgWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export interface TgMainButton {
  setText(text: string): void;
  show(): void;
  hide(): void;
  onClick(cb: () => void): void;
  offClick(cb: () => void): void;
  showProgress(leaveActive?: boolean): void;
  hideProgress(): void;
  setParams(params: Record<string, unknown>): void;
}

export interface TgBackButton {
  show(): void;
  hide(): void;
  onClick(cb: () => void): void;
  offClick(cb: () => void): void;
}

export interface TgHapticFeedback {
  impactOccurred(style: "light" | "medium" | "heavy" | "rigid" | "soft"): void;
  notificationOccurred(type: "error" | "success" | "warning"): void;
  selectionChanged(): void;
}

export interface TgWebApp {
  initDataUnsafe?: { user?: TgWebAppUser };
  colorScheme?: "light" | "dark";
  themeParams?: Record<string, string>;
  platform?: string;
  version?: string;
  MainButton?: TgMainButton;
  BackButton?: TgBackButton;
  HapticFeedback?: TgHapticFeedback;
  ready(): void;
  expand(): void;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  onEvent(event: string, cb: () => void): void;
  offEvent(event: string, cb: () => void): void;
  openTelegramLink?(url: string): void;
  disableVerticalSwipes?(): void;
  enableClosingConfirmation?(): void;
  disableClosingConfirmation?(): void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp };
  }
}

export const NIGHT = "#030503";

export function getTg(): TgWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function isTelegramEnv(): boolean {
  const tg = getTg();
  return Boolean(tg?.initDataUnsafe?.user?.id);
}

export function getTelegramUser(): TgWebAppUser | null {
  return getTg()?.initDataUnsafe?.user ?? null;
}

export function impact(style: "light" | "medium" | "heavy" = "light") {
  try {
    getTg()?.HapticFeedback?.impactOccurred(style);
  } catch {
    /* noop */
  }
}

export function notify(type: "success" | "error" | "warning") {
  try {
    getTg()?.HapticFeedback?.notificationOccurred(type);
  } catch {
    /* noop */
  }
}

export function selectionHaptic() {
  try {
    getTg()?.HapticFeedback?.selectionChanged();
  } catch {
    /* noop */
  }
}

export function openChannel(url: string) {
  const tg = getTg();
  if (tg?.openTelegramLink) tg.openTelegramLink(url);
  else if (typeof window !== "undefined") window.open(url, "_blank");
}

export const AUTH_KEY = "pyrolab_age_ok";
export const CART_KEY = "pyrolab_cart_v1";
export const UID_KEY = "pyrolab_uid";

export function getStableUserId(): string {
  const tgUser = getTelegramUser();
  if (tgUser) return `tg_${tgUser.id}`;
  if (typeof window === "undefined") return "anon";
  let id = window.localStorage.getItem(UID_KEY);
  if (!id) {
    id = `web_${Math.random().toString(36).slice(2, 12)}`;
    window.localStorage.setItem(UID_KEY, id);
  }
  return id;
}
