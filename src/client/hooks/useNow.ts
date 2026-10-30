import { useEffect, useState } from "react";

export function useNow(intervalMs = 1000): number {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(Date.now());
        }, intervalMs);

        return () => {
            clearInterval(intervalId);
        };
    }, [intervalMs]);

    return now;
}
