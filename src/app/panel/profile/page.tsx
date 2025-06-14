import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, BackHandler, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native";
import { supabase } from "../../../lib/supabase";
const LoginScreen = () => {
    const [historico, setHistorico] = useState<
  { glicemia?: string; pressao?: string; data: string }[]
>([]);
    const [glicemiaJejum, setGlicemiaJejum] = useState("");
    const [glicemiaSemJejum, setGlicemiaSemJejum] = useState("");
    const [pressaoSistolica, setPressaoSistolica] = useState("");
    const [pressaoDiastolica, setPressaoDiastolica] = useState("");

    const [resultadoGlicemia, setResultadoGlicemia] = useState("");
    const [resultadoPressao, setResultadoPressao] = useState("");
    const [dataHoraGlicemia, setDataHoraGlicemia] = useState("");
    const [dataHoraPressao, setDataHoraPressao] = useState("");

    const [focusedFields, setFocusedFields] = useState({
        jejum: false,
        semJejum: false,
        sistolica: false,
        diastolica: false
    });

    const classificarGlicemiaJejum = (valor: number): string => {
        if (valor < 70) return "Hipoglicemia ⚠️";
        if (valor < 100) return "Normal ✅";
        if (valor < 126) return "Pré-diabetes ⚠️";
        return "Diabetes ⛔";
    };

    const classificarGlicemiaSemJejum = (valor: number): string => {
        if (valor < 70) return "Hipoglicemia ⚠️";
        if (valor < 140) return "Normal ✅";
        if (valor < 200) return "Tolerância diminuída ⚠️";
        return "Diabetes ⛔";
    };

    const classificarPressaoArterial = (sistolica: number, diastolica: number): string => {
        if (sistolica < 90 || diastolica < 60) return "Hipotensão ⚠️";
        if (sistolica < 120 && diastolica < 80) return "Normal ✅";
        if (sistolica < 130 && diastolica < 80) return "Elevada ⚠️";
        if (sistolica < 140 || diastolica < 90) return "Hipertensão Estágio 1 ⚠️";
        if (sistolica < 180 || diastolica < 120) return "Hipertensão Estágio 2 ⛔";
        return "Crise Hipertensiva ⛔ (Procure ajuda médica)";
    };

   const calcularResultados = () => {
  const agora = new Date().toLocaleString();
  let novaGlicemia = "";
  let novaPressao = "";
  
 if (!glicemiaJejum && !glicemiaSemJejum && !pressaoSistolica && !pressaoDiastolica) {
    Alert.alert("Aviso", "Por favor, insira ao menos um valor de glicemia ou pressão.");
    return;
  }
  try {
    if (glicemiaJejum) {
      const valor = parseFloat(glicemiaJejum);
      novaGlicemia = `Jejum: ${classificarGlicemiaJejum(valor)}`;
    } else if (glicemiaSemJejum) {
      const valor = parseFloat(glicemiaSemJejum);
      novaGlicemia = `Sem Jejum: ${classificarGlicemiaSemJejum(valor)}`;
    }

    setResultadoGlicemia(novaGlicemia);
    setDataHoraGlicemia(agora);
  } catch {
    Alert.alert("Erro", "Valor de glicemia inválido");
  }

  try {
    if (pressaoSistolica && pressaoDiastolica) {
      const sistolica = parseFloat(pressaoSistolica);
      const diastolica = parseFloat(pressaoDiastolica);
      novaPressao = classificarPressaoArterial(sistolica, diastolica);
      setResultadoPressao(novaPressao);
      setDataHoraPressao(agora);
    }
  } catch {
    Alert.alert("Erro", "Valores de pressão inválidos");
  }

  // Salva no histórico
  if (novaGlicemia || novaPressao) {
    setHistorico(prev => [
      ...prev,
      {
        glicemia: novaGlicemia,
        pressao: novaPressao,
        data: agora,
      },
    ]);
  }
if (novaGlicemia || novaPressao) {

  // Salvar no Supabase
  salvarNoSupabase(novaGlicemia, novaPressao);
}

  
};

const salvarNoSupabase = async (glicemia: string, pressao: string) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    Alert.alert("Erro", "Usuário não autenticado.");
    return;
  }

  const { error } = await supabase.from("health_records").insert([
    {
      user_id: user.id,
      glicemia,
      pressao,
    },
  ]);

  if (error) {
    Alert.alert("Erro ao salvar no Supabase", error.message);
  }
}


    const handleFocus = (field: string) => {
        setFocusedFields(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field: string) => {
        setFocusedFields(prev => ({ ...prev, [field]: false }));
    };

    const irParaPerfil = () => {
        router.push("/live/life/perfil");
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.profileButton} onPress={irParaPerfil}>
                    <Text style={styles.profileButtonText}>Perfil</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Monitoramento de Saúde</Text>
            <Text style={styles.subtitle}>Glicemia (mg/dL)</Text>

            <TextInput
                style={[styles.input, focusedFields.jejum && styles.inputFocused]}
                placeholder="Glicemia em Jejum"
                value={glicemiaJejum}
                onChangeText={setGlicemiaJejum}
                keyboardType="numeric"
                onFocus={() => handleFocus("jejum")}
                onBlur={() => handleBlur("jejum")}
            />

            <TextInput
                style={[styles.input, focusedFields.semJejum && styles.inputFocused]}
                placeholder="Glicemia Sem Jejum"
                value={glicemiaSemJejum}
                onChangeText={setGlicemiaSemJejum}
                keyboardType="numeric"
                onFocus={() => handleFocus("semJejum")}
                onBlur={() => handleBlur("semJejum")}
            />

            <Text style={styles.subtitle}>Pressão Arterial (mmHg)</Text>
            <View style={styles.pressureContainer}>
                <TextInput
                    style={[styles.pressureInput, focusedFields.sistolica && styles.inputFocused]}
                    placeholder="Sistólica"
                    value={pressaoSistolica}
                    onChangeText={setPressaoSistolica}
                    keyboardType="numeric"
                    onFocus={() => handleFocus("sistolica")}
                    onBlur={() => handleBlur("sistolica")}
                />
                <Text style={styles.pressureSeparator}>/</Text>
                <TextInput
                    style={[styles.pressureInput, focusedFields.diastolica && styles.inputFocused]}
                    placeholder="Diastólica"
                    value={pressaoDiastolica}
                    onChangeText={setPressaoDiastolica}
                    keyboardType="numeric"
                    onFocus={() => handleFocus("diastolica")}
                    onBlur={() => handleBlur("diastolica")}
                />
            </View>

            <TouchableOpacity style={styles.calculateButton} onPress={calcularResultados}>
                <Text style={styles.calculateButtonText}>Calcular</Text>
            </TouchableOpacity>

            {resultadoGlicemia ? (
                <>
                    <Text style={styles.resultText}>{resultadoGlicemia}</Text>
                    <Text style={styles.timestampText}>Registrado em: {dataHoraGlicemia}</Text>
                </>
            ) : null}

            {resultadoPressao ? (
                <>
                    <Text style={styles.resultText}>Pressão: {resultadoPressao}</Text>
                    <Text style={styles.timestampText}>Registrado em: {dataHoraPressao}</Text>
                </>
            ) : null}
        </View>

        
    );

    {historico.length > 0 && (
  <>
    <Text style={styles.sectionTitle}>Histórico</Text>
    <FlatList
      data={historico}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.data}</Text>
          <Text style={styles.cell}>{item.glicemia || "-"}</Text>
          <Text style={styles.cell}>{item.pressao || "-"}</Text>
        </View>
      )}
    />
  </>
)}
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
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
    input: {
        width: "100%",
        height: 45,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 10,
        backgroundColor: "#F9F9F9",
    },
    inputFocused: {
        borderColor: "#28a745",
        borderWidth: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 15,
        color: '#2c3e50',
        alignSelf: 'flex-start',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#34495e',
        alignSelf: 'flex-start',
    },
    pressureContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    pressureInput: {
        width: '45%',
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 10,
        backgroundColor: '#F9F9F9',
    },
    pressureSeparator: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7f8c8d',
    },
    calculateButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 15,
        width: '100%',
        alignItems: 'center',
    },
    calculateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#27ae60',
        alignSelf: 'flex-start',
    },
    timestampText: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 2,
        alignSelf: 'flex-start',
    },

    row: {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: 6,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},
cell: {
  flex: 1,
  fontSize: 12,
  color: "#2c3e50",
  paddingHorizontal: 4,
},

});

export default LoginScreen;
