import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { toast } from 'react-toastify';

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
            'APPROVED': '#10B981',  // Green
            'PENDING': '#F59E0B',   // Amber
            'REJECTED': '#EF4444',  // Red
            'CANCELLED': '#6B7280', // Gray
            'PENDING_PRINCIPAL': '#8B5CF6' // Purple for pending principal approval
        };
        return colorMap[status] || '#6B7280';
    };

    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event;
        const extendedProps = event.extendedProps;
        
        toast.info(
            <div>
                <h4 className="font-bold text-lg mb-1">Leave Details</h4>
                <p><strong>Type:</strong> {extendedProps.leaveType}</p>
                <p><strong>Status:</strong> {extendedProps.status}</p>
                <p><strong>Dates:</strong> {event.start.toDateString()} - {event.end ? event.end.toDateString() : 'Same day'}</p>
                {extendedProps.staff && <p><strong>Staff:</strong> {extendedProps.staff}</p>}
                {extendedProps.reason && <p><strong>Reason:</strong> {extendedProps.reason}</p>}
            </div>,
            { autoClose: 5000 }
        );
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-6xl mx-auto my-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900">My Leave Calendar</h2>
                <button 
                    onClick={onRefresh} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-base font-medium transition-colors shadow-md"
                >
                    Refresh Calendar
                </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl shadow-inner border border-gray-200 p-4">
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
                        info.el.setAttribute('title', `${info.event.title}`);
                    }}
                    dayCellClassNames="hover:bg-blue-50 transition-colors"
                    eventClassNames="cursor-pointer hover:opacity-90 transition-opacity p-1 rounded-md text-white text-xs"
                />
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2 shadow-sm"></div>
                    <span className="text-sm text-gray-700 font-medium">Approved</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-500 rounded-full mr-2 shadow-sm"></div>
                    <span className="text-sm text-gray-700 font-medium">Pending (HOD)</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-600 rounded-full mr-2 shadow-sm"></div>
                    <span className="text-sm text-gray-700 font-medium">Pending (Principal)</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2 shadow-sm"></div>
                    <span className="text-sm text-gray-700 font-medium">Rejected</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-500 rounded-full mr-2 shadow-sm"></div>
                    <span className="text-sm text-gray-700 font-medium">Cancelled</span>
                </div>
            </div>
        </div>
    );
}

export default LeaveCalendar;
