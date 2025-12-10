import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProdutosRestaurante() {
  const { idRestaurante } = useLocalSearchParams();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [busca, setBusca] = useState("");

  async function carregarProdutos() {
    try {
      const resp = await axios.get(
        `http://10.0.2.2:8081/produtos/restaurante/${idRestaurante}`
      );

      setProdutos(resp.data);

      // 🔥 GERAR CATEGORIAS AUTOMATICAMENTE
      const categoriasUnicas = [];
      resp.data.forEach((p) => {
        if (p.categoria && !categoriasUnicas.some((c) => c.id === p.categoria.id)) {
          categoriasUnicas.push(p.categoria);
        }
      });

      setCategorias(categoriasUnicas);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  // FILTRO
  const produtosFiltrados = produtos.filter((p) => {
    const matchCategoria =
      categoriaAtiva === null || p.categoria?.id === categoriaAtiva;

    const matchBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.descricao.toLowerCase().includes(busca.toLowerCase());

    return matchCategoria && matchBusca;
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* BARRA DE PESQUISA */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar no restaurante..."
          placeholderTextColor="#777"
          style={styles.input}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* CATEGORIAS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categorias}
      >
        <TouchableOpacity
          onPress={() => setCategoriaAtiva(null)}
          style={[
            styles.catItem,
            categoriaAtiva === null && styles.catAtiva,
          ]}
        >
          <Text style={styles.catTexto}>Tudo</Text>
        </TouchableOpacity>

        {categorias.map((c) => (
          <TouchableOpacity
            key={c.id}
            onPress={() => setCategoriaAtiva(c.id)}
            style={[
              styles.catItem,
              categoriaAtiva === c.id && styles.catAtiva,
            ]}
          >
            <Text style={styles.catTexto}>{c.nome}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LISTA DE PRODUTOS */}
      {produtosFiltrados.map((p) => (
        <View key={p.idProduto} style={styles.prodContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.prodNome}>{p.nome}</Text>
            <Text style={styles.prodDesc} numberOfLines={2}>
              {p.descricao}
            </Text>
            <Text style={styles.prodPreco}>R$ {p.preco.toFixed(2)}</Text>
          </View>

          <Image
            source={{
              uri: p.urlImagem
                ? `http://10.0.2.2:8081${p.urlImagem.replace(/\\/g, "/")}`
                : "https://via.placeholder.com/120",
            }}
            style={styles.prodImg}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 15,
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  categorias: {
    paddingLeft: 10,
    paddingVertical: 10,
  },
  catItem: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 10,
  },
  catAtiva: {
    backgroundColor: "#E91E63",
  },
  catTexto: {
    color: "#333",
    fontSize: 15,
  },
  prodContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  prodNome: {
    fontSize: 16,
    fontWeight: "bold",
  },
  prodDesc: {
    color: "#777",
    marginTop: 4,
    maxWidth: 200,
  },
  prodPreco: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "bold",
  },
  prodImg: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginLeft: 10,
  },
});
