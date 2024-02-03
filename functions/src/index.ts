import { setDefaultOptions } from "date-fns";
import { ptBR as localePtBR } from "date-fns/locale/pt-BR";

import admin from "firebase-admin";

admin.initializeApp();

setDefaultOptions({ locale: localePtBR });

export * from "./endpoints";
