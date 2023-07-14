import styled, { css } from "styled-components/macro";

import { isTouchscreenDevice } from "../../lib/isTouchscreenDevice";
import { Centred, IconButton } from "../../components/revoltchat";
import { remTorem, pxTorem, numTonum } from '../../lib/calculation';

export default styled.div`
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
    backdrop-filter: blur(${pxTorem(20)});
`;

export const GenericSidebarBase = styled.div<{
    mobilePadding?: boolean;
}>`
    height: 100%;
    width: ${pxTorem(322)};
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    /*border-end-start-radius: 8px;*/
    background: var(--secondary-background);
    padding-top: ${pxTorem(45)};

    /*> :nth-child(1) {
        //border-end-start-radius: 8px;
    }

    > :nth-child(2) {
        margin-top: ${pxTorem(48)};
        background: red;
    }*/

    ${(props) =>
        props.mobilePadding &&
        isTouchscreenDevice &&
        css`
            padding-bottom: ${pxTorem(50)};
        `}
`;

export const GenericSidebarList = styled.div`
    // padding: ${pxTorem(6)};
    flex-grow: 1;
    overflow-y: scroll;

    > img {
        width: 100%;
    }
`;
