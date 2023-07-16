import styled, { css } from "styled-components/macro";

import { isTouchscreenDevice } from "../../lib/isTouchscreenDevice";
import { remTorem, pxTorem, numTonum } from '../../lib/calculation';


export default styled.div<{
    mobilePadding?: boolean;
    paddingTop?: string;
    isMicro?: boolean;
    borderLeft?: any;
}>`
    height: 100%;
    display: flex;
    user-select: none;
    flex-direction: row;
    align-items: stretch;
    /*background: var(--background);*/

    background-color: rgba(
        var(--background-rgb),
        max(var(--min-opacity), 0.75)
    );
    backdrop-filter: blur(20px);
    ${(props) =>
        props.paddingTop &&
        css`
            padding-top: ${props.paddingTop};
        `
    }

    ${(props) =>
        props.isMicro &&
        css`
            background: transparent !important;
            border-right: 1px solid #766A58  !important;
        `
    }

    ${(props) =>
        props.borderLeft &&
        css`
            border-left: ${props.borderLeft};
            background: transparent !important;
        `
    }
`;

export const GenericSidebarBase = styled.div<{
    mobilePadding?: boolean;
    paddingTop?: string;
    isMicro?: boolean;
    borderLeft?: string;
}>`
    height: 100%;
    width: ${pxTorem(322)};
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    /*border-end-start-radius: 8px;*/
    background: var(--secondary-background);

    /*> :nth-child(1) {
        //border-end-start-radius: 8px;
    }

    > :nth-child(2) {
        margin-top: 48px;
        background: red;
    }*/

    ${(props) =>
        props.isMicro &&
        css`
            background: transparent !important;
            border-right: 1px solid #766A58  !important;
        `
    }

    ${(props) =>
        props.borderLeft &&
        css`
            border-left: ${props.borderLeft};
            background: transparent !important;
        `
    }

    ${(props) =>
        props.paddingTop &&
        css`
            padding-top: ${props.paddingTop};
        `
    }


    ${(props) =>
        props.mobilePadding &&
        isTouchscreenDevice &&
        css`
            padding-bottom: 50px;
        `}
`;

export const GenericSidebarList = styled.div`
    padding: 6px;
    flex-grow: 1;
    overflow-y: scroll;

    > img {
        width: 100%;
    }
`;
