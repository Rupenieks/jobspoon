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
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useResumeState } from "./resumes/ResumeStateContext";
import { GripVertical } from "lucide-react";
import { SortableItem } from "./SortableItem";

// New component for droppable page container
const DroppablePage = ({ pageIndex, children }: { pageIndex: number, children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({
    id: `page-${pageIndex}`,
  });

  return (
    <div
      ref={setNodeRef}
      className="w-48 p-4 border rounded-lg bg-background"
    >
      {children}
    </div>
  );
};

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

    // Handle dropping into a page container
    if (over.id.toString().startsWith('page-')) {
      const activePageIndex = (active.id as string).split('-')[0];
      const overPageIndex = over.id.toString().replace('page-', '');
      
      if (activePageIndex === overPageIndex) return;

      const newPages = [...resume.data.pages];
      const [sourcePageIndex, activeSectionId] = (active.id as string).split('-');
      
      const activeSection = newPages[Number(sourcePageIndex)].sections.find(
        s => s.id === activeSectionId
      );
      
      if (!activeSection) return;

      // Remove from source page
      newPages[Number(sourcePageIndex)].sections = newPages[Number(sourcePageIndex)].sections.filter(
        s => s.id !== activeSectionId
      );

      // Add to target page
      newPages[Number(overPageIndex)].sections.push(activeSection);

      updateResumeField("pages", newPages);
      return;
    }

    // Handle dropping onto another section
    const [activePageIndex, activeSectionId] = (active.id as string).split('-');
    const [overPageIndex, overSectionId] = (over.id as string).split('-');

    if (activePageIndex === overPageIndex) return;

    const newPages = [...resume.data.pages];
    const activeSection = newPages[Number(activePageIndex)].sections.find(
      s => s.id === activeSectionId
    );
    
    if (!activeSection) return;

    newPages[Number(activePageIndex)].sections = newPages[Number(activePageIndex)].sections.filter(
      s => s.id !== activeSectionId
    );

    const overIndex = newPages[Number(overPageIndex)].sections.findIndex(
      s => s.id === overSectionId
    );

    if (overIndex === -1) {
      newPages[Number(overPageIndex)].sections.push(activeSection);
    } else {
      newPages[Number(overPageIndex)].sections.splice(overIndex, 0, activeSection);
    }

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4">
          {resume?.data.pages.map((page, pageIndex) => (
            <DroppablePage key={pageIndex} pageIndex={pageIndex}>
              <div className="font-medium mb-2">Page {pageIndex + 1}</div>
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
            </DroppablePage>
          ))}
        </div>
      </DndContext>
    </div>
  );
}; 