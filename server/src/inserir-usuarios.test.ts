import { expect, test, beforeAll, afterAll } from 'vitest';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import ListaUsuarios from './lista-usuarios';
import InserirUsuarios from './inserir-usuarios';

beforeAll(async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USUARIO,
        database: process.env.DB_BANCO,
    });
    // Limpa a tabela de usuários antes dos testes
    await connection.query("DELETE FROM usuarios");
    await connection.end();
});

afterAll(async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USUARIO,
        database: process.env.DB_BANCO,
    });

    await connection.query("DELETE FROM usuarios");
    await connection.end();
});

test("Deve inserir um usuário no banco de dados", async () => {
    const usuarioParaInserir = {
        id: 1,
        nome: "João Silva",
        idade: 34, 
        cpf: "123.456.789-00",
        rg: "12.345.678-9",
        endereco: "Rua das Flores, 123",
        estado_civil: "Solteiro"
    };


    const inserirUsuarios = new InserirUsuarios();
    const usuarioBanco = await inserirUsuarios.execute(usuarioParaInserir);

    expect(usuarioBanco).toStrictEqual(usuarioParaInserir);

    const listaUsuarios = new ListaUsuarios();
    const usuarios = await listaUsuarios.execute();


    const usuarioEsperado = {
        ...usuarioParaInserir
    };

    expect(usuarios).toContainEqual(usuarioEsperado);
});
