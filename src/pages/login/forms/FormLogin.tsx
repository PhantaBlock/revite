import { clientController } from "../../../controllers/client/ClientController";
import { Form } from "./Form";

const params = new URLSearchParams(location.search);
const originLogin = params.get('originLogin');

export function FormLogin() {
    return <Form page="login" callback={originLogin ? clientController.login : clientController.skyLogin} />;
}
