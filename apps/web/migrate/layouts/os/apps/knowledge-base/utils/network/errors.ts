import { HttpError } from '@/lib/fetcher';

type HandleFetcherErrorOptions = {
  validationMessage?: string;
  rethrowUnknown?: boolean;
};

export function handleFetcherError(
  error: unknown,
  fallbackMessage: string,
  options: HandleFetcherErrorOptions = {},
): never {
  if (error instanceof HttpError) {
    if (options.validationMessage && error.status === 422) {
      throw new Error(options.validationMessage);
    }

    if (error.message) {
      throw new Error(error.message);
    }
  }

  if (options.rethrowUnknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(fallbackMessage);
  }

  throw new Error(fallbackMessage);
}
