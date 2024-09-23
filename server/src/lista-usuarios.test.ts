import {test,expect,describe,beforeAll} from 'vitest';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import ListaUsuarios from './lista-usuarios';

beforeAll(async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USUARIO,
        database: process.env.DB_BANCO,
    });

    await connection.query("DELETE FROM usuarios");

    await connection.query(
        "INSERT INTO usuarios (id, nome, idade, cpf, rg, endereco, estado_civil) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [1, 'João Silva', 34, '123.456.789-00', '12.345.678-9', 'Rua das Flores, 123', 'Solteiro']
    );
    
    await connection.end();
});

test("Deve listar os usuários do banco de dados", async () => {

    const usuarioPreCadastrado = [{
        id: 1,
        nome: 'João Silva',
        idade: 34,
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        endereco: 'Rua das Flores, 123',
        estado_civil: 'Solteiro'
    }];

    const listaUsuarios = new ListaUsuarios();

    const usuarios = await listaUsuarios.execute();

    expect(usuarios).toEqual(usuarioPreCadastrado);
});
