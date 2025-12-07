import { toast } from 'react-toastify';

export const mostrarErroMensagem = (mensagem) => {
    toast.error(mensagem, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    })
};

export const mostrarSucessoMensagem = (mensagem) => {
    toast.success(mensagem, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    })
}