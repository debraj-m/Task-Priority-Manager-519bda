import React from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";

// Simple Error Boundary component to catch errors from react-beautiful-dnd
class DndErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("DND Rendering Error:", error, errorInfo);
    // Optionally log to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 my-2 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
          <h3 className="font-bold text-lg">Drag & Drop Error</h3>
          <p>Something went wrong while rendering the task list. Please try refreshing the page.</p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="mt-2 text-xs whitespace-pre-wrap bg-red-50 p-2 rounded">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

const TaskList = ({ tasks, onDeleteTask }) => {
    if (tasks.length === 0) {
        return (
            <div className="mt-2 text-center py-16 px-6 sm:px-8 bg-white rounded-xl border border-slate-200/80 shadow-sm"> {/* Added mt-2 for spacing */}
                <div className="flex justify-center mb-6 text-slate-400">
                    {/* Modern empty state icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="64" height="64" fill="currentColor"><rect width="256" height="256" fill="none"/><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208Z" opacity="0.2"/><path d="M208,24H48A24.1,24.1,0,0,0,24,48V208a24.1,24.1,0,0,0,24,24H208a24.1,24.1,0,0,0,24-24V48A24.1,24.1,0,0,0,208,24Zm8,184a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Z"/><line x1="112" y1="112" x2="112" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="144" y1="112" x2="144" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="80" y1="112" x2="80" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/><line x1="176" y1="112" x2="176" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/></svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    Your Task List is Empty
                </h3>
                <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base">
                    No tasks yet! Add a new task above to begin organizing. Drag and drop to set priorities.
                </p>
            </div>
        );
    }

    return (
        <DndErrorBoundary>
            <Droppable droppableId="taskList">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
                            mt-2 /* Added for spacing from TaskInput */
                            min-h-[160px] /* Ensure dropzone is always available */
                            space-y-3 /* Spacing between task items */
                            p-4 sm:p-5 
                            rounded-xl 
                            border 
                            transition-all duration-300 ease-in-out
                            ${
                                snapshot.isDraggingOver
                                    ? "bg-sky-50 border-sky-400 shadow-inner ring-2 ring-sky-300 ring-opacity-50" /* Visual indicator for drop zone */
                                    : "bg-slate-50 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 shadow-sm" /* Subtle background and hover */
                            }
                        `}
                    >
                        {tasks.map((task, index) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                index={index}
                                onDelete={onDeleteTask}
                            />
                        ))}
                        {provided.placeholder} 
                        {/* 
                            Placeholder for react-beautiful-dnd to manage space during drag.
                            Smooth animations for task reordering are handled by react-beautiful-dnd
                            and the CSS transitions on TaskItem.js.
                        */}
                    </div>
                )}
            </Droppable>
        </DndErrorBoundary>
    );
};

export default TaskList;