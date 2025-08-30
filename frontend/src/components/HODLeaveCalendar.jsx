import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { toast } from 'react-toastify';

function HODLeaveCalendar({ onRefresh }) {
    const [events, setEvents] = useState([]);

    const fetchCalendarData = async () => {
        try {
            const response = await axios.get('/api/hod/leaves/department_calendar/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            const calendarEvents = response.data.map(leave => {
                const startDate = new Date(leave.start);
                const endDate = leave.end ? new Date(leave.end) : null;

                if (isNaN(startDate.getTime())) {
                    console.error("Invalid start date found in leave data:", leave);
                    return null;
                }
                if (endDate && isNaN(endDate.getTime())) {
                    console.error("Invalid end date found in leave data:", leave);
                    return null;
                }

                return {
                    id: leave.id,
                    title: leave.title,
                    start: startDate,
                    end: endDate,
                    backgroundColor: getEventColor(leave.status),
                    borderColor: getEventColor(leave.status),
                    extendedProps: {
                        staffName: leave.staff_name || leave.user?.username,
                        leaveType: leave.type,
                        status: leave.status,
                        reason: leave.reason || '',
                        department: leave.department || ''
                    }
                };
            }).filter(event => event !== null);

            setEvents(calendarEvents);
        } catch (error) {
            console.error("Error fetching calendar data:", error);
            toast.error("Failed to load calendar data.");
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
                <p><strong>Staff:</strong> {extendedProps.staffName}</p>
                <p><strong>Type:</strong> {extendedProps.leaveType}</p>
                <p><strong>Status:</strong> {extendedProps.status}</p>
                <p><strong>Dates:</strong> {event.start.toDateString()} - {event.end ? event.end.toDateString() : 'Same day'}</p>
                {extendedProps.department && <p><strong>Department:</strong> {extendedProps.department}</p>}
                {extendedProps.reason && <p><strong>Reason:</strong> {extendedProps.reason}</p>}
            </div>,
            { autoClose: 5000 }
        );
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-6xl mx-auto my-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900">Department Leave Calendar</h2>
                <button 
                    onClick={fetchCalendarData} 
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
                    dayMaxEvents={4}
                    moreLinkClick="popover"
                    eventDidMount={(info) => {
                        info.el.setAttribute('title', `${info.event.title} - ${info.event.extendedProps.status}`);
                    }}
                    dayCellClassNames="hover:bg-blue-50 transition-colors"
                    eventClassNames="cursor-pointer hover:opacity-90 transition-opacity p-1 rounded-md text-white text-xs"
                    eventContent={(arg) => {
                        return {
                            html: `<div class="font-medium text-white">${arg.event.extendedProps.staffName}</div>
                                   <div class="text-white text-opacity-90">${arg.event.extendedProps.leaveType}</div>`
                        };
                    }}
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

export default HODLeaveCalendar;
