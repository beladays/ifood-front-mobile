import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";

export default function DetalheProduto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  async function carregarProduto() {
    try {
      const resp = await axios.get(`http://localhost:8081/produtos/${id}`);
      setProduto(resp.data);
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarProduto();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color="#EA1D2C" />
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={styles.centralizado}>
        <Text style={styles.erroTexto}>Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Imagem grande */}
      <Image
        source={{
          uri: produto.urlImagem
            ? `http://localhost:8081${produto.urlImagem.replace(/\\/g, "/")}`
            : "https://via.placeholder.com/400x300",
        }}
        style={styles.produtoImagem}
        resizeMode="cover"
      />

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.nome}>{produto.nome}</Text>

        <Text style={styles.descricao}>{produto.descricao}</Text>

        <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>

        {/* Botão adicionar */}
        <TouchableOpacity style={styles.botaoAdd}>
          <Text style={styles.botaoTexto}>Adicionar ao carrinho</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  produtoImagem: {
    width: "100%",
    height: 260,
    backgroundColor: "#eee",
  },

  content: {
    padding: 20,
  },

  nome: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },

  descricao: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
    marginBottom: 20,
  },

  preco: {
    fontSize: 22,
    fontWeight: "700",
    color: "#EA1D2C",
    marginBottom: 25,
  },

  botaoAdd: {
    backgroundColor: "#EA1D2C",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  botaoTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  centralizado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  erroTexto: { fontSize: 18, color: "#666" },
});
