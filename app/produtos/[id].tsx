import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSacola } from "../../context/SacolaContext";

export default function DetalheProduto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);

  const { adicionar } = useSacola();

  // ✅ valor total seguro
const preco = produto
  ? parseFloat(String(produto.preco).replace(",", "."))
  : 0;
const valorTotal = preco * quantidade;

  async function carregarProduto() {
    try {
      const resp = await axios.get(
        `http://localhost:8081/produtos/detalhe/${id}`
      );
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

function diminuir() {
  console.log("ANTES diminuir:", quantidade);
  if (quantidade > 1) {
    setQuantidade((q) => {
      console.log("DEPOIS diminuir:", q - 1);
      return q - 1;
    });
  }
}

function aumentar() {
  console.log("ANTES aumentar:", quantidade);
  setQuantidade((q) => {
    console.log("DEPOIS aumentar:", q + 1);
    return q + 1;
  });
}


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

  console.log("RENDER → quantidade:", quantidade, "valorTotal:", valorTotal);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGEM */}
        <Image
          source={{
            uri: produto.urlImagem
              ? `http://localhost:8081${produto.urlImagem.replace(/\\/g, "/")}`
              : "https://via.placeholder.com/400x300",
          }}
          style={styles.produtoImagem}
        />

        {/* CONTEÚDO */}
        <View style={styles.content}>
          <Text style={styles.nome}>{produto.nome}</Text>

          <Text style={styles.descricao}>{produto.descricao}</Text>

          <Text style={styles.preco}>
  R$ {preco.toFixed(2)}
</Text>

        </View>
      </ScrollView>

      {/* FOOTER FIXO (igual iFood) */}
      <View style={styles.footer}>
        <View style={styles.quantidadeContainer}>
          <TouchableOpacity
            style={[
              styles.qtdBotao,
              quantidade === 1 && styles.qtdBotaoDisabled,
            ]}
            onPress={diminuir}
            disabled={quantidade === 1}
          >
            <Text style={styles.qtdTexto}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qtdNumero}>{quantidade}</Text>

          <TouchableOpacity style={styles.qtdBotao} onPress={aumentar}>
            <Text style={styles.qtdTexto}>+</Text>
          </TouchableOpacity>
        </View>

<TouchableOpacity
  style={styles.botaoAdd}
  onPress={() => adicionar(produto, quantidade)}
>
<Text
  key={quantidade}
  style={styles.botaoTexto}
>
  Adicionar • R$ {valorTotal.toFixed(2)}
</Text>
</TouchableOpacity>
      </View>
      
    </View>
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
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },

  quantidadeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  qtdBotao: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EA1D2C",
    alignItems: "center",
    justifyContent: "center",
  },

  qtdBotaoDisabled: {
    opacity: 0.4,
  },

  qtdTexto: {
    fontSize: 22,
    color: "#EA1D2C",
    fontWeight: "600",
  },

  qtdNumero: {
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: "600",
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

  erroTexto: {
    fontSize: 18,
    color: "#666",
  },
});
