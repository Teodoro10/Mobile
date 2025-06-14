import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from "../../../lib/supabase";

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [cpf, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');
  const [idade, setIdade] = useState('');
  const router = useRouter();

  async function handleRegister() {
    if (!name || !idade || !cpf || !email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    // Criar usuário na autenticação (signUp)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (authError) {
      alert("Erro ao criar usuário: " + authError.message);
      return;
    }

    // Inserir dados adicionais na tabela users
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          age: parseInt(idade, 10),
          phone: cpf,
          email,
          password: senha, // idealmente não salvar a senha aqui, apenas no auth
        },
      ]);

    if (error) {
      alert("Erro ao cadastrar: " + error.message);
    } else {
      alert("Cadastro realizado com sucesso!");
      router.push("/"); // ou vá para a tela de login
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