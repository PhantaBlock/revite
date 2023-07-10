import React from "react";
import { numTonum, pxTorem, remTorem } from '../../../../../lib/calculation';

export function Swoosh() {
    /*const sidebarOpen = useApplicationState().layout.getSectionState(
        SIDEBAR_CHANNELS,
        true,
    );*/
    const sidebarOpen = true;

    const fill = sidebarOpen
        ? "var(--sidebar-active)"
        : "var(--primary-background)";

    return (
        <svg
            width={numTonum(56)}
            height={numTonum(106)}
            viewBox={`0 0 ${numTonum(56)} ${numTonum(106)}`}
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M54 53C54 67.9117 41.9117 80 27 80C12.0883 80 0 67.9117 0 53C0 38.0883 12.0883 26 27 26C41.9117 26 54 38.0883 54 53Z"
                fill={fill}
            />
            <path
                d="M27.0002 80C4.50023 80 56.0002 53 56.0002 53V106C56.0002 106 49.5002 80 27.0002 80Z"
                fill={fill}
            />
            <path
                d="M27.0003 26C4.50025 26 56 53 56 53L56.0003 0C56.0003 0 49.5003 26 27.0003 26Z"
                fill={fill}
            />
            <rect x={numTonum(51)} y={numTonum(50)} width={numTonum(5)} height={numTonum(7)} fill={fill} />
        </svg>
    );
}
