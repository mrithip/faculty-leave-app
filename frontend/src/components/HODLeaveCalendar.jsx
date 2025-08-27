import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

function HODLeaveCalendar({ onRefresh }) {
    const [events, setEvents] = useState([]);

    const fetchCalendarData = async () => {
        try {
            const response = await axios.get('/api/hod/leaves/department_calendar/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            console.log("Calendar API Response:", response.data); // Added console log
            const calendarEvents = response.data.map(leave => {
                // Ensure dates are valid Date objects
                // The backend returns ISO strings like "2025-08-27T21:00:00+00:00"
                // The Date constructor should handle this format.
                const startDate = new Date(leave.start);
                const endDate = leave.end ? new Date(leave.end) : null;

                // Check if dates are valid
                if (isNaN(startDate.getTime())) {
                    console.error("Invalid start date found in leave data:", leave);
                    return null; // Skip this event if start date is invalid
                }
                if (endDate && isNaN(endDate.getTime())) {
                    console.error("Invalid end date found in leave data:", leave);
                    return null; // Skip this event if end date is invalid
                }

                return {
                    id: leave.id,
                    title: leave.title, // Use the title directly from backend response
                    start: startDate,
                    end: endDate,
                    backgroundColor: getEventColor(leave.status),
                    borderColor: getEventColor(leave.status),
                    extendedProps: {
                        staffName: leave.staff_name || leave.user?.username,
                        leaveType: leave.type, // Use 'type' from backend response
                        status: leave.status,
                        reason: leave.reason || '',
                        department: leave.department || ''
                    }
                };
            }).filter(event => event !== null); // Filter out any null events due to invalid dates

            setEvents(calendarEvents);
            console.log("Events state after setEvents:", calendarEvents); // Log the state after setting it
        } catch (error) {
            console.error("Error fetching calendar data:", error);
        }
    };

    useEffect(() => {
        fetchCalendarData();
    }, []);

    const getEventColor = (status) => {
        const colorMap = {
            'APPROVED': '#10B981',  // Green
            'PENDING': '#F59E0B',   // Amber
            'REJECTED': '#EF4444',  // Red
            'CANCELLED': '#6B7280', // Gray
        };
        return colorMap[status] || '#6B7280';
    };

    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event;
        const extendedProps = event.extendedProps;
        
        alert(`Leave Details:
        Staff: ${extendedProps.staffName}
        Type: ${extendedProps.leaveType}
        Status: ${extendedProps.status}
        Dates: ${event.start.toDateString()} - ${event.end ? event.end.toDateString() : 'Same day'}
        ${extendedProps.department ? `Department: ${extendedProps.department}` : ''}
        ${extendedProps.reason ? `Reason: ${extendedProps.reason}` : ''}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Department Leave Calendar</h2>
                <button 
                    onClick={fetchCalendarData} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                    Refresh
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    eventClick={handleEventClick}
                    height="auto"
                    eventDisplay="block"
                    dayMaxEvents={4}
                    moreLinkClick="popover"
                    eventDidMount={(info) => {
                        // Add custom styling or tooltips if needed
                        info.el.setAttribute('title', `${info.event.title} - ${info.event.extendedProps.status}`);
                    }}
                    dayCellClassNames="hover:bg-gray-50"
                    eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
                    eventContent={(arg) => {
                        return {
                            html: `<div class="text-xs font-medium">${arg.event.extendedProps.staffName}</div>
                                   <div class="text-xs">${arg.event.extendedProps.leaveType}</div>`
                        };
                    }}
                />
            </div>

            <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span className="text-sm">Approved</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-500 rounded mr-2"></div>
                    <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span className="text-sm">Rejected</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
                    <span className="text-sm">Pending-for-Principal-Approval</span>
                </div>
            </div>
        </div>
    );
}

export default HODLeaveCalendar;
