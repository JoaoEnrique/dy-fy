export function errorMessage(err: any) {
    // eslint-disable-next-line eqeqeq
    if (err.status == 401){
        return "Sessão expirada. Faça login novamente";
    }

    // eslint-disable-next-line eqeqeq
    else if (err.status == 429 && err.message.blocked)
        return `Você foi bloqueado por ${err.remaining} minutos por muitas ações consecutivas`;

    // eslint-disable-next-line eqeqeq
    else if (err.status == 429){
        // eslint-disable-next-line eqeqeq
        if(err.response.data.message == "blocked"){
            return `Você foi bloqueado por ${err?.response?.data?.remaining} minutos por muitas ações repetidas`;
        }
        
        if (err?.response?.data?.message)
            return err.response.data.message;

        return `Espere um momento para realizar essa ação`;
    }

    else if (err?.response?.data?.message) {
        return err.response.data.message;

    } else if (err?.response?.data.error) {
        return err.response.data.error || "Erro no servidor!";

    } else if (err.response?.data.erro) { //gerencianet
        return err.response.data.erro;

    } else if (err.request) {
        // eslint-disable-next-line eqeqeq
        if(err.code == "ERR_NETWORK")
            return "Verifique sua conexão de internet"

        return "Servidor não respondeu. Tente novamente mais tarde";
    } else {
        return "Ocorreu um erro inesperado. Tente novamente mais tarde";
    }
}