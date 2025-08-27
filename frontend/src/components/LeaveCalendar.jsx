import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function LeaveCalendar({ leaves, onRefresh }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const calendarEvents = leaves.map(leave => ({
            id: leave.id,
            title: `${leave.leave_type} - ${leave.status}`,
            start: leave.start_date,
            end: leave.end_date,
            backgroundColor: getEventColor(leave.status),
            borderColor: getEventColor(leave.status),
            extendedProps: {
                leaveType: leave.leave_type,
                status: leave.status,
                reason: leave.reason || '',
                staff: leave.staff || ''
            }
        }));
        setEvents(calendarEvents);
    }, [leaves]);

    const getEventColor = (status) => {
        const colorMap = {
            APPROVED: '#10B981', 
            PENDING: '#F59E0B', 
            REJECTED: '#EF4444', 
            CANCELLED: '#6B7280'
        };
        return colorMap[status] || '#6B7280';
    };

    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event;
        const extendedProps = event.extendedProps;
        
        alert(`Leave Details:
        Type: ${extendedProps.leaveType}
        Status: ${extendedProps.status}
        Dates: ${event.start.toDateString()} - ${event.end ? event.end.toDateString() : 'Same day'}
        ${extendedProps.staff ? `Staff: ${extendedProps.staff}` : ''}
        ${extendedProps.reason ? `Reason: ${extendedProps.reason}` : ''}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Leave Calendar</h2>
                <button 
                    onClick={onRefresh} 
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
                    dayMaxEvents={3}
                    moreLinkClick="popover"
                    eventDidMount={(info) => {
                        // Add custom styling or tooltips if needed
                        info.el.setAttribute('title', `${info.event.title}`);
                    }}
                    dayCellClassNames="hover:bg-gray-50"
                    eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
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

export default LeaveCalendar;
