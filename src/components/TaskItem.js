import React from "react";
import { Draggable } from "react-beautiful-dnd";

const TaskItem = ({ task, index, onDelete }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`
            group
            flex items-center
            p-3 sm:p-4
            bg-white
            rounded-xl 
            border
            shadow-md /* Default subtle shadow */
            transition-all duration-200 ease-out /* Smooth hover transitions */
            ${
              snapshot.isDragging
                ? "border-sky-500 shadow-xl scale-103 bg-sky-50 ring-2 ring-sky-500 ring-opacity-75 z-50" /* Enhanced dragging state, ensure it's above others */
                : "border-slate-200 hover:border-slate-300 hover:shadow-lg hover:-translate-y-px" /* Refined hover effect */
            }
          `}
          ref={provided.innerRef}
          {...provided.draggableProps}
          // Note: dragHandleProps is applied to a specific element below
        >
          {/* Drag handle icon */}
          <div 
            {...provided.dragHandleProps}
            className={`
              p-1.5 mr-2 sm:mr-3 text-slate-400 hover:text-slate-700 
              cursor-grab active:cursor-grabbing
              transition-colors duration-150 rounded-md hover:bg-slate-100 active:bg-slate-200
              ${snapshot.isDragging ? "text-sky-600" : ""}
            `}
            aria-label="Drag task to reorder"
            title="Drag to reorder"
          >
            {/* Modern 6-dot grip icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><rect width="256" height="256" fill="none"/><circle cx="104" cy="76" r="16"/><circle cx="104" cy="128" r="16"/><circle cx="104" cy="180" r="16"/><circle cx="152" cy="76" r="16"/><circle cx="152" cy="128" r="16"/><circle cx="152" cy="180" r="16"/></svg>
          </div>
          
          {/* Priority number indicator */}
          <div 
            className={`
              flex items-center justify-center 
              w-7 h-7 sm:w-8 sm:h-8 mr-3 sm:mr-4
              rounded-full 
              font-semibold text-xs sm:text-sm
              shrink-0
              transition-all duration-200 ease-out
              ${snapshot.isDragging ? "bg-sky-500 text-white scale-110 shadow-md" : "bg-slate-100 text-slate-700"}
            `}
          >
            {index + 1}
          </div>
          
          {/* Task content */}
          <div className="flex-grow text-slate-800 break-words pr-2 text-sm sm:text-base leading-relaxed">
            {task.content}
          </div>
          
          {/* Elegant Delete button */}
          <button
            onClick={() => onDelete(task.id)}
            className={`
              ml-auto p-2
              text-slate-400 hover:text-red-600 
              bg-transparent hover:bg-red-100/70 /* Slightly transparent hover bg for elegance */
              rounded-full 
              transition-all duration-200 ease-in-out
              focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-opacity-60 focus-visible:ring-offset-1 focus-visible:ring-offset-white
              opacity-0 group-hover:opacity-100 focus:opacity-100 /* Appear on parent hover/focus */
              transform scale-90 group-hover:scale-100 focus:scale-100 hover:!scale-110 active:scale-95 /* Subtle entry and interactive feedback */
              ${snapshot.isDragging ? "opacity-0 pointer-events-none" : ""} /* Hide delete button completely during drag */
            `}
            aria-label="Delete task"
            title="Delete task"
          >
            {/* Modern trash can icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18" fill="currentColor"><rect width="256" height="256" fill="none"/><line x1="216" y1="60" x2="40" y2="60" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="88" y1="20" x2="168" y2="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><path d="M200,60V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V60" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="104" y1="104" x2="104" y2="168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="152" y1="104" x2="152" y2="168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></svg>
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;