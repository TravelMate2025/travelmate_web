import { useState, useCallback } from 'react';
import { addDays } from 'date-fns';
import { DateRangeType } from '../types/booking';
import { formatApiDate } from '../utilities/formatting';
import { formatDate } from '../utilities/formatting';
import { RangeKeyDict } from 'react-date-range';

export const useDateSelection = (onDateChange?: (date: string, display: string) => void) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [dateRange, setDateRange] = useState<DateRangeType[]>([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 0),
            key: "selection",
        },
    ]);

    const open = Boolean(anchorEl);

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }, [anchorEl]);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleSelectDate = useCallback(() => {
        if (dateRange[0].startDate && onDateChange) {
            const startDateRaw = formatApiDate(dateRange[0].startDate);
            const startDateFormatted = formatDate(dateRange[0].startDate);
            const endDateFormatted = dateRange[0].endDate
                ? formatDate(dateRange[0].endDate)
                : startDateFormatted;

            const displayText = startDateFormatted === endDateFormatted
                ? startDateFormatted
                : `${startDateFormatted} - ${endDateFormatted}`;

            onDateChange(startDateRaw, displayText);
            handleClose();
        }
    }, [dateRange, onDateChange, handleClose]);

    const updateDateRange = useCallback((item: RangeKeyDict) => {
        setDateRange([
            {
                startDate: item.selection.startDate ?? new Date(),
                endDate: item.selection.endDate ?? new Date(),
                key: item.selection.key ?? "selection",
            },
        ]);
    }, []);

    return {
        anchorEl,
        dateRange,
        open,
        handleClick,
        handleClose,
        handleSelectDate,
        updateDateRange,
    };
};