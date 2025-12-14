import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSacola } from "../context/SacolaContext";

type MetodoPagamento = "PIX" | "CARTAO" | "DINHEIRO";

export default function Checkout() {
  const { total, limpar, montarPayload } = useSacola();
  const router = useRouter();

  const [metodoPagamento, setMetodoPagamento] =
    useState<MetodoPagamento | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);

  async function finalizarPedido() {
    if (!metodoPagamento) {
      Alert.alert("Atenção", "Selecione uma forma de pagamento");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Você precisa estar logado");
        setLoading(false);
        return;
      }

      const payload = montarPayload();
      if (!payload) {
        Alert.alert("Erro", "Sua sacola está vazia ou restaurante não definido");
        setLoading(false);
        return;
      }

      await axios.post(
        "http://localhost:8081/pedidos",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setModalSucesso(true);

      setTimeout(() => {
        limpar();
        setModalSucesso(false);
        router.replace("/pedidos");
      }, 2500);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível finalizar o pedido"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pagamento</Text>

      <View style={styles.card}>
        <Text style={styles.subtitulo}>Escolha a forma de pagamento</Text>

        {(["PIX", "CARTAO", "DINHEIRO"] as MetodoPagamento[]).map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.opcao,
              metodoPagamento === m && styles.opcaoSelecionada,
            ]}
            onPress={() => setMetodoPagamento(m)}
          >
            <Text style={styles.opcaoTexto}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.botao}
          onPress={finalizarPedido}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>
              Comprar • R$ {total.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={modalSucesso} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalIcone}>✅</Text>
            <Text style={styles.modalTitulo}>Pedido confirmado!</Text>
            <Text style={styles.modalTexto}>
              O pagamento foi realizado com sucesso e o pedido foi enviado ao restaurante.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#f8f8f8" },
  titulo: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  subtitulo: { fontSize: 16, marginBottom: 12 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 12 },
  opcao: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#eee",
    marginBottom: 10,
  },
  opcaoSelecionada: {
    borderColor: "#EA1D2C",
    backgroundColor: "#fff5f5",
  },
  opcaoTexto: { fontSize: 16, fontWeight: "600" },
  footer: { marginTop: "auto" },
  botao: {
    backgroundColor: "#EA1D2C",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  botaoTexto: { color: "#fff", fontSize: 18, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: { backgroundColor: "#fff", padding: 32, borderRadius: 20, alignItems: "center" },
  modalIcone: { fontSize: 64 },
  modalTitulo: { fontSize: 22, fontWeight: "700", marginTop: 16 },
  modalTexto: { textAlign: "center", marginTop: 8 },
});
