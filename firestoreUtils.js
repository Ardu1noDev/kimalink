import { db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";

/**
 * Função para salvar dados na coleção "usuarios".
 * @param {Object} dados - Dados a serem salvos no Firestore.
 * @returns {Promise<string>} - Retorna o ID do documento salvo.
 */
export async function salvarUsuario(dados) {
  try {
    const docRef = await addDoc(collection(db, "usuarios"), dados);
    console.log("Documento salvo com ID:", docRef.id); // Exibe o ID do documento no console
    return docRef.id; // Retorna o ID do documento
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
    throw error; // Lança o erro para ser tratado no formulário
  }
}