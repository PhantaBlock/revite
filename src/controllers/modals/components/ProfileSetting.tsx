import { observer } from "mobx-react-lite";
import { Modal } from "@revoltchat/ui";
import { ModalProps } from "../types";

const ProfileSetting = observer(({ ...props }: ModalProps<"profile_setting">) => {
    return (
        <Modal
            {...props}
        // transparent
        // maxWidth="560px"
        >
            1
        </Modal>
    );
});

export default ProfileSetting;