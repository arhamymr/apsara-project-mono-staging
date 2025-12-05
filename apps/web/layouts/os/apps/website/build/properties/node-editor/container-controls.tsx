import * as React from 'react';

import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { cn } from '@/lib/utils';
import { joinTokens, parseClassTokens } from './class-tokens';
import type {
  BackgroundOption,
  GapOption,
  SpacingOption,
  WidthOption,
} from './options';
import {
  BACKGROUND_OPTIONS,
  BACKGROUND_TOKEN_POOL,
  GAP_OPTIONS,
  GAP_TOKEN_POOL,
  SPACING_OPTIONS,
  SPACING_TOKEN_POOL,
  SURFACE_TOGGLES,
  WIDTH_OPTIONS,
  WIDTH_TOKEN_POOL,
} from './options';

const SPACING_PREFIXES = [
  'p-',
  'px-',
  'py-',
  'pt-',
  'pr-',
  'pb-',
  'pl-',
  'ps-',
  'pe-',
];
const GAP_PREFIXES = ['gap-', 'gap-x-', 'gap-y-'];
const WIDTH_PREFIXES = ['w-', 'max-w-'];

const normalizeToken = (token: string) => {
  const parts = token.split(':');
  return parts[parts.length - 1] ?? token;
};

const matchesPrefix = (token: string, prefixes: string[]) =>
  prefixes.some((prefix) => token.startsWith(prefix));

const stripTokens = (
  tokenSet: Set<string>,
  predicate: (original: string, normalized: string) => boolean,
) => {
  const next = new Set(tokenSet);
  tokenSet.forEach((token) => {
    const normalized = normalizeToken(token);
    if (predicate(token, normalized)) {
      next.delete(token);
    }
  });
  return next;
};

type SectionId = 'surface' | 'background' | 'width' | 'spacing' | 'gap';

type ContainerControlsProps = {
  className: string;
  onUpdateClass: (value: string) => void;
  section: SectionId;
};

const useDeferredSelection = (resolvedValue: string) => {
  const [pending, setPending] = React.useState<string | null>(null);
  React.useEffect(() => {
    setPending(null);
  }, [resolvedValue]);
  return {
    current: pending ?? resolvedValue,
    setPending,
  };
};

export function ContainerControls({
  className,
  onUpdateClass,
  section,
}: ContainerControlsProps) {
  const tokenSet = React.useMemo(
    () => parseClassTokens(className),
    [className],
  );

  const commitTokens = React.useCallback(
    (nextTokens: Set<string>) => {
      const nextValue = joinTokens(nextTokens);
      onUpdateClass(nextValue);
    },
    [onUpdateClass],
  );

  const surfaceValue = React.useMemo(() => {
    return SURFACE_TOGGLES.filter((toggle) =>
      toggle.tokens.every((token) => tokenSet.has(token)),
    ).map((toggle) => toggle.id);
  }, [tokenSet]);

  const handleSurfaceChange = React.useCallback(
    (values: string[]) => {
      const next = new Set(tokenSet);
      SURFACE_TOGGLES.forEach((toggle) => {
        toggle.tokens.forEach((token) => next.delete(token));
      });
      values.forEach((id) => {
        const toggle = SURFACE_TOGGLES.find((item) => item.id === id);
        toggle?.tokens.forEach((token) => next.add(token));
      });
      commitTokens(next);
    },
    [commitTokens, tokenSet],
  );

  const setSpacing = React.useCallback(
    (option: SpacingOption | null) => {
      const next = stripTokens(
        tokenSet,
        (_original, normalized) =>
          SPACING_TOKEN_POOL.includes(normalized) ||
          matchesPrefix(normalized, SPACING_PREFIXES),
      );
      option?.tokens.forEach((token) => next.add(token));
      commitTokens(next);
    },
    [commitTokens, tokenSet],
  );

  const setGap = React.useCallback(
    (option: GapOption | null) => {
      const next = stripTokens(
        tokenSet,
        (_original, normalized) =>
          GAP_TOKEN_POOL.includes(normalized) ||
          matchesPrefix(normalized, GAP_PREFIXES),
      );
      option?.tokens.forEach((token) => next.add(token));
      commitTokens(next);
    },
    [commitTokens, tokenSet],
  );

  const setWidth = React.useCallback(
    (option: WidthOption | null) => {
      const next = stripTokens(
        tokenSet,
        (_original, normalized) =>
          WIDTH_TOKEN_POOL.includes(normalized) ||
          normalized === 'container' ||
          normalized === 'mx-auto' ||
          matchesPrefix(normalized, WIDTH_PREFIXES),
      );
      option?.tokens.forEach((token) => next.add(token));
      commitTokens(next);
    },
    [commitTokens, tokenSet],
  );

  const setBackground = React.useCallback(
    (option: BackgroundOption | null) => {
      const next = new Set(tokenSet);
      BACKGROUND_TOKEN_POOL.forEach((token) => next.delete(token));
      option?.tokens.forEach((token) => next.add(token));
      commitTokens(next);
    },
    [commitTokens, tokenSet],
  );

  const surfaceTooltipLabel = React.useMemo(() => {
    if (surfaceValue.length === 0) return 'Surface';
    if (surfaceValue.length === SURFACE_TOGGLES.length) return 'Mixed surface';
    return (
      SURFACE_TOGGLES.find((toggle) => toggle.id === surfaceValue[0])?.label ??
      'Surface'
    );
  }, [surfaceValue]);

  const activeBackgroundId = React.useMemo(() => {
    const match = BACKGROUND_OPTIONS.find((option) =>
      option.tokens.every((token) => tokenSet.has(token)),
    );
    return match?.id ?? 'custom';
  }, [tokenSet]);

  const activeWidthId = React.useMemo(() => {
    const match = WIDTH_OPTIONS.find((option) =>
      option.tokens.every((token) => tokenSet.has(token)),
    );
    return match?.id ?? 'custom';
  }, [tokenSet]);

  const activeSpacingId = React.useMemo(() => {
    const match = SPACING_OPTIONS.find((option) =>
      option.tokens.every((token) => tokenSet.has(token)),
    );
    return match?.id ?? 'custom';
  }, [tokenSet]);

  const activeGapId = React.useMemo(() => {
    const match = GAP_OPTIONS.find((option) =>
      option.tokens.every((token) => tokenSet.has(token)),
    );
    return match?.id ?? 'custom';
  }, [tokenSet]);

  const gapValue = activeGapId === 'custom' ? '' : activeGapId;
  const spacingValue = activeSpacingId === 'custom' ? '' : activeSpacingId;
  const backgroundValue =
    activeBackgroundId === 'custom' ? '' : activeBackgroundId;
  const widthValue = activeWidthId === 'custom' ? '' : activeWidthId;

  const backgroundSelection = useDeferredSelection(backgroundValue);
  const widthSelection = useDeferredSelection(widthValue);
  const spacingSelection = useDeferredSelection(spacingValue);
  const gapSelection = useDeferredSelection(gapValue);

  switch (section) {
    case 'surface':
      return (
        <ToggleGroup
          type="multiple"
          value={surfaceValue}
          onValueChange={handleSurfaceChange}
          className="flex flex-wrap gap-2"
        >
          {SURFACE_TOGGLES.map((toggle) => {
            const isActive = surfaceValue.includes(toggle.id);
            return (
              <Tooltip key={toggle.id}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value={toggle.id}
                    aria-label={toggle.label}
                    aria-pressed={isActive}
                    className={cn(
                      'border-border flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition',
                      isActive &&
                        'border-primary bg-primary/15 text-primary ring-primary/40 ring-1',
                    )}
                  >
                    <span className="text-muted-foreground text-[11px]">
                      {toggle.label}
                    </span>
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {surfaceTooltipLabel}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </ToggleGroup>
      );
    case 'background':
      return (
        <div className="space-y-2">
          <ToggleGroup
            type="single"
            value={backgroundSelection.current || undefined}
            onValueChange={(value) => {
              backgroundSelection.setPending(value || '');
              const resolved = value || 'brand';
              const option =
                BACKGROUND_OPTIONS.find((item) => item.id === resolved) ?? null;
              setBackground(option);
            }}
            className="flex flex-wrap gap-2"
          >
            {BACKGROUND_OPTIONS.map((option) => {
              const isActive = backgroundSelection.current === option.id;
              return (
                <Tooltip key={option.id}>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value={option.id}
                      aria-label={option.label}
                      aria-pressed={isActive}
                      className={cn(
                        'border-border flex h-9 w-14 items-center justify-center rounded-md border px-0 text-[10px] font-semibold uppercase transition',
                        isActive &&
                          'border-primary bg-primary/15 text-primary ring-primary/40 ring-1',
                      )}
                    >
                      <div className="border-border h-5 w-10 rounded-sm border">
                        <div
                          className={cn(
                            option.previewClass,
                            'h-full w-full rounded-sm',
                          )}
                        />
                      </div>
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="top">{option.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </ToggleGroup>
          {activeBackgroundId === 'custom' ? (
            <p className="text-muted-foreground text-[11px]">
              Custom background classes detected.
            </p>
          ) : null}
        </div>
      );
    case 'width':
      return (
        <div className="space-y-2">
          <ToggleGroup
            type="single"
            value={widthSelection.current || undefined}
            onValueChange={(value) => {
              widthSelection.setPending(value || '');
              const resolved = value || 'full';
              const option =
                WIDTH_OPTIONS.find((item) => item.id === resolved) ?? null;
              setWidth(option);
            }}
            className="grid grid-cols-2 gap-2"
          >
            {WIDTH_OPTIONS.map((option) => {
              const isActive = widthSelection.current === option.id;
              return (
                <Tooltip key={option.id}>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value={option.id}
                      aria-label={option.label}
                      aria-pressed={isActive}
                      className={cn(
                        'border-border bg-background flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition',
                        isActive &&
                          'border-primary bg-primary/15 text-primary ring-primary/40 ring-1',
                      )}
                    >
                      <div className="border-border bg-muted/40 relative h-5 w-full rounded-sm border">
                        <div
                          className={cn(
                            'bg-primary/40 absolute inset-y-1 left-1/2 -translate-x-1/2 rounded-sm transition-all',
                          )}
                          style={{ width: `${option.previewWidth}%` }}
                        />
                      </div>
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="top">{option.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </ToggleGroup>
          {activeWidthId === 'custom' ? (
            <p className="text-muted-foreground text-[11px]">
              Custom width classes detected.
            </p>
          ) : null}
        </div>
      );
    case 'spacing':
      return (
        <div className="space-y-2">
          <ToggleGroup
            type="single"
            value={spacingSelection.current || undefined}
            onValueChange={(value) => {
              spacingSelection.setPending(value || '');
              const option =
                SPACING_OPTIONS.find((item) => item.id === value) ?? null;
              setSpacing(option);
            }}
            className="flex flex-wrap gap-2"
          >
            {SPACING_OPTIONS.map((option) => {
              const isActive = spacingSelection.current === option.id;
              return (
                <Tooltip key={option.id}>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value={option.id}
                      aria-label={option.label}
                      aria-pressed={isActive}
                      className={cn(
                        'border-border bg-background flex h-9 w-9 items-center justify-center rounded-md border p-0 text-xs transition',
                        isActive &&
                          'border-primary bg-primary/15 text-primary ring-primary/40 ring-1',
                      )}
                    >
                      <div
                        className="border-border bg-background h-6 w-6 rounded-sm border"
                        style={{ padding: `${option.previewPadding}px` }}
                      >
                        <div className="bg-primary/40 h-full w-full rounded-[2px]" />
                      </div>
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="top">{option.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </ToggleGroup>
          {activeSpacingId === 'custom' ? (
            <p className="text-muted-foreground text-[11px]">
              Custom spacing detected — edit classes manually.
            </p>
          ) : null}
        </div>
      );
    case 'gap':
      return (
        <div className="space-y-2">
          <ToggleGroup
            type="single"
            value={gapSelection.current || undefined}
            onValueChange={(value) => {
              gapSelection.setPending(value || '');
              const option =
                GAP_OPTIONS.find((item) => item.id === value) ?? null;
              setGap(option);
            }}
            className="flex flex-wrap gap-2"
          >
            {GAP_OPTIONS.map((option) => {
              const isActive = gapSelection.current === option.id;
              return (
                <Tooltip key={option.id}>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value={option.id}
                      aria-label={option.label}
                      aria-pressed={isActive}
                      className={cn(
                        'border-border bg-background flex h-9 w-9 items-center justify-center rounded-md border p-0 text-xs transition',
                        isActive &&
                          'border-primary bg-primary/15 text-primary ring-primary/40 ring-1',
                      )}
                    >
                      <div
                        className="border-border bg-background flex h-6 w-6 flex-col justify-center rounded-sm border p-1"
                        style={{ gap: `${option.previewGap}px` }}
                      >
                        <span className="bg-primary/40 h-[2px] w-full rounded" />
                        <span className="bg-primary/40 h-[2px] w-full rounded" />
                        <span className="bg-primary/40 h-[2px] w-full rounded" />
                        <span className="bg-primary/40 h-[2px] w-full rounded" />
                      </div>
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="top">{option.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </ToggleGroup>
          {activeGapId === 'custom' ? (
            <p className="text-muted-foreground text-[11px]">
              Custom gap classes applied.
            </p>
          ) : null}
        </div>
      );
    default:
      return null;
  }
}
