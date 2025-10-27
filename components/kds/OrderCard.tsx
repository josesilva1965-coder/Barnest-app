import React, { useState, useEffect, useRef } from 'react';
import { Order, OrderStatus } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
  alertThreshold: number; // in milliseconds
}

const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

// Custom hook to get the previous value of a prop or state
const usePrevious = <T,>(value: T): T | undefined => {
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};


const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus, alertThreshold }) => {
    const [elapsedTime, setElapsedTime] = useState(Date.now() - order.createdAt);
    const [alertTriggered, setAlertTriggered] = useState(false);
    const alertSoundRef = useRef<HTMLAudioElement | null>(null);
    const readySoundRef = useRef<HTMLAudioElement | null>(null);
    const prevStatus = usePrevious(order.status);
    
    // Memoize the audio objects to avoid creating them on every render
    if (!alertSoundRef.current) {
        // A simple, short beep sound for late alerts
        alertSoundRef.current = new Audio('data:audio/wav;base64,UklGRkIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAAAA//8/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8D/wP/A/8A==');
    }
    if (!readySoundRef.current) {
        // A more pleasant chime for when an order is ready
        readySoundRef.current = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVWIv09Pv/8/v+H/3/3/5/7f9v/P/D/y/8//5/5/+f/T/0//f/H/5/9v/3/x/5P/b/9/8//j/9//0//P/H/0/9v/z/x//v/3/7/5v/b/9/8v/P/7//f/L/z/+f/3/7/5//P/7/9f/3/z/+f/3/+f/z/+//X/9/8v/P/5//f/r/2/+f/z/+//X/9/8v/P/5//f/r/2/+f/z/+//X/9/8v/P/5//f/r/2/+f/z/+//X/9/8v/P/5//f/r/2/+f/z/+//X/9/8v/P/5//f/r/2/+f/z/+//X/9/8v/P/5//f/r/2/+f/z/+//X/9/8v/P/5//f/r/2/+f/z/+//X/9/8v/P/5/9//g==');
    }

    useEffect(() => {
        if (order.status === OrderStatus.READY || order.status === OrderStatus.SERVED) return;
        const timer = setInterval(() => {
            setElapsedTime(Date.now() - order.createdAt);
        }, 1000);
        return () => clearInterval(timer);
    }, [order.createdAt, order.status]);

    useEffect(() => {
        const isOverThreshold = elapsedTime > alertThreshold && order.status !== OrderStatus.READY && order.status !== OrderStatus.SERVED;
        if (isOverThreshold && !alertTriggered && alertSoundRef.current) {
            alertSoundRef.current.play().catch(e => {
                console.warn(`Audio alert for order #${order.id} could not be played.`, e);
            });
            setAlertTriggered(true);
        }
    }, [elapsedTime, alertThreshold, alertTriggered, order.id, order.status]);

    // Effect to play sound when order becomes ready
    useEffect(() => {
        if (prevStatus !== OrderStatus.READY && order.status === OrderStatus.READY && readySoundRef.current) {
            readySoundRef.current.play().catch(e => {
                console.warn(`"Order ready" sound for order #${order.id} could not be played.`, e);
            });
        }
    }, [order.status, prevStatus, order.id]);

    const handleNextStep = () => {
        if (order.status === OrderStatus.QUEUED) {
            onUpdateStatus(order.id, OrderStatus.COOKING);
        } else if (order.status === OrderStatus.COOKING) {
            onUpdateStatus(order.id, OrderStatus.READY);
        }
    };
    
    const shouldShowAlerts = order.status !== OrderStatus.READY && order.status !== OrderStatus.SERVED;
    const isUrgent = shouldShowAlerts && elapsedTime > alertThreshold;
    const isWarning = shouldShowAlerts && elapsedTime > alertThreshold / 2;

    const borderColor = 
        order.status === OrderStatus.READY ? 'border-green-500' :
        isUrgent ? 'border-red-500' :
        isWarning ? 'border-yellow-500' :
        'border-blue-500';
    
    const cardBgColor = 
        isUrgent ? 'bg-red-500/20' :
        isWarning ? 'bg-yellow-500/20' :
        'bg-brand-primary/40';

    const cardClassName = `border-l-4 ${borderColor} ${cardBgColor} transition-colors duration-500 ${isUrgent ? 'animate-pulse' : ''}`;

    return (
        <Card className={cardClassName}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-lg">{order.table}</h3>
                    {order.server && <p className="text-xs text-brand-accent font-semibold">{order.server}</p>}
                    <p className="text-xs text-gray-400 mt-1">{order.station} #{order.id}</p>
                </div>
                <div className="text-right">
                    <p className="font-mono text-2xl font-bold">{formatDuration(elapsedTime)}</p>
                    <p className={`text-sm font-semibold capitalize ${order.status === OrderStatus.READY ? 'text-green-400' : 'text-brand-secondary'}`}>{order.status}</p>
                </div>
            </div>
            
            <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
                {order.items.map(item => (
                    <li key={item.instanceId}>
                        <p className="font-semibold">{item.quantity}x {item.name}</p>
                        {item.modifiers.length > 0 && (
                            <div className="text-xs text-gray-300 pl-4">
                                {item.modifiers.map(mod => <p key={mod.name}>+ {mod.name}</p>)}
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {order.status === OrderStatus.QUEUED && (
                <Button variant="primary" onClick={handleNextStep} className="w-full">Start Preparing</Button>
            )}
            {order.status === OrderStatus.COOKING && (
                <Button variant="primary" onClick={handleNextStep} className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500">Mark as Ready</Button>
            )}
             {order.status === OrderStatus.READY && (
                 <Button variant="secondary" onClick={() => onUpdateStatus(order.id, OrderStatus.SERVED)} className="w-full">Clear from Board</Button>
            )}

        </Card>
    );
};

export default OrderCard;