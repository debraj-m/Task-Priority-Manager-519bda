import React, { useState, useEffect } from "react";

const TaskInput = ({ onAddTask }) => {
    const [taskText, setTaskText] = useState("");
    const [isAdded, setIsAdded] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskText.trim()) {
            onAddTask(taskText.trim());
            setTaskText("");
            setIsAdded(true); // Trigger success feedback
        }
    };

    useEffect(() => {
        if (isAdded) {
            const timer = setTimeout(() => {
                setIsAdded(false);
            }, 1500); // Reset feedback after 1.5 seconds
            return () => clearTimeout(timer);
        }
    }, [isAdded]);

    return (
        <form 
            onSubmit={handleSubmit}
            className="mb-8 flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4"
        >
            <div className="relative flex-1 group"> {/* Group for focus-within icon color change */}
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 z-10 group-focus-within:text-sky-600 transition-colors duration-200">
                    {/* Modern clipboard/task icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><rect width="256" height="256" fill="none"/><path d="M88,64V48a8,8,0,0,1,8-8h64a8,8,0,0,1,8,8V64Z" opacity="0.2"/><path d="M176,24H80A16,16,0,0,0,64,40V216a16,16,0,0,0,16,16h96a16,16,0,0,0,16-16V40A16,16,0,0,0,176,24ZM80,40h96V64H80ZM176,216H80V80H176Z"/><rect x="104" y="112" width="48" height="16" rx="8" opacity="0.2"/><path d="M152,104H104a8,8,0,0,0-8,8v16a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V112A8,8,0,0,0,152,104Zm-8,16H112v-8h32Z"/><rect x="104" y="160" width="48" height="16" rx="8" opacity="0.2"/><path d="M152,152H104a8,8,0,0,0-8,8v16a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V160A8,8,0,0,0,152,152Zm-8,16H112v-8h32Z"/></svg>
                </span>
                <input
                    type="text"
                    id="task-input-field"
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    placeholder=" " /* Crucial for floating label: placeholder-shown */
                    className={`
                        peer block w-full 
                        pl-11 pr-4 py-3.5 /* Padding: left for icon, py for height */
                        text-slate-900 placeholder-transparent /* Placeholder hidden, label acts as one */
                        border 
                        rounded-xl 
                        shadow-sm 
                        focus:outline-none focus:ring-2 focus:border-sky-500 
                        hover:border-slate-400
                        transition-all duration-200 ease-in-out
                        text-sm sm:text-base
                        ${isAdded ? "border-green-500 focus:ring-green-500" : "border-slate-300 focus:ring-sky-500"}
                    `}
                    maxLength="120"
                />
                <label
                    htmlFor="task-input-field"
                    className={`
                        absolute left-11 top-1/2 -translate-y-1/2 /* Initial position: mimic placeholder */
                        text-sm sm:text-base 
                        pointer-events-none 
                        transition-all duration-200 ease-in-out 
                        
                        /* Floating label state: when input is focused OR has content */
                        peer-focus:left-3.5 peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs 
                        peer-[:not(:placeholder-shown)]:left-3.5 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs
                        ${isAdded 
                            ? "peer-focus:text-green-600 peer-[:not(:placeholder-shown)]:text-green-600" 
                            : "peer-focus:text-sky-600 peer-[:not(:placeholder-shown)]:text-sky-600 text-slate-500"
                        }
                    `}
                >
                    {isAdded ? "Task Added!" : "Add a new task..."}
                </label>
            </div>
            <button
                type="submit"
                disabled={!taskText.trim() || isAdded} // Disable during success feedback too
                title="Add new task"
                className={`
                    px-5 sm:px-6 py-3.5 /* Consistent vertical padding with input */
                    text-white 
                    rounded-xl 
                    font-medium text-sm sm:text-base
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 
                    transition-all duration-200 ease-in-out 
                    shadow-md hover:shadow-lg
                    transform hover:-translate-y-px active:translate-y-0 
                    disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed 
                    flex items-center justify-center gap-2 shrink-0 
                    ${isAdded 
                        ? "bg-green-500 hover:bg-green-600 focus:ring-green-500" 
                        : "bg-sky-600 hover:bg-sky-700 focus:ring-sky-500"
                    }
                    disabled:bg-slate-300 disabled:text-slate-500
                `}
            >
                {isAdded ? (
                    <>
                        <span>Added</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18" fill="currentColor"><rect width="256" height="256" fill="none"/><polyline points="216 72 104 184 48 128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></svg>
                    </>
                ) : (
                    <>
                        <span>Add Task</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18" fill="currentColor"><rect width="256" height="256" fill="none"/><line x1="128" y1="40" x2="128" y2="216" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></svg>
                    </>
                )}
            </button>
        </form>
    );
};

export default TaskInput;