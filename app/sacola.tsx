import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API_BASE_URL } from "../app/config";
import { useSacola } from "../context/SacolaContext";



export default function Sacola() {
  const { itens, adicionar, remover, total } = useSacola();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sacola</Text>

      {itens.map((item) => (
        <View key={item.produto.idProduto} style={styles.item}>
          <Image
            source={{
              uri: item.produto.urlImagem
                ? `${API_BASE_URL}${item.produto.urlImagem.replace(/\\/g, "/")}`
                : "https://via.placeholder.com/80",
            }}
            style={styles.imagem}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.nome}>{item.produto.nome}</Text>
            <Text style={styles.preco}>
              R$ {(item.produto.preco * item.quantidade).toFixed(2)}
            </Text>
          </View>

          <View style={styles.qtd}>
            <TouchableOpacity
              onPress={() => remover(item.produto.idProduto)}
            >
              <Text style={styles.btn}>−</Text>
            </TouchableOpacity>

            <Text style={styles.quantidade}>{item.quantidade}</Text>

            <TouchableOpacity onPress={() => adicionar(item.produto)}>
              <Text style={styles.btn}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* BOTÃO FIXO */}
      <TouchableOpacity
        style={styles.botaoFinal}
      >
        <Text style={styles.botaoTexto}>
          Finalizar pedido • R$ {total.toFixed(2)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  imagem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  nome: {
    fontSize: 16,
    fontWeight: "600",
  },

  preco: {
    color: "#EA1D2C",
    fontWeight: "700",
    marginTop: 4,
  },

  qtd: {
    flexDirection: "row",
    alignItems: "center",
  },

  btn: {
    fontSize: 22,
    paddingHorizontal: 12,
    color: "#EA1D2C",
    fontWeight: "700",
  },

  quantidade: {
    fontSize: 16,
    fontWeight: "600",
  },

  botaoFinal: {
    backgroundColor: "#EA1D2C",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },

  botaoTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
