import React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useResumeState } from "./resumes/ResumeStateContext";
import { Button } from "./ui/button";
import { GripVertical } from "lucide-react";
import { SortableItem } from "./SortableItem";

export const SectionLayoutManager = () => {
  const { resume, updateResumeField } = useResumeState();
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !resume) return;

    // Extract page index and section id from the droppable id
    const [activePageIndex, activeSectionId] = (active.id as string).split('-');
    const [overPageIndex, overSectionId] = (over.id as string).split('-');

    if (activePageIndex === overPageIndex) return; // Same page handling is done in handleDragEnd

    // Create new pages array
    const newPages = [...resume.data.pages];
    
    // Find the section to move
    const activeSection = newPages[Number(activePageIndex)].sections.find(
      s => s.id === activeSectionId
    );
    
    if (!activeSection) return;

    // Remove from source page
    newPages[Number(activePageIndex)].sections = newPages[Number(activePageIndex)].sections.filter(
      s => s.id !== activeSectionId
    );

    // Add to target page
    newPages[Number(overPageIndex)].sections.push(activeSection);

    updateResumeField("pages", newPages);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !resume) return;

    const [activePageIndex, activeSectionId] = (active.id as string).split('-');
    const [overPageIndex, overSectionId] = (over.id as string).split('-');

    if (activePageIndex === overPageIndex) {
      // Same page reordering
      const pageIndex = Number(activePageIndex);
      const oldIndex = resume.data.pages[pageIndex].sections.findIndex(
        s => s.id === activeSectionId
      );
      const newIndex = resume.data.pages[pageIndex].sections.findIndex(
        s => s.id === overSectionId
      );

      const newPages = [...resume.data.pages];
      newPages[pageIndex].sections = arrayMove(
        newPages[pageIndex].sections,
        oldIndex,
        newIndex
      );

      updateResumeField("pages", newPages);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Layout Manager</h3>
      <div className="flex gap-4">
        {resume?.data.pages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            className="w-48 p-4 border rounded-lg bg-background"
          >
            <div className="font-medium mb-2">Page {pageIndex + 1}</div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={page.sections.map(
                  section => `${pageIndex}-${section.id}`
                )}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {page.sections.map((section) => (
                    <SortableItem
                      key={`${pageIndex}-${section.id}`}
                      id={`${pageIndex}-${section.id}`}
                    >
                      <div className="flex items-center gap-2 p-2 bg-white rounded border">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{section.title}</span>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        ))}
      </div>
    </div>
  );
}; 