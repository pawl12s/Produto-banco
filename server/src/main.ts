import Express from 'express';
import Cors from 'cors';
import ListaProdutos from "./lista-produtos";
import InserirProdutos from "./inserir-produtos";
import ListaUsuarios from './lista-usuarios'; 
import InserirUsuarios from './inserir-usuarios'; 

const appProdutos = Express();
appProdutos.use(Cors());
appProdutos.use(Express.json());

appProdutos.get("/produtos", async (req, res) => {
    const listaProdutos = new ListaProdutos();
    res.send(await listaProdutos.execute());
});

appProdutos.post("/produtos", async (req, res) => {
    console.log("Alguém tentou cadastrar Produtos");
    const { id, nome, descricao, preco, imagem } = req.body;
    const produto = {
        id,
        nome,
        descricao,
        preco,
        imagem
    };
    const inserirProduto = new InserirProdutos();
    try {
        const produtoInserido = await inserirProduto.execute(produto);
        res.status(201).send(produtoInserido);
    } catch (e: any) {
        if (e.message === "ER_DUP_ENTRY") {
            res.status(409).send("Produto já cadastrado");
        } else {
            console.log(e);
            res.status(409).send("Erro Desconhecido: Olhe o TERMINAL DO VSCode");
        }
    }
});

const portaProdutos = 8000;
appProdutos.listen(portaProdutos, () => {
    console.log("Server de Produtos Rodando");
    console.log(`Digite: http://localhost:${portaProdutos}/produtos na URL para acessar o servidor.`);
});


// Código para usuários
const appUsuarios = Express();
appUsuarios.use(Cors());
appUsuarios.use(Express.json());

appUsuarios.get('/usuarios', async (req, res) => {
    const listaUsuarios = new ListaUsuarios();
    try {
        const usuarios = await listaUsuarios.execute();
        res.send(usuarios);
    } catch (e: any) {
        console.error(e);
        res.status(500).send('Erro ao buscar usuários');
    }
});

appUsuarios.post('/usuarios', async (req, res) => {
    console.log('Alguém tentou cadastrar um usuário');
    const { id, nome, idade, cpf, rg, endereco, estado_civil } = req.body;
    const usuario = {
        id,
        nome,
        idade,
        cpf,
        rg,
        endereco,
        estado_civil
    };

    const inserirUsuario = new InserirUsuarios();
    try {
        const usuarioInserido = await inserirUsuario.execute(usuario);
        res.status(201).send(usuarioInserido);
    } catch (e: any) {
        if (e.message.includes('ER_DUP_ENTRY')) {
            res.status(409).send('Usuário já cadastrado');
        } else {
            console.error(e);
            res.status(500).send('Erro desconhecido: Olhe o terminal para detalhes');
        }
    }
});

const portaUsuarios = 8001;
appUsuarios.listen(portaUsuarios, () => {
    console.log(`Servidor de Usuários rodando na porta ${portaUsuarios}`);
    console.log(`Digite: http://localhost:${portaUsuarios}/usuarios na URL para acessar o servidor.`);
});
