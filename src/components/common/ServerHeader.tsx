import { Check } from "@styled-icons/boxicons-regular";
import { Cog } from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Server } from "revolt.js";
import styled, { css } from "styled-components/macro";

import { Text } from "preact-i18n";

import { IconButton } from "../../components/revoltchat";
import { remTorem, pxTorem, numTonum } from '../../lib/calculation';

import { modalController } from "../../controllers/modals/ModalController";
import Tooltip from "./Tooltip";

interface Props {
    server: Server;
    background?: boolean;
}

const ServerBanner = styled.div<Omit<Props, "server">>`
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    background-size: cover;
    background-repeat: norepeat;
    background-position: center center;

    ${(props) =>
        props.background
            ? css`
                  height: ${pxTorem(120)};

                  .container {
                      background: linear-gradient(
                          0deg,
                          var(--secondary-background),
                          transparent
                      );
                  }
              `
            : css`
                  background-color: var(--secondary-header);
              `}

    .container {
        height: var(--header-height);

        display: flex;
        align-items: center;
        padding: 0 ${pxTorem(14)};
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        gap: ${pxTorem(8)};

        .title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-grow: 1;

            cursor: pointer;
            color: var(--foreground);
        }
    }
`;

export default observer(({ server }: Props) => {
    const bannerURL = server.generateBannerURL({ width: numTonum(480) });

    return (
        <ServerBanner
            background={typeof bannerURL !== "undefined"}
            style={{
                backgroundImage: bannerURL ? `url('${bannerURL}')` : undefined,
            }}>
            <div className="container">
                {server.flags && server.flags & 1 ? (
                    <Tooltip
                        content={
                            <Text id="app.special.server-badges.official" />
                        }
                        placement={"bottom-start"}>
                        <svg width={numTonum(20)} height={numTonum(20)}>
                            <image
                                xlinkHref="/assets/badges/verified.svg"
                                height={numTonum(20)}
                                width={numTonum(20)}
                            />
                            <image
                                xlinkHref="/assets/badges/revolt_r.svg"
                                height={numTonum(15)}
                                width={numTonum(15)}
                                x="2"
                                y="3"
                                style={
                                    "justify-content: center; align-items: center; filter: brightness(0);"
                                }
                            />
                        </svg>
                    </Tooltip>
                ) : undefined}
                {server.flags && server.flags & 2 ? (
                    <Tooltip
                        content={
                            <Text id="app.special.server-badges.verified" />
                        }
                        placement={"bottom-start"}>
                        <svg width={numTonum(20)} height={numTonum(20)}>
                            <image
                                xlinkHref="/assets/badges/verified.svg"
                                height={numTonum(20)}
                                width={numTonum(20)}
                            />
                            <foreignObject x={numTonum(2)} y={numTonum(2)} width={numTonum(15)} height={numTonum(15)}>
                                <Check
                                    size={numTonum(15)}
                                    color="black"
                                    strokeWidth={numTonum(8)}
                                />
                            </foreignObject>
                        </svg>
                    </Tooltip>
                ) : undefined}
                <a
                    className="title"
                    onClick={() =>
                        modalController.push({ type: "server_info", server })
                    }>
                    {server.name}
                </a>
                {server.havePermission("ManageServer") && (
                    <Link to={`/server/${server._id}/settings`}>
                        <IconButton>
                            <Cog size={numTonum(20)} />
                        </IconButton>
                    </Link>
                )}
            </div>
        </ServerBanner>
    );
});
