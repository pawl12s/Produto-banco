import mysql, { RowDataPacket } from 'mysql2/promise';
import 'dotenv/config';

type Output = {
    id: number,
    nome: string,
    idade: number,
    cpf: string,
    rg: string,
    endereco: string,
    estado_civil: string
};

interface UsuarioRowDataPacket extends RowDataPacket {
    id: number,
    nome: string,
    idade: number,
    cpf: string,
    rg: string,
    endereco: string,
    estado_civil: string
}

class ListaUsuarios {
    async execute(): Promise<Output[]> {
        try {
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USUARIO,
                database: process.env.DB_BANCO,
            });

            const [rows] = await connection.query("SELECT * FROM usuarios");

            const dados = rows as UsuarioRowDataPacket[];

            const usuariosDoBanco: Output[] = dados.map(linha => ({
                id: linha.id,
                nome: linha.nome,
                idade: linha.idade,
                cpf: linha.cpf,
                rg: linha.rg,
                endereco: linha.endereco,
                estado_civil: linha.estado_civil
            }));

            await connection.end(); 

            return usuariosDoBanco;
        } catch (e: any) {
            if (e.code === 'ER_NO_SUCH_TABLE') {
                console.log("A tabela usuarios não foi criada. Crie a tabela no Workbench!");
            } else if (e.code === "ER_PARSE_ERROR") {
                console.log("Sua query está com algo errado:");
                console.log("Verifique: vírgulas, pontos e nome de colunas.");
            } else if (e.code === 'ECONNREFUSED') {
                console.log("Verifique a conexão com o banco de dados!");
            } else if (e.code === 'ER_BAD_DB_ERROR') {
                console.log("O banco de dados não foi encontrado. Crie o banco de dados.");
            } else {
                console.log("Erro ao conectar no banco de dados:", e);
            }
            return []; 
        }
    }
}

export default ListaUsuarios;
