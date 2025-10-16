import React from 'react';
import { StaffMember, TimeClockEntry } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface TimeClockProps {
    currentUser: StaffMember;
    allStaff: StaffMember[];
    timeClockEntries: TimeClockEntry[];
    onClockIn: (staffId: number) => void;
    onClockOut: (staffId: number) => void;
}

const UserTimeClockCard: React.FC<Omit<TimeClockProps, 'allStaff'>> = ({ currentUser, timeClockEntries, onClockIn, onClockOut }) => {
    const lastEntry = timeClockEntries
        .filter(e => e.staffId === currentUser.id)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    const isClockedIn = lastEntry?.type === 'in';

    return (
        <Card title="Time Clock" className="mb-6">
            <div className="flex flex-col items-center text-center gap-4">
                <div>
                    <p className="text-lg font-semibold">
                        Your Status: 
                        <span className={`ml-2 font-bold ${isClockedIn ? 'text-green-400' : 'text-gray-400'}`}>
                            {isClockedIn ? 'Clocked In' : 'Clocked Out'}
                        </span>
                    </p>
                    {lastEntry && (
                        <p className="text-sm text-gray-500">
                            Last activity at {lastEntry.timestamp.toLocaleTimeString()}
                        </p>
                    )}
                </div>
                {isClockedIn ? (
                    <Button variant="danger" onClick={() => onClockOut(currentUser.id)} className="w-full max-w-xs py-3 text-lg">
                        Clock Out
                    </Button>
                ) : (
                    <Button variant="primary" onClick={() => onClockIn(currentUser.id)} className="w-full max-w-xs py-3 text-lg bg-green-600 hover:bg-green-700 focus:ring-green-500">
                        Clock In
                    </Button>
                )}
            </div>
        </Card>
    );
};

const TeamStatusCard: React.FC<Pick<TimeClockProps, 'allStaff' | 'timeClockEntries'>> = ({ allStaff, timeClockEntries }) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return (
        <Card title="Team Time Clock Status" className="mb-6">
            <div className="max-h-80 overflow-y-auto pr-2">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-brand-primary">
                            <th className="p-2 text-sm">Staff Member</th>
                            <th className="p-2 text-sm text-center">Status</th>
                            <th className="p-2 text-sm">Last Clock In</th>
                            <th className="p-2 text-sm">Last Clock Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allStaff.map(staff => {
                            const todaysEntries = timeClockEntries.filter(e => e.staffId === staff.id && e.timestamp >= startOfToday);
                            const lastEntry = todaysEntries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
                            const isClockedIn = lastEntry?.type === 'in';

                            const lastClockIn = todaysEntries
                                .filter(e => e.type === 'in')
                                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

                            const lastClockOut = todaysEntries
                                .filter(e => e.type === 'out')
                                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

                            return (
                                <tr key={staff.id} className="border-b border-brand-primary/50 text-sm">
                                    <td className="p-2 font-semibold">{staff.name}</td>
                                    <td className="p-2">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${isClockedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                                            <span className={isClockedIn ? 'text-green-400' : 'text-gray-400'}>
                                                {isClockedIn ? 'In' : 'Out'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-2 text-gray-300">{lastClockIn ? lastClockIn.timestamp.toLocaleTimeString() : 'N/A'}</td>
                                    <td className="p-2 text-gray-300">{lastClockOut ? lastClockOut.timestamp.toLocaleTimeString() : 'N/A'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};


const TimeClock: React.FC<TimeClockProps> = (props) => {
    const { currentUser } = props;
    const isManager = currentUser.role === 'Manager';

    return (
        <div>
            <UserTimeClockCard {...props} />
            {isManager && <TeamStatusCard allStaff={props.allStaff} timeClockEntries={props.timeClockEntries} />}
        </div>
    );
};

export default TimeClock;