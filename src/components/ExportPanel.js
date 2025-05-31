import React, { useState, useEffect, useRef } from "react";

const ExportPanel = ({ tasks }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [copyStatus, setCopyStatus] = useState({ success: false, message: "", inProgress: false });
    const [jsonStatus, setJsonStatus] = useState({ success: false, message: "", inProgress: false });
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    useEffect(() => {
        if (!isDropdownOpen) return;

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const resetStatus = (statusSetter) => {
        setTimeout(() => statusSetter({ success: false, message: "", inProgress: false }), 2500);
    };

    const handleJsonExport = () => {
        if (tasks.length === 0) {
            setJsonStatus({ success: false, message: "No Tasks", inProgress: false });
            setIsDropdownOpen(false);
            resetStatus(setJsonStatus);
            return;
        }
        setJsonStatus({ success: false, message: "Exporting...", inProgress: true });
        
        const jsonData = JSON.stringify(tasks, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "taskflow-priorities.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setJsonStatus({ success: true, message: "Exported!", inProgress: false });
        setIsDropdownOpen(false);
        resetStatus(setJsonStatus);
    };

    const handleCopyText = () => {
        if (tasks.length === 0) {
            setCopyStatus({ success: false, message: "No Tasks", inProgress: false });
            setIsDropdownOpen(false);
            resetStatus(setCopyStatus);
            return;
        }
        setCopyStatus({ success: false, message: "Copying...", inProgress: true });

        const textContent = tasks
            .map((task, index) => `${index + 1}. ${task.content}`)
            .join("\n");
        
        navigator.clipboard.writeText(textContent)
            .then(() => {
                setCopyStatus({ success: true, message: "Copied!", inProgress: false });
                setIsDropdownOpen(false);
                resetStatus(setCopyStatus);
            })
            .catch(err => {
                console.error("Failed to copy tasks:", err);
                setCopyStatus({ success: false, message: "Copy Failed", inProgress: false });
                setIsDropdownOpen(false);
                resetStatus(setCopyStatus);
            });
    };

    const getButtonClass = (status) => {
        if (status.inProgress) return "w-full flex items-center justify-start gap-3 px-4 py-2.5 text-sm font-medium text-sky-700 bg-sky-50 cursor-wait rounded-lg";
        if (status.success) return "w-full flex items-center justify-start gap-3 px-4 py-2.5 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:bg-green-100 focus:outline-none transition-all duration-150 rounded-lg";
        if (status.message && !status.success) return "w-full flex items-center justify-start gap-3 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:bg-red-100 focus:outline-none transition-all duration-150 rounded-lg";
        return "w-full flex items-center justify-start gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none transition-all duration-150 rounded-lg";
    };
    
    const getDropdownButtonText = () => {
        if (jsonStatus.message) return jsonStatus.message;
        if (copyStatus.message) return copyStatus.message;
        return "Select Export Method";
    };

    const getDropdownButtonTextColor = () => {
        if (jsonStatus.inProgress || copyStatus.inProgress) return "text-sky-600";
        if (jsonStatus.success || copyStatus.success) return "text-green-600";
        if ((jsonStatus.message && !jsonStatus.success && !jsonStatus.inProgress) || (copyStatus.message && !copyStatus.success && !copyStatus.inProgress)) return "text-red-600";
        return "text-slate-700";
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200/70 p-6 sm:p-8"> {/* Modern card design */}
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor" className="text-sky-600"><rect width="256" height="256" fill="none"/><path d="M72,160H56a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8H72Z" opacity="0.2"/><path d="M208,88H184V72a8,8,0,0,0-8-8H80a8,8,0,0,0-8,8v16H48a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16H72v16a8,8,0,0,0,8,8h96a8,8,0,0,0,8-8V168h24a16,16,0,0,0,16-16V104A16,16,0,0,0,208,88Zm-40,88H88V160h80Zm0-32H88V128h80Zm0-32H88V80h80ZM56,104H72v48H56Zm144,48H184V104h16Z"/></svg>
                Export Options
            </h2>
            
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    type="button"
                    title="Choose export format"
                    className={`
                        w-full flex items-center justify-between 
                        px-4 py-3 
                        bg-slate-50 hover:bg-slate-100 
                        border border-slate-300 
                        rounded-lg shadow-sm 
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500 
                        transition-all duration-200 ease-in-out group
                    `}
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                >
                    <span className={`font-medium transition-colors duration-200 ${getDropdownButtonTextColor()}`}>
                        {getDropdownButtonText()}
                    </span>
                    <svg 
                        className={`w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-all duration-200 ${isDropdownOpen ? "transform rotate-180" : ""}`} 
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><rect width="256" height="256" fill="none"/><polyline points="208 96 128 176 48 96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></svg>
                </button>

                {isDropdownOpen && (
                    <div
                        className="absolute z-20 mt-2 w-full origin-top-right bg-white rounded-lg shadow-2xl ring-1 ring-slate-900/10 focus:outline-none p-2 space-y-1 transition-all duration-100 ease-out transform animate-fadeInScaleUp"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        <button
                            onClick={handleJsonExport}
                            title={tasks.length === 0 ? "Add tasks to enable JSON export" : "Download tasks as a JSON file"}
                            className={getButtonClass(jsonStatus)}
                            role="menuitem"
                            disabled={tasks.length === 0 && !jsonStatus.message || jsonStatus.inProgress}
                        >
                            {jsonStatus.inProgress ? (
                               <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : jsonStatus.success ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><rect width="256" height="256" fill="none"/><polyline points="216 72 104 184 48 128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><rect width="256" height="256" fill="none"/><polyline points="88 160 40 160 40 96 88 96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><polyline points="168 160 216 160 216 96 168 96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="144" y1="96" x2="112" y2="160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></svg>
                            )}
                            <span className="truncate">{jsonStatus.message ? jsonStatus.message : "Export as JSON"}</span>
                        </button>
                        
                        <button
                            onClick={handleCopyText}
                            title={tasks.length === 0 ? "Add tasks to enable copying" : "Copy tasks to clipboard as plain text"}
                            className={getButtonClass(copyStatus)}
                            role="menuitem"
                            disabled={tasks.length === 0 && !copyStatus.message || copyStatus.inProgress}
                        >
                             {copyStatus.inProgress ? (
                               <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : copyStatus.success ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><rect width="256" height="256" fill="none"/><polyline points="216 72 104 184 48 128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></svg>
                            ) : (copyStatus.message && !copyStatus.success) ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="128" y1="132" x2="128" y2="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><circle cx="128" cy="172" r="16"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><rect width="256" height="256" fill="none"/><path d="M160,40h40a8,8,0,0,1,8,8V216a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><path d="M88,72V64a40,40,0,0,1,80,0v8Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></svg>
                            )}
                            <span className="truncate">{copyStatus.message ? copyStatus.message : "Copy as Text"}</span>
                        </button>
                    </div>
                )}
            </div>

            <p className="mt-6 text-sm text-slate-600 leading-relaxed">
                Quickly export your prioritized tasks. Download as a JSON file for backup or integrations, or copy them as a numbered list for easy sharing.
            </p>
            
            {/* Minimal CSS for dropdown animation, ensure it's available or defined globally */}
            <style jsx global>{`
                @keyframes fadeInScaleUp {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-5px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-fadeInScaleUp {
                    animation: fadeInScaleUp 0.1s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ExportPanel;