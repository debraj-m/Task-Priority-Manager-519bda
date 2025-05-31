import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext } from "react-beautiful-dnd";
import TaskList from "./components/TaskList";
import TaskInput from "./components/TaskInput";
import ExportPanel from "./components/ExportPanel";
import { saveTasks, getTasks, isLocalStorageAvailable } from "./utils/localStorage";

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [storageAvailable, setStorageAvailable] = useState(true);

    // Initialize tasks from localStorage on component mount
    useEffect(() => {
        const storage = isLocalStorageAvailable();
        setStorageAvailable(storage);
        
        if (storage) {
            const savedTasks = getTasks();
            setTasks(savedTasks);
        }
    }, []);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        if (storageAvailable) {
             saveTasks(tasks);
        }
    }, [tasks, storageAvailable]);

    const handleAddTask = (content) => {
        const newTask = {
            id: uuidv4(),
            content,
            createdAt: new Date().toISOString()
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    const handleDeleteTask = (taskId) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // Dropped outside the list (destination is null)
        if (!destination) {
            return;
        }

        // Dropped in the same place
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Reorder tasks
        const reorderedTasks = Array.from(tasks);
        const [movedItem] = reorderedTasks.splice(source.index, 1);
        reorderedTasks.splice(destination.index, 0, movedItem);

        setTasks(reorderedTasks);
    };

    return (
        // Responsive container with subtle gradient background and proper padding
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-inter selection:bg-sky-200 selection:text-sky-900">
            
            {/* Modern Header Section */}
            <header className="max-w-3xl mx-auto mb-10 sm:mb-12 text-center">
                <div className="flex justify-center items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="48" height="48" className="text-sky-600 drop-shadow-sm"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="20"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="20"/></svg>
                    <h1 className="ml-3 text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">
                        TaskFlow
                    </h1>
                </div>
                <p className="text-lg text-slate-600 text-balance"> {/* Using text-balance for better flow */}
                    Organize, prioritize, and accomplish more with seamless clarity.
                </p>
            </header>

            {/* Max-width container for main content, centered */}
            <div className="max-w-3xl mx-auto">
                
                {/* Storage Warning - Placed above the main card for visibility */}
                {!storageAvailable && (
                    <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" className="text-yellow-600"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="20"/><line x1="128" y1="132" x2="128" y2="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="20"/><circle cx="128" cy="172" r="12" fill="currentColor"/></svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">
                                    Local storage is not available. Your tasks won&quot;t be saved between sessions.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Card - with appropriate padding and shadow */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-6 sm:p-8 lg:p-10">
                        <TaskInput onAddTask={handleAddTask} /> {/* TaskInput's internal form has mb-8 */}
                        
                        {/* Wrapper for TaskList. Removed mt-8 sm:mt-10. 
                            Space above TaskList is now primarily from TaskInput's internal mb-8.
                        */}
                        <div> 
                            <TaskList
                                tasks={tasks}
                                onDeleteTask={handleDeleteTask}
                            />
                        </div>

                        {tasks.length > 0 && (
                            /* Wrapper for ExportPanel. Its mt-8 sm:mt-10 provides space 
                               BETWEEN TaskList and ExportPanel.
                            */
                            <div className="mt-8 sm:mt-10"> 
                                <ExportPanel tasks={tasks} />
                            </div>
                        )}
                    </div>
                </DragDropContext>

                {/* Footer Section */}
                <footer className="mt-12 sm:mt-16 text-center text-slate-500 text-sm">
                    <p>
                        Drag tasks to reorder • {storageAvailable ? "Data saved automatically to local storage." : "Data is not being saved."}
                    </p>
                    <p className="mt-1">
                        Crafted with React & Tailwind CSS.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default App;