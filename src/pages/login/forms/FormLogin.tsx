import { clientController } from "../../../controllers/client/ClientController";
import { Form } from "./Form";

const params = new URLSearchParams(location.search);
const skyLogin = params.get('skyLogin');

export function FormLogin() {
    return <Form page="login" callback={skyLogin ? clientController.skyLogin : clientController.login} />;
}
