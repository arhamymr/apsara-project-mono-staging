/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import { Separator } from '@workspace/ui/components/separator';
import { ComponentData, useWebsite } from '@/hooks/use-website';
import { ChevronDown, ChevronUp, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { SectionRenderer, SettingsRenderer } from '../components/renderer';
import { ThemeProvider } from '../components/theme/page-theme';

interface ICardComponent {
  component: ComponentData;
  index: number;
}

export const CardComponent = ({ component, index }: ICardComponent) => {
  const { activePage, updateComponent, removeComponent, moveComponent } =
    useWebsite();

  const [isExpanded, setIsExpanded] = useState(false);
  const totalComponents = activePage.sections.length;

  const handlePropChange = (key: string, value: any) => {
    updateComponent(component.id, {
      props: {
        ...component.props,
        [key]: value,
      },
    });
  };

  return (
    <Card className="group relative rounded-md border bg-gray-100 p-1 shadow-none transition-all duration-200">
      <CardHeader className="p-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base text-sm capitalize">
                {component.type}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => index > 0 && moveComponent(index, index - 1)}
                disabled={index === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  index < totalComponents - 1 && moveComponent(index, index + 1)
                }
                disabled={index === totalComponents - 1}
                className="h-8 w-8 p-0"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-3 w-3" />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeComponent(component.id)}
              className="text-destructive hover:text-destructive h-8 w-8 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-1">
        <ThemeProvider>
          <SectionRenderer section={component} onChange={handlePropChange} />
        </ThemeProvider>
      </CardContent>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <Separator />
          <CardContent className="pt-4">
            <SettingsRenderer
              type={component.type}
              onChange={handlePropChange}
              section={component.props}
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
