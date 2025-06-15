import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Platform, BackHandler } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [cpf, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [idade, setIdade] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    (async () => {
      const session = await supabase.auth.getSession();
      const user = session.data.session?.user;

      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();

        if (data) {
          setName(data.name);
          setTelefone(data.phone);
          setEmail(data.email);
          setSenha(data.password); 
          setIdade(data.age.toString());
        }

        if (error) {
          Alert.alert('Erro ao carregar dados', error.message);
        }
      } else {
        Alert.alert('Erro', 'Usuário não autenticado.');
        router.push('/'); 
      }
    })();

    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão para acessar a galeria é necessária!');
      }
    };

    requestPermissions();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleExitApp = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      Alert.alert(
        'Fechar aplicativo',
        'Para sair do aplicativo, pressione o botão Home do seu dispositivo.',
        [{ text: 'OK' }]
      );
    }
  };


const updateUserData = async () => {
  const session = await supabase.auth.getSession();
  const user = session.data.session?.user;

  if (!user) {
    Alert.alert('Erro', 'Usuário não autenticado.');
    return;
  }

  try {
   
    const updates: { email?: string; password?: string } = {};
    if (email !== user.email) updates.email = email;
    if (senha) updates.password = senha;

    if (Object.keys(updates).length > 0) {
      const { error: authError } = await supabase.auth.updateUser(updates);
      if (authError) {
        Alert.alert('Erro ao atualizar autenticação', authError.message);
        return;
      }
    }

   
    const { error: dbError } = await supabase
      .from('users')
      .update({
        name,
        phone: cpf,
        email,
        age: parseInt(idade),
      })
      .eq('id', user.id);

    if (dbError) {
      Alert.alert('Erro ao atualizar banco de dados', dbError.message);
    } else {
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    }
  } catch (err) {
    Alert.alert('Erro inesperado', String(err));
  }
};





  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/panel/profile/page")}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton} onPress={handleExitApp}>
          <Text style={styles.profileButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Meus dados</Text>

      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>Adicionar Foto</Text>
          </View>
        )}
      </TouchableOpacity>

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
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.saveButton} onPress={updateUserData}>

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
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatarText: {
    color: '#666',
    fontSize: 14,
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
