/* eslint-disable react-hooks/rules-of-hooks */
import { XCircle, Plus, Share, X, File } from "@styled-icons/boxicons-regular";
import styled from "styled-components/macro";

import { Text } from "preact-i18n";
import { useEffect, useState } from "preact/hooks";

import { determineFileSize } from "../../../../lib/fileSize";

import { CAN_UPLOAD_AT_ONCE, UploadState } from "../MessageBox";
import { remTorem, pxTorem, numTonum } from '../../../../lib/calculation';

interface Props {
    state: UploadState;
    addFile: () => void;
    removeFile: (index: number) => void;
}

const Container = styled.div`
    gap: ${pxTorem(4)};
    padding: ${pxTorem(8)};
    display: flex;
    user-select: none;
    flex-direction: column;
    background: var(--message-box);
`;

const Carousel = styled.div`
    gap: ${pxTorem(8)};
    display: flex;
    overflow-x: scroll;
    flex-direction: row;
`;

const Entry = styled.div`
    display: flex;
    flex-direction: column;

    &.fade {
        opacity: 0.4;
    }

    span.fn {
        margin: auto;
        font-size: 0.8em;
        overflow: hidden;
        max-width: ${pxTorem(180)};
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: var(--secondary-foreground);
    }

    span.size {
        font-size: 0.6em;
        color: var(--tertiary-foreground);
        text-align: center;
    }
`;

const Description = styled.div`
    gap: ${pxTorem(4)};
    display: flex;
    font-size: 0.9em;
    align-items: center;
    color: var(--secondary-foreground);
`;

const Divider = styled.div`
    width: ${pxTorem(4)};
    height: ${pxTorem(130)};
    flex-shrink: 0;
    border-radius: var(--border-radius);
    background: var(--tertiary-background);
`;

const EmptyEntry = styled.div`
    width: ${pxTorem(100)};
    height: ${pxTorem(100)};
    display: grid;
    flex-shrink: 0;
    cursor: pointer;
    place-items: center;
    border-radius: var(--border-radius);
    background: var(--primary-background);
    transition: 0.1s ease background-color;

    &:hover {
        background: var(--secondary-background);
    }
`;

const PreviewBox = styled.div`
    display: grid;
    grid-template: "main" ${pxTorem(100)} / minmax(${pxTorem(100)}, 1fr);
    justify-items: center;

    cursor: pointer;
    overflow: hidden;
    border-radius: var(--border-radius);
    background: var(--primary-background);

    .icon,
    .overlay {
        grid-area: main;
    }

    .icon {
        height: ${pxTorem(100)};
        margin-bottom: ${pxTorem(4)};
        object-fit: contain;
    }

    .overlay {
        display: grid;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100%;

        opacity: 0;
        visibility: hidden;

        transition: 0.1s ease opacity;
    }

    &:hover {
        .overlay {
            visibility: visible;
            opacity: 1;
            background-color: rgba(0, 0, 0, 0.8);
        }
    }
`;

function FileEntry({
    file,
    remove,
    index,
}: {
    file: File;
    remove?: () => void;
    index: number;
}) {
    if (!file.type.startsWith("image/"))
        return (
            <Entry className={index >= CAN_UPLOAD_AT_ONCE ? "fade" : ""}>
                <PreviewBox onClick={remove}>
                    <EmptyEntry className="icon">
                        <File size={numTonum(36)} />
                    </EmptyEntry>
                    <div className="overlay">
                        <XCircle size={numTonum(36)} />
                    </div>
                </PreviewBox>
                <span className="fn">{file.name}</span>
                <span className="size">{determineFileSize(file.size)}</span>
            </Entry>
        );

    const [url, setURL] = useState("");

    useEffect(() => {
        const url: string = URL.createObjectURL(file);
        setURL(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    return (
        <Entry className={index >= CAN_UPLOAD_AT_ONCE ? "fade" : ""}>
            <PreviewBox onClick={remove}>
                <img
                    className="icon"
                    src={url}
                    alt={file.name}
                    loading="eager"
                />
                <div className="overlay">
                    <XCircle size={numTonum(36)} />
                </div>
            </PreviewBox>
            <span className="fn">{file.name}</span>
            <span className="size">{determineFileSize(file.size)}</span>
        </Entry>
    );
}

export default function FilePreview({ state, addFile, removeFile }: Props) {
    if (state.type === "none") return null;

    return (
        <Container>
            <Carousel>
                {state.files.map((file, index) => (
                    // @ts-expect-error brokey
                    // eslint-disable-next-line react/jsx-no-undef
                    <Fragment key={file.name}>
                        {index === CAN_UPLOAD_AT_ONCE && <Divider />}
                        <FileEntry
                            index={index}
                            file={file}
                            key={file.name}
                            remove={
                                state.type === "attached"
                                    ? () => removeFile(index)
                                    : undefined
                            }
                        />
                    </Fragment>
                ))}
                {state.type === "attached" && (
                    <EmptyEntry onClick={addFile}>
                        <Plus size={numTonum(48)} />
                    </EmptyEntry>
                )}
            </Carousel>
            {state.type === "uploading" && (
                <Description>
                    <Share size={numTonum(24)} />
                    <Text id="app.main.channel.uploading_file" /> (
                    {state.percent}%)
                </Description>
            )}
            {state.type === "sending" && (
                <Description>
                    <Share size={numTonum(24)} />
                    Sending...
                </Description>
            )}
            {state.type === "failed" && (
                <Description>
                    <X size={numTonum(24)} />
                    <Text id={`error.${state.error}`} />
                </Description>
            )}
        </Container>
    );
}
