// import { openDatabase, SQLiteDatabase } from 'expo-sqlite';

// // Abrir banco de dados com tipagem explícita
// const db: SQLiteDatabase = openDatabase('app.db');

// // Inicializar banco de dados
// export const initDatabase = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username TEXT NOT NULL UNIQUE,
//         password TEXT NOT NULL
//       );`,
//       [],
//       () => console.log('Tabela criada com sucesso'),
//       (_, error) => {
//         console.log('Erro ao criar tabela:', error);
//         return true;
//       }
//     );
//   });
// };

// // Função de login
// export const loginUser = (
//   username: string, 
//   password: string,
//   callback: (success: boolean) => void
// ) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       'SELECT * FROM users WHERE username = ? AND password = ?;',
//       [username, password],
//       (_, resultSet) => {
//         callback(resultSet.rows.length > 0);
//       },
//       (_, error) => {
//         console.log('Erro no login:', error);
//         callback(false);
//         return true;
//       }
//     );
//   });
// };

// // Função de cadastro
// export const registerUser = (
//   username: string, 
//   password: string,
//   callback: (success: boolean, error?: string) => void
// ) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       'INSERT INTO users (username, password) VALUES (?, ?);',
//       [username, password],
//       (_, resultSet) => {
//         callback(resultSet.rowsAffected > 0);
//       },
//       (_, error) => {
//         if (error.message.includes('UNIQUE')) {
//           callback(false, 'Usuário já existe');
//         } else {
//           callback(false, 'Erro ao cadastrar');
//         }
//         return true;
//       }
//     );
//   });
// };