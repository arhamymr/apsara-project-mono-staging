import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  DndContext,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

// Focus this file on orchestration only; UI lives in subcomponents
import DesktopAppShortcutItem from '@/layouts/os/components/desktop-shortcuts/DesktopAppShortcutItem';
import DesktopGroupShortcutItem from '@/layouts/os/components/desktop-shortcuts/DesktopGroupShortcutItem';
import ExpandedGroupPanel from '@/layouts/os/components/desktop-shortcuts/ExpandedGroupPanel';
import type { DesktopItem } from '@/layouts/os/types';
import { useWindowContext } from '@/layouts/os/WindowContext';

export function DesktopShortcutsBoard() {
  const {
    shortcuts,
    reorderShortcuts,
    openAppById,
    dockAppIds,
    setDockAppIds,
    addToGroup,
    createGroupWithItems,
    ungroup,
    removeFromGroup,
    renameGroup,
  } = useWindowContext();

  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);
  const [expandedAnchor, setExpandedAnchor] = useState<{
    left: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
  } | null>(null);
  // Expanded panel UI state is now encapsulated in ExpandedGroupPanel
  const expandedGroup = useMemo(
    () => shortcuts.find((i) => i.type === 'group' && i.id === expandedGroupId),
    [shortcuts, expandedGroupId],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedGroupId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Panel handles its own outside-click and animation

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const idToItem = useMemo(() => {
    const map = new Map<string, DesktopItem>();
    shortcuts.forEach((it) => map.set(it.id, it));
    return map;
  }, [shortcuts]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setHoveredGroupId(null);
      const { active, over } = event;
      if (!over) return;
      const activeId = String(active.id);
      const overId = String(over.id);
      if (activeId === overId) return;

      const activeItem = idToItem.get(activeId);
      const overItem = idToItem.get(overId);
      if (!activeItem || !overItem) return;

      // Drop app onto group -> add
      if (activeItem.type === 'app' && overItem.type === 'group') {
        addToGroup(activeItem.id, overItem.id);
        return;
      }

      // Drop app onto another app -> create a group
      if (activeItem.type === 'app' && overItem.type === 'app') {
        createGroupWithItems('Group', [overItem.id, activeItem.id]);
        return;
      }

      // Fallback: reorder top-level
      reorderShortcuts(activeId, overId);
    },
    [idToItem, addToGroup, createGroupWithItems, reorderShortcuts],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) {
        setHoveredGroupId(null);
        return;
      }
      const activeId = String(active.id);
      const overId = String(over.id);
      if (activeId === overId) {
        setHoveredGroupId(null);
        return;
      }
      const activeItem = idToItem.get(activeId);
      const overItem = idToItem.get(overId);
      if (activeItem?.type === 'app' && overItem?.type === 'group') {
        setHoveredGroupId(overItem.id);
      } else {
        setHoveredGroupId(null);
      }
    },
    [idToItem],
  );

  const handleOpenGroup = useCallback(
    (groupId: string, e?: React.MouseEvent<HTMLElement>) => {
      setExpandedGroupId(groupId);
      // Reset any in-panel state on reopen
      const rect = (
        e?.currentTarget as HTMLElement | undefined
      )?.getBoundingClientRect?.();
      if (rect) {
        setExpandedAnchor({
          left: rect.left,
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setExpandedAnchor(null);
      }
      // animation now handled in ExpandedGroupPanel
    },
    [],
  );

  const handleCloseGroup = useCallback(() => {
    setExpandedGroupId(null);
    setExpandedAnchor(null);
  }, []);

  if (!shortcuts.length) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <SortableContext
        items={shortcuts.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <div className="pointer-events-auto grid max-w-[12rem] grid-cols-2 gap-2">
          {shortcuts.map((item) => {
            if (item.type === 'group') {
              return (
                <DesktopGroupShortcutItem
                  key={item.id}
                  item={item}
                  onOpenGroup={(id, e) => handleOpenGroup(id, e)}
                  onUngroup={(id) => ungroup(id)}
                  dropHint={hoveredGroupId === item.id}
                />
              );
            }

            const isPinned = dockAppIds.includes(item.appId);
            const pin = () =>
              setDockAppIds((prev) =>
                prev.includes(item.appId) ? prev : [...prev, item.appId],
              );
            const unpin = () =>
              setDockAppIds((prev) => prev.filter((id) => id !== item.appId));

            const groups = shortcuts.filter((x) => x.type === 'group');

            return (
              <DesktopAppShortcutItem
                key={item.id}
                item={item}
                isPinned={isPinned}
                groups={groups.map((g) => ({ id: g.id, label: g.label }))}
                onOpenApp={openAppById}
                onPin={pin}
                onUnpin={unpin}
                onAddToGroup={(sid, gid) => addToGroup(sid, gid)}
                onCreateGroupWith={(label, ids) =>
                  createGroupWithItems(label, ids)
                }
              />
            );
          })}
        </div>
      </SortableContext>

      {/* Expanded group panel (own component) */}
      {expandedGroup && expandedGroup.type === 'group' ? (
        <ExpandedGroupPanel
          group={expandedGroup}
          anchor={expandedAnchor}
          onClose={handleCloseGroup}
          onRename={(id, name) => renameGroup(id, name)}
          onOpenApp={openAppById}
          onRemoveChild={(cid) => removeFromGroup(cid, expandedGroup.id)}
        />
      ) : null}
    </DndContext>
  );
}
