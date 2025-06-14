import { router,  } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";
import 'react-native-url-polyfill/auto';


const LoginScreen = () => {
    const [email, setEmail] = useState(""); // Alterado de username para email
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            {/* Campo de e-mail */}
            <TextInput
                style={[styles.input, focusedInput === "email" && styles.inputFocused]}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
            />

            {/* Campo de senha */}
            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.input, focusedInput === "password" && styles.inputFocused]}
                    placeholder="Senha"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    <Text style={styles.showPasswordText}>{showPassword ? "👁️" : "🩺"}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
                <TouchableOpacity
                  onPress={() => {
                        router.push("/forgot/senha/pass");
                    }}
                >
                    <Text style={styles.optionText}>Esqueceu a senha?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        router.push("/auth/signup/page");
                    }}
                >
                    <Text style={styles.optionText}>Cadastrar</Text>
                </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
                  onPress={() => {
                        router.push("/rede/senha");
                    }}
                >
                    <Text style={styles.optionText}>Redefina a senha</Text>
                </TouchableOpacity> */}

            <Button
                title="Entrar"
                onPress={async () => {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });

                    if (error) {
                        alert("Erro: " + error.message);
                    } else {
                        router.push("/panel/profile/page");
                    }
                }}
            />
        </View>
    );
};

export default LoginScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },

    input: {
        width: "100%",
        height: 45,
        borderColor: "#ccc",
        borderWidth: 2,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 10,
        backgroundColor: "#F9F9F9",
    },
    inputFocused: {
        borderColor: "#28a745", // Borda verde ao focar
    },
    passwordContainer: {
        width: "100%",
        position: "relative", // Mantém alinhamento correto
    },
    eyeButton: {
        position: "absolute",
        right: 10, // Mantém o botão dentro do campo
        top: 12, // Ajusta a posição vertical do ícone
    },
    showPasswordText: {
        fontSize: 18,
    },
    optionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 5,
    },
    optionText: {
        color: "#007bff", // Azul para as opções
        fontWeight: "bold",
    },
    button: {
        marginTop: 20,
        backgroundColor: "#28a745", // Verde
        paddingVertical: 12,
        width: "100%",
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
