import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Table, StaffMember, OrderItem, FloorPlanArea, AppSettings } from '../../types';
import Card from '../ui/Card';
import { BellIcon, PencilIcon, CheckIcon, XIcon, UserIcon } from '../icons/Icons';
import Button from '../ui/Button';
import ServerAssignmentModal from './ServerAssignmentModal';
import TableQRCodeModal from './TableQRCodeModal';

interface FloorPlanProps {
    tables: Table[];
    onTableSelect: (table: Table) => void;
    readyTables: Set<string>;
    currentUser: StaffMember;
    onUpdateTable: (tableId: number, updatedData: Partial<Omit<Table, 'id'>>) => void;
    staffMembers: StaffMember[];
    onAssignServer: (tableId: number, serverName: string) => void;
    tableOrders: Record<number, OrderItem[]>;
    floorPlanAreas: FloorPlanArea[];
    settings: AppSettings;
}

const TableBox: React.FC<{ 
    table: Table, 
    onSelect: () => void, 
    isReady: boolean,
    onUpdateTable: FloorPlanProps['onUpdateTable'],
    isEditingLayout: boolean,
}> = ({ table, onSelect, isReady, onUpdateTable, isEditingLayout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempSeats, setTempSeats] = useState(table.seats);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);
    
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTempSeats(table.seats);
        setIsEditing(true);
    };

    const handleConfirm = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (tempSeats > 0) {
            onUpdateTable(table.id, { seats: tempSeats });
        }
        setIsEditing(false);
    };
    
    const handleCancel = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(false);
    };

    const handleSelectWrapper = () => {
        if (!isEditing && !isEditingLayout) {
            onSelect();
        }
    };
    
    const statusClasses = {
        available: 'bg-green-500/30 border-green-500 hover:bg-green-500/50',
        occupied: 'bg-red-500/30 border-red-500 hover:bg-red-500/50',
        reserved: 'bg-yellow-500/30 border-yellow-500 hover:bg-yellow-500/50',
    };

    const readyClasses = isReady ? 'ring-4 ring-offset-4 ring-offset-brand-dark ring-teal-400 animate-pulse' : '';
    
    const getTableStyles = (seats: number) => {
        let sizeClasses = '';
        let shapeClasses = 'rounded-lg';
        let nameTextSize = 'text-lg md:text-2xl';
        let seatsTextSize = 'text-xs md:text-sm';

        if (seats <= 2) {
            sizeClasses = 'w-20 h-20 md:w-28 md:h-28';
            shapeClasses = 'rounded-full';
            nameTextSize = 'text-base md:text-xl';
        } else if (seats <= 4) {
            sizeClasses = 'w-24 h-24 md:w-32 md:h-32';
        } else if (seats <= 6) {
            sizeClasses = 'w-32 h-24 md:w-48 md:h-32';
        } else {
            sizeClasses = 'w-40 h-24 md:w-56 md:h-32';
        }

        return { sizeClasses, shapeClasses, nameTextSize, seatsTextSize };
    };

    const { sizeClasses, shapeClasses, nameTextSize, seatsTextSize } = getTableStyles(table.seats);

    return (
        <div 
            className={`relative p-4 border-2 text-center transition-all duration-200 flex flex-col justify-center items-center shadow-lg select-none ${sizeClasses} ${shapeClasses} ${statusClasses[table.status]} ${readyClasses} ${table.server ? 'pb-10' : ''}`}
            onClick={handleSelectWrapper}
        >
            {isReady && (
                <div className="absolute -top-2 -right-2 bg-teal-500 rounded-full p-1.5 shadow-lg">
                    <BellIcon className="w-5 h-5 text-white" />
                </div>
            )}
             {!isEditing && (
                <button 
                    onClick={handleEditClick} 
                    className="absolute top-1 right-1 bg-brand-primary/50 p-1 rounded-full text-gray-400 hover:text-white hover:bg-brand-primary transition-colors"
                    aria-label={`Edit seats for table ${table.name}`}
                >
                    <PencilIcon className="w-4 h-4" />
                </button>
            )}

            <p className={`font-bold ${nameTextSize}`}>{table.name}</p>

            {isEditing ? (
                 <div className="mt-1 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1">
                        <input 
                            ref={inputRef}
                            type="number"
                            value={tempSeats}
                            onChange={(e) => setTempSeats(Number(e.target.value))}
                            onClick={(e) => e.stopPropagation()}
                            className="w-16 text-center bg-brand-light text-black rounded border border-brand-primary focus:ring-brand-secondary focus:border-brand-secondary"
                            min="1"
                        />
                         <span className="text-sm">seats</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleConfirm} className="p-1 text-green-400 hover:bg-green-500/20 rounded-full" aria-label="Confirm seat change"><CheckIcon className="w-5 h-5" /></button>
                        <button onClick={handleCancel} className="p-1 text-red-400 hover:bg-red-500/20 rounded-full" aria-label="Cancel seat change"><XIcon className="w-5 h-5" /></button>
                    </div>
                </div>
            ) : (
                <>
                    <p className={seatsTextSize}>{table.seats} seats</p>
                    <p className="text-xs capitalize mt-1 font-semibold">{table.status}</p>
                </>
            )}

            {table.server && (
                <div className="absolute bottom-1.5 left-1.5 right-1.5 text-xs bg-black/40 px-2 py-1 rounded-full flex items-center justify-center gap-1.5 truncate">
                    <UserIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{table.server}</span>
                </div>
            )}
        </div>
    );
};


const FloorPlan: React.FC<FloorPlanProps> = ({ tables, onTableSelect, readyTables, currentUser, onUpdateTable, staffMembers, onAssignServer, tableOrders, floorPlanAreas, settings }) => {
    const [isEditingLayout, setIsEditingLayout] = useState(false);
    const [activePlanId, setActivePlanId] = useState<string>(floorPlanAreas[0]?.id || '');
    const [localTables, setLocalTables] = useState<Table[]>([]);
    const [draggingState, setDraggingState] = useState<{
        id: number;
        startX: number;
        startY: number;
        tableStartX: number;
        tableStartY: number;
    } | null>(null);
    const floorPlanRef = useRef<HTMLDivElement>(null);
    const [assignmentModalTable, setAssignmentModalTable] = useState<Table | null>(null);
    const [qrCodeModalTable, setQrCodeModalTable] = useState<Table | null>(null);

    useEffect(() => {
        if (floorPlanAreas.length > 0 && !floorPlanAreas.find(p => p.id === activePlanId)) {
            setActivePlanId(floorPlanAreas[0].id);
        }
    }, [floorPlanAreas, activePlanId]);

    const visibleTables = useMemo(() => tables.filter(t => t.floorPlanId === activePlanId), [tables, activePlanId]);

    useEffect(() => {
        if (!draggingState) {
            setLocalTables(visibleTables);
        }
    }, [visibleTables, draggingState]);

    const handleMouseDown = (e: React.MouseEvent, table: Table) => {
        if (!isEditingLayout) return;
        e.preventDefault();
        e.stopPropagation();
        setDraggingState({
            id: table.id,
            startX: e.clientX,
            startY: e.clientY,
            tableStartX: table.x || 0,
            tableStartY: table.y || 0,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingState || !floorPlanRef.current) return;
        e.preventDefault();
        
        const dx = e.clientX - draggingState.startX;
        const dy = e.clientY - draggingState.startY;

        const newX = draggingState.tableStartX + dx;
        const newY = draggingState.tableStartY + dy;

        setLocalTables(prevTables =>
            prevTables.map(t =>
                t.id === draggingState.id ? { ...t, x: newX, y: newY } : t
            )
        );
    };

    const handleMouseUp = () => {
        if (draggingState) {
            const tableToUpdate = localTables.find(t => t.id === draggingState.id);
            if (tableToUpdate) {
                onUpdateTable(tableToUpdate.id, { x: tableToUpdate.x, y: tableToUpdate.y });
            }
            setDraggingState(null);
        }
    };

    const handleTableClick = (table: Table) => {
        const isBartenderAtBar = currentUser.role === 'Bartender' && table.floorPlanId === 'bar';

        if (currentUser.role === 'Manager' && !isEditingLayout) {
            setAssignmentModalTable(table);
        } else if (isBartenderAtBar && table.status === 'occupied' && !isEditingLayout) {
            setAssignmentModalTable(table);
        } else if (!isEditingLayout) {
            onTableSelect(table);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <Card
                className="mb-4"
                title="Floor Plan"
                titleExtra={
                    currentUser.role === 'Manager' && (
                        <Button onClick={() => setIsEditingLayout(prev => !prev)}>
                            {isEditingLayout ? 'Done Editing' : 'Edit Layout'}
                        </Button>
                    )
                }
            >
                <div className="flex border-b border-brand-primary">
                    {floorPlanAreas.map(area => (
                        <button
                            key={area.id}
                            onClick={() => setActivePlanId(area.id)}
                            className={`py-2 px-4 font-semibold ${activePlanId === area.id ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-gray-400'}`}
                        >
                            {area.name}
                        </button>
                    ))}
                </div>
            </Card>

            <div
                ref={floorPlanRef}
                className="flex-1 bg-brand-primary/10 rounded-lg relative overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {localTables.map(table => (
                    <div
                        key={table.id}
                        style={{ position: 'absolute', left: `${table.x || 0}px`, top: `${table.y || 0}px`, cursor: isEditingLayout ? 'grab' : 'pointer' }}
                        onMouseDown={(e) => handleMouseDown(e, table)}
                    >
                        <TableBox
                            table={table}
                            onSelect={() => handleTableClick(table)}
                            isReady={readyTables.has(table.name)}
                            onUpdateTable={onUpdateTable}
                            isEditingLayout={isEditingLayout}
                        />
                    </div>
                ))}
            </div>

            {assignmentModalTable && (
                <ServerAssignmentModal
                    isOpen={!!assignmentModalTable}
                    onClose={() => setAssignmentModalTable(null)}
                    onAssign={(tableId, serverName) => {
                        onAssignServer(tableId, serverName);
                        setAssignmentModalTable(null);
                    }}
                    table={assignmentModalTable}
                    servers={staffMembers}
                    order={tableOrders[assignmentModalTable.id] || []}
                    onGoToPos={() => {
                        onTableSelect(assignmentModalTable);
                        setAssignmentModalTable(null);
                    }}
                    onShowQrCode={() => {
                        setQrCodeModalTable(assignmentModalTable);
                        setAssignmentModalTable(null);
                    }}
                    currentUser={currentUser}
                />
            )}

            {qrCodeModalTable && (
                <TableQRCodeModal 
                    isOpen={!!qrCodeModalTable}
                    onClose={() => setQrCodeModalTable(null)}
                    table={qrCodeModalTable}
                    settings={settings}
                />
            )}
        </div>
    );
};

export default FloorPlan;