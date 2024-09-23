import mysql from 'mysql2/promise';
import 'dotenv/config';

export default class InserirUsuarios {
    async execute(input: Input): Promise<Output> {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USUARIO,
            database: process.env.DB_BANCO,
        });

        // Executa a query de inserção com os novos campos
        await connection.query(
            "INSERT INTO usuarios (id, nome, idade, cpf, rg, endereco, estado_civil) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [input.id, input.nome, input.idade, input.cpf, input.rg, input.endereco, input.estado_civil]
        );

        await connection.end(); 

        return input;
    }
}

// Tipos ajustados para refletir os novos campos
type Input = {
    id: number,
    nome: string,
    idade: number,
    cpf: string,
    rg: string,
    endereco: string,
    estado_civil: string
};

type Output = {
    id: number,
    nome: string,
    idade: number,
    cpf: string,
    rg: string,
    endereco: string,
    estado_civil: string
};
