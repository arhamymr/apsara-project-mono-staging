'use client';

import { Badge } from '@workspace/ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Switch } from '@workspace/ui/components/switch';
import { TabsContent } from '@workspace/ui/components/tabs';
import { Shield } from 'lucide-react';
import * as React from 'react';

type GuardrailsState = {
  profanity: boolean;
  pii: boolean;
  jailbreak: boolean;
  toxic: boolean;
};

type RateLimitState = {
  rpm: number;
  rpd: number;
};

type GuardrailsSettingsTabProps = {
  guardrails: GuardrailsState;
  setGuardrails: React.Dispatch<React.SetStateAction<GuardrailsState>>;
  rateLimit: RateLimitState;
  setRateLimit: React.Dispatch<React.SetStateAction<RateLimitState>>;
};

export function GuardrailsSettingsTab({
  guardrails,
  setGuardrails,
  rateLimit,
  setRateLimit,
}: GuardrailsSettingsTabProps) {
  return (
    <TabsContent value="guardrails" className="mt-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" /> Guardrails
          </CardTitle>
          <CardDescription>
            Safety filters applied before sending replies.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {(
            Object.entries({
              profanity: 'Profanity Filter',
              pii: 'PII Redaction',
              jailbreak: 'Jailbreak Detection',
              toxic: 'Toxicity Filter',
            }) as Array<[keyof GuardrailsState, string]>
          ).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border p-3"
            >
              <Label>{label}</Label>
              <Switch
                checked={guardrails[key]}
                onCheckedChange={(value) =>
                  setGuardrails((prev) => ({ ...prev, [key]: value }))
                }
              />
            </div>
          ))}
          <div className="grid gap-3 rounded-xl border p-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label>Rate Limits</Label>
              <Badge variant="outline" className="rounded-full">
                Global
              </Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="rpm">Requests / minute</Label>
                <Input
                  id="rpm"
                  type="number"
                  value={rateLimit.rpm}
                  onChange={(event) =>
                    setRateLimit((prev) => ({
                      ...prev,
                      rpm: parseInt(event.target.value || '0', 10),
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="rpd">Requests / day</Label>
                <Input
                  id="rpd"
                  type="number"
                  value={rateLimit.rpd}
                  onChange={(event) =>
                    setRateLimit((prev) => ({
                      ...prev,
                      rpd: parseInt(event.target.value || '0', 10),
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
