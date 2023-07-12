import { observer } from "mobx-react-lite";
import { useSession } from "../../controllers/client/ClientController";
import ContextMenus from "../../lib/ContextMenus";

export default observer(() => {
    const session = useSession();
    const user = session?.client?.user;

    if (!user) return null;

    return <ContextMenus />;
});