import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { STAFF_DATA, STAFF_PERFORMANCE_DATA } from '../../constants';
import type { StaffMember, Shift, ShiftSwapRequest, StaffPerformanceData, StaffAvailability, TimeClockEntry } from '../../types';
import { XIcon } from '../icons/Icons';
import AddShiftModal from './AddShiftModal';
import TimeClock from './TimeClock';

const StaffPerformanceCard: React.FC<{ staff: StaffMember, performance: StaffPerformanceData | undefined }> = ({ staff, performance }) => {
  if (!performance || !['Server', 'Bartender'].includes(staff.role)) {
    return null;
  }
  return (
    <Card title={staff.name} className="bg-brand-primary/40">
       <p className="text-sm text-gray-400 mb-4 -mt-2">{staff.role}</p>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">Total Sales</p>
          <p className="font-bold text-lg text-green-400">${performance.totalSales.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400">Avg. Check Size</p>
          <p className="font-bold text-lg">${performance.averageCheckSize.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-400">Upsell Rate</p>
          <p className="font-bold text-lg">{performance.upsellRate}%</p>
        </div>
        <div>
          <p className="text-gray-400">Avg. Tip %</p>
          <p className="font-bold text-lg">{performance.averageTipPercentage}%</p>
        </div>
      </div>
    </Card>
  );
};

const ManagerApprovalSection: React.FC<{
    requests: ShiftSwapRequest[];
    shifts: Shift[];
    onAction: (action: 'approve' | 'deny', shift: Shift, request: ShiftSwapRequest) => void;
}> = ({ requests, shifts, onAction }) => {
    const pendingApproval = requests.filter(r => r.status === 'pending-approval');

    const getStaffName = (id: number) => STAFF_DATA.find(s => s.id === id)?.name || 'Unknown';
    const getShiftInfo = (id: number) => shifts.find(s => s.id === id);

    return (
        <Card title="Pending Shift Approvals" className="mt-6 border-l-4 border-yellow-500">
            {pendingApproval.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No shift swaps are currently pending approval.</p>
            ) : (
                <div className="space-y-3">
                    {pendingApproval.map(req => {
                        const shift = getShiftInfo(req.shiftId);
                        if (!shift || !req.coveringStaffId) return null;
                        return (
                            <div key={req.id} className="bg-brand-primary/50 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <div>
                                    <p className="font-semibold">
                                        <span className="text-brand-accent">{getStaffName(req.coveringStaffId)}</span> wants to cover shift for <span className="text-brand-accent">{getStaffName(req.requestingStaffId)}</span>.
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Shift: {shift.day}, {shift.startTime} - {shift.endTime}
                                    </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <Button onClick={() => onAction('approve', shift, req)} variant="primary" className="text-sm px-3 py-1">Approve</Button>
                                    <Button onClick={() => onAction('deny', shift, req)} variant="danger" className="text-sm px-3 py-1">Deny</Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

const ShiftActionModal: React.FC<{
    shift: Shift;
    request: ShiftSwapRequest | undefined;
    currentUser: StaffMember;
    onClose: () => void;
    onAction: (action: 'offer' | 'claim' | 'deny', shift: Shift, request?: ShiftSwapRequest) => void;
}> = ({ shift, request, currentUser, onClose, onAction }) => {
    const isOwner = shift.staffId === currentUser.id;
    const staff = STAFF_DATA.find(s => s.id === shift.staffId);

    const handleAction = (action: 'offer' | 'claim' | 'deny') => {
        onAction(action, shift, request);
        onClose();
    }
    
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card title={`Shift: ${shift.day} ${shift.startTime}-${shift.endTime}`} className="w-full max-w-md">
                <p className="mb-4">Assigned to: <span className="font-bold text-brand-accent">{staff?.name}</span></p>
                
                {isOwner && !request && (
                    <Button onClick={() => handleAction('offer')} className="w-full">Offer Shift for Coverage</Button>
                )}

                {request?.status === 'pending-coverage' && !isOwner && (
                    <Button onClick={() => handleAction('claim')} variant="primary" className="w-full">Claim this Shift</Button>
                )}

                {request?.status === 'pending-coverage' && (
                    <p className="text-center text-yellow-400 font-semibold p-3 bg-yellow-500/10 rounded-lg mt-4">This shift is available for coverage.</p>
                )}

                {request?.status === 'pending-approval' && (
                     <p className="text-center text-blue-400 font-semibold p-3 bg-blue-500/10 rounded-lg mt-4">A claim for this shift is pending manager approval.</p>
                )}

                {currentUser.role === 'Manager' && request?.status === 'pending-coverage' && (
                     <Button onClick={() => handleAction('deny')} variant="danger" className="w-full mt-2 text-sm">Cancel Offer</Button>
                )}

                <Button onClick={onClose} variant="secondary" className="w-full mt-4">Close</Button>
            </Card>
        </div>
    );
};

const ScheduleGridCell: React.FC<{
  staff: StaffMember;
  day: Shift['day'];
  shift?: Shift;
  availability?: StaffAvailability;
  request?: ShiftSwapRequest;
  currentUser: StaffMember;
  isDropZone: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onShiftClick: () => void;
  onDeleteShift: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onAddShiftClick: () => void;
  onSetAvailability: () => void;
}> = ({
  staff, day, shift, availability, request, currentUser, isDropZone,
  onDragOver, onDrop, onDragStart, onDragEnd, onShiftClick, onDeleteShift, onAddShiftClick, onSetAvailability
}) => {
  const isManager = currentUser.role === 'Manager';
  const isOwnRow = currentUser.id === staff.id;

  return (
    <div
      className={`p-1 bg-brand-dark min-h-[70px] space-y-1 transition-colors ${isDropZone ? 'bg-brand-secondary/20' : ''}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {shift ? (
        (() => {
          let bgColor = 'bg-brand-secondary/30';
          let statusText: string | null = null;

          if (request?.status === 'pending-coverage') {
            bgColor = 'bg-yellow-500/30 hover:bg-yellow-500/40';
            statusText = 'Offered';
          } else if (request?.status === 'pending-approval') {
            bgColor = 'bg-blue-500/30 hover:bg-blue-500/40';
            statusText = 'Claimed';
          } else if (request?.status === 'approved') {
            bgColor = 'bg-green-500/30';
            statusText = 'Swapped';
          } else {
            bgColor += ' hover:bg-brand-secondary/40';
          }

          return (
            <div
              onClick={onShiftClick}
              draggable={isManager}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              className={`relative group text-xs p-1.5 rounded transition-colors text-center h-full flex flex-col justify-center ${bgColor} ${isManager ? 'cursor-grab' : 'cursor-pointer'}`}
            >
              <p className="font-bold">{shift.startTime} - {shift.endTime}</p>
              {statusText && <p className="font-bold mt-1 text-[10px] uppercase tracking-wider">{statusText}</p>}
              {isManager && (
                <button
                  onClick={onDeleteShift}
                  className="absolute -top-1.5 -right-1.5 bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Delete shift"
                >
                  <XIcon className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
          )
        })()
      ) : (
        (() => {
          let cellClasses = 'hover:bg-brand-primary/50 group';
          let cursorClass = 'cursor-pointer';
          let content: React.ReactNode = null;

          if (availability) {
            if (availability.status === 'available') {
              cellClasses = 'bg-green-500/20';
              content = <span className="text-sm font-semibold text-green-400">Available</span>;
            } else if (availability.status === 'unavailable') {
              cellClasses = 'bg-red-500/20';
              content = <span className="text-sm font-semibold text-red-400">Unavailable</span>;
            }
          }

          const handleClick = () => {
            if (isManager) {
              onAddShiftClick();
            } else if (isOwnRow) {
              onSetAvailability();
            }
          };

          if (isManager) {
            cursorClass = 'cursor-copy';
            if (!content) {
              content = <span className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">+ Add Shift</span>;
            }
          } else if (!isOwnRow) {
            cursorClass = 'cursor-default';
            if (availability?.status === 'available') cellClasses = 'bg-green-500/20';
            else if (availability?.status === 'unavailable') cellClasses = 'bg-red-500/20';
            else cellClasses = '';
          }

          return (
            <div
              className={`w-full h-full flex items-center justify-center rounded transition-colors p-1 ${cellClasses} ${cursorClass}`}
              onClick={handleClick}
              aria-label={`Set availability for ${staff.name} on ${day}`}
            >
              {content}
            </div>
          );
        })()
      )}
    </div>
  );
};

interface StaffScheduleProps {
    shifts: Shift[];
    swapRequests: ShiftSwapRequest[];
    staffAvailability: StaffAvailability[];
    onShiftAction: (action: 'offer' | 'claim' | 'approve' | 'deny', shift: Shift, request?: ShiftSwapRequest) => void;
    onUpdateShift: (shiftId: number, newDay: Shift['day']) => void;
    onAddShift: (staffId: number, day: Shift['day'], startTime: string, endTime: string) => void;
    onDeleteShift: (shiftId: number) => void;
    onSetAvailability: (staffId: number, day: Shift['day']) => void;
    currentUser: StaffMember;
    timeClockEntries: TimeClockEntry[];
    onClockIn: (staffId: number) => void;
    onClockOut: (staffId: number) => void;
}

const calculateShiftHours = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    let [endHours, endMinutes] = endTime.split(':').map(Number);

    if (endHours === 0 && endMinutes === 0 && (startHours > 0 || startMinutes > 0)) {
        endHours = 24;
    }

    const startTotalMinutes = startHours * 60 + startMinutes;
    let endTotalMinutes = endHours * 60 + endMinutes;

    let durationInMinutes;
    if (endTotalMinutes < startTotalMinutes) {
        durationInMinutes = (24 * 60 - startTotalMinutes) + endTotalMinutes;
    } else {
        durationInMinutes = endTotalMinutes - startTotalMinutes;
    }

    return durationInMinutes / 60;
};

const StaffSchedule: React.FC<StaffScheduleProps> = ({ 
    shifts, 
    swapRequests, 
    staffAvailability, 
    onShiftAction, 
    onUpdateShift, 
    onAddShift, 
    onDeleteShift, 
    onSetAvailability, 
    currentUser,
    timeClockEntries,
    onClockIn,
    onClockOut
}) => {
    const [activeTab, setActiveTab] = useState<'schedule' | 'performance'>('schedule');
    const [modalShift, setModalShift] = useState<Shift | null>(null);
    const [draggedShift, setDraggedShift] = useState<{ id: number; staffId: number } | null>(null);
    const [addShiftModalData, setAddShiftModalData] = useState<{ staff: StaffMember; day: Shift['day'] } | null>(null);

    const days: Shift['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const isManager = currentUser.role === 'Manager';

    const handleShiftClick = (shift: Shift) => {
        if (isManager) return;
        const request = swapRequests.find(r => r.shiftId === shift.id);
        if (request && (request.status === 'approved' || request.status === 'denied')) return;
        setModalShift(shift);
    }
    
    const performanceStaff = STAFF_DATA.filter(s => s.role === 'Server' || s.role === 'Bartender');
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, shift: Shift) => {
        if (!isManager) return;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('shiftId', shift.id.toString());
        setDraggedShift({ id: shift.id, staffId: shift.staffId });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, staffId: number) => {
        if (draggedShift && draggedShift.staffId === staffId) {
            e.preventDefault();
        }
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: Shift['day'], staffId: number) => {
        e.preventDefault();
        if (draggedShift && draggedShift.staffId === staffId) {
            const shiftId = parseInt(e.dataTransfer.getData('shiftId'), 10);
            if (!isNaN(shiftId)) {
                onUpdateShift(shiftId, day);
            }
        }
        setDraggedShift(null);
    };

    const handleDragEnd = () => {
        setDraggedShift(null);
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-bold text-white">Staff Management</h1>
                <div className="flex bg-brand-primary p-1 rounded-lg self-start sm:self-center">
                    <button onClick={() => setActiveTab('schedule')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'schedule' ? 'bg-brand-secondary text-white' : 'text-gray-300 hover:bg-brand-primary/80'}`}>Schedule</button>
                    <button onClick={() => setActiveTab('performance')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'performance' ? 'bg-brand-secondary text-white' : 'text-gray-300 hover:bg-brand-primary/80'}`}>Performance</button>
                </div>
            </div>

            {activeTab === 'schedule' && (
                <div>
                    <TimeClock 
                        currentUser={currentUser}
                        timeClockEntries={timeClockEntries}
                        onClockIn={onClockIn}
                        onClockOut={onClockOut}
                        allStaff={STAFF_DATA}
                    />
                    {isManager && <ManagerApprovalSection requests={swapRequests} shifts={shifts} onAction={onShiftAction} />}
                    <Card className="mt-6">
                        <div className="overflow-x-auto">
                            <div className="grid gap-px bg-brand-primary" style={{ gridTemplateColumns: '120px 70px 80px repeat(7, minmax(100px, 1fr))' }}>
                                {/* Header */}
                                <div className="p-2 font-bold bg-brand-dark sticky left-0 z-10 text-sm">Staff</div>
                                <div className="p-2 font-bold bg-brand-dark text-sm">Role</div>
                                <div className="p-2 font-bold bg-brand-dark text-center text-sm">Total Hours</div>
                                {days.map(day => <div key={day} className="p-2 font-bold text-center bg-brand-dark text-sm">{day}</div>)}
                                
                                {/* Staff Rows */}
                                {STAFF_DATA.map(staff => {
                                    const staffShifts = shifts.filter(s => s.staffId === staff.id);
                                    const totalHours = staffShifts.reduce((acc, shift) => acc + calculateShiftHours(shift.startTime, shift.endTime), 0);

                                    return (
                                        <React.Fragment key={staff.id}>
                                            <div className="p-2 font-semibold bg-brand-dark/80 sticky left-0 z-10 flex items-center text-sm">{staff.name}</div>
                                            <div className="p-2 bg-brand-dark/80 flex items-center text-xs text-gray-300">{staff.role}</div>
                                            <div className="p-2 font-bold text-center bg-brand-dark/80 flex items-center justify-center text-lg">{totalHours.toFixed(1)}</div>
                                            
                                            {days.map(day => {
                                                const shiftForDay = staffShifts.find(s => s.day === day);
                                                const availability = staffAvailability.find(a => a.staffId === staff.id && a.day === day);
                                                const request = shiftForDay ? swapRequests.find(r => r.shiftId === shiftForDay.id) : undefined;
                                                const isDropZone = isManager && !!draggedShift && draggedShift.staffId === staff.id;
                                                
                                                return (
                                                    <ScheduleGridCell
                                                        key={`${staff.id}-${day}`}
                                                        staff={staff}
                                                        day={day}
                                                        shift={shiftForDay}
                                                        availability={availability}
                                                        request={request}
                                                        currentUser={currentUser}
                                                        isDropZone={isDropZone}
                                                        onDragOver={(e) => handleDragOver(e, staff.id)}
                                                        onDrop={(e) => handleDrop(e, day, staff.id)}
                                                        onDragStart={(e) => shiftForDay && handleDragStart(e, shiftForDay)}
                                                        onDragEnd={handleDragEnd}
                                                        onShiftClick={() => shiftForDay && handleShiftClick(shiftForDay)}
                                                        onDeleteShift={(e) => {
                                                            e.stopPropagation();
                                                            if (shiftForDay) onDeleteShift(shiftForDay.id);
                                                        }}
                                                        onAddShiftClick={() => setAddShiftModalData({ staff, day })}
                                                        onSetAvailability={() => onSetAvailability(staff.id, day)}
                                                    />
                                                )
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'performance' && (
                 <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Performance Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {performanceStaff.map(staff => (
                            <StaffPerformanceCard key={staff.id} staff={staff} performance={STAFF_PERFORMANCE_DATA.find(p => p.staffId === staff.id)} />
                        ))}
                    </div>
                </div>
            )}

            {modalShift && (
                <ShiftActionModal
                    shift={modalShift}
                    request={swapRequests.find(r => r.shiftId === modalShift.id)}
                    currentUser={currentUser}
                    onClose={() => setModalShift(null)}
                    onAction={onShiftAction}
                />
            )}
            
            {addShiftModalData && (
                <AddShiftModal 
                    isOpen={!!addShiftModalData}
                    onClose={() => setAddShiftModalData(null)}
                    staff={addShiftModalData.staff}
                    day={addShiftModalData.day}
                    onAddShift={(startTime, endTime) => {
                        onAddShift(addShiftModalData.staff.id, addShiftModalData.day, startTime, endTime);
                    }}
                />
            )}
        </div>
    );
};

export default StaffSchedule;