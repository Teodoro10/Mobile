import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from "../../../lib/supabase";
import 'react-native-url-polyfill/auto';
export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [cpf, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');
  const [idade, setIdade] = useState('');
  const router = useRouter();

  

async function handleRegister() {
  // 1. Valida campos obrigatórios primeiro
  if (!name || !idade || !cpf || !email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  // 2. Verifica se o e-mail já existe (com tratamento de erro)
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle(); // Usa maybeSingle para evitar erros quando não há registros

  if (fetchError && fetchError.code !== "PGRST116") { // Ignora erro "Nenhum resultado"
    alert("Erro ao verificar e-mail: " + fetchError.message);
    return;
  }

  if (existingUser) {
    alert("Este e-mail já está cadastrado.");
    return;
  }

  // 3. Cria usuário na autenticação
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: senha,
  });

  if (authError) {
    alert("Erro ao criar usuário: " + authError.message);
    return;
  }

  // 4. Verifica se o ID do usuário está disponível
  const userId = authData.user?.id;
  if (!userId) {
    alert("Confirme seu e-mail antes de prosseguir.");
    return;
  }

  // 5. Insere na tabela users (com tratamento de conflito)
  const { error: insertError } = await supabase
    .from("users")
    .upsert( // Usa UPSERT para evitar duplicatas
      {
        id: userId,
        name,
        age: parseInt(idade, 10),
        phone: cpf,
        email,
      },
      { onConflict: "id" } // Atualiza se o ID já existir
    );

  if (insertError) {
    alert("Erro ao salvar dados: " + insertError.message);
  } else {
    alert("Cadastro realizado com sucesso!");
    router.push("/");
  }
}

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            router.push("/");
          }}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Cadastre-se</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={cpf}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleRegister}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileButton: {
    padding: 10,
    borderRadius: 8,
  },
  profileButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  saveButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});