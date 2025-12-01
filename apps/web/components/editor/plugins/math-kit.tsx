'use client';

import { EquationPlugin, InlineEquationPlugin } from '@platejs/math/react';

import {
  EquationElement,
  InlineEquationElement,
} from '@workspace/ui/components/equation-node';

export const MathKit = [
  InlineEquationPlugin.withComponent(InlineEquationElement),
  EquationPlugin.withComponent(EquationElement),
];
