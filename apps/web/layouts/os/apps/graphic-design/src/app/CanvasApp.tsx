import { CanvasStage } from '../components/canvas/CanvasStage';
import { PropertiesPanel } from '../components/inspector/PropertiesPanel';
import { LayersPanel } from '../components/layers/LayersPanel';
import { Toolbar } from '../components/toolbar/Toolbar';

export function CanvasApp() {
  return (
    <div className="bg-muted/30 h-[100dvh] w-full overflow-hidden">
      <div className="flex h-full">
        <Toolbar />
        <CanvasStage />
        <aside className="bg-background/60 flex w-80 shrink-0 flex-col gap-3 border-l p-3 backdrop-blur">
          <PropertiesPanel />
          <LayersPanel />
        </aside>
      </div>
    </div>
  );
}
