import { useRoute } from "@react-navigation/native";
import axios from "axios";
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

interface Categoria {
  id_categoria: number;
  nome: string;
}

interface Produto {
  idProduto: number;
  nome: string;
  descricao: string;
  preco: number;
  ativo: boolean;
  urlImagem: string | null;
  categoria: Categoria;
}

interface RouteParams {
  id: string | number;
}

export default function ProdutosRestaurante() {
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<number | null>(null);
  const [busca, setBusca] = useState("");

  console.log("ID recebido:", id);

  async function carregarProdutos() {
    try {
      const resp = await axios.get(
        `http://localhost:8081/produtos/restaurante/${id}`
      );
      console.log("Produtos carregados:", resp.data);
      setProdutos(resp.data);

      const categoriasUnicas: Categoria[] = [];
      resp.data.forEach((p: Produto) => {
        if (
          p.categoria &&
          !categoriasUnicas.some((c) => c.id_categoria === p.categoria.id_categoria)
        ) {
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

  const produtosFiltrados = produtos.filter((p) => {
    const matchCategoria =
      categoriaAtiva === null || p.categoria?.id_categoria === categoriaAtiva;
    const matchBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* BARRA DE PESQUISA */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Buscar no cardápio"
              placeholderTextColor="#999"
              style={styles.input}
              value={busca}
              onChangeText={setBusca}
            />
          </View>
        </View>

        {/* CATEGORIAS */}
        <View style={styles.categoriasWrapper}>
          <Text style={styles.categoriasTitle}>Categorias</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categorias}
            contentContainerStyle={styles.categoriasContent}
          >
            <TouchableOpacity
              onPress={() => setCategoriaAtiva(null)}
              style={[
                styles.catItem,
                categoriaAtiva === null && styles.catAtiva,
              ]}
            >
              <Text
                style={[
                  styles.catTexto,
                  categoriaAtiva === null && styles.catTextoAtivo,
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>

            {categorias.map((c) => (
              <TouchableOpacity
                key={c.id_categoria}
                onPress={() => setCategoriaAtiva(c.id_categoria)}
                style={[
                  styles.catItem,
                  categoriaAtiva === c.id_categoria && styles.catAtiva,
                ]}
              >
                <Text
                  style={[
                    styles.catTexto,
                    categoriaAtiva === c.id_categoria && styles.catTextoAtivo,
                  ]}
                >
                  {c.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* LISTA DE PRODUTOS */}
        <View style={styles.produtosContainer}>
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map((p) => (
              <TouchableOpacity
                key={p.idProduto}
                style={styles.prodCard}
                activeOpacity={0.7}
              >
                <View style={styles.prodContent}>
                  <View style={styles.prodInfo}>
                    <Text style={styles.prodNome} numberOfLines={2}>
                      {p.nome}
                    </Text>
                    <Text style={styles.prodDesc} numberOfLines={3}>
                      {p.descricao}
                    </Text>
                    <View style={styles.prodPrecoContainer}>
                      <Text style={styles.prodPreco}>
                        R$ {p.preco.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.prodImageContainer}>
                    <Image
                      source={{
                        uri: p.urlImagem
                          ? `http://localhost:8081${p.urlImagem.replace(/\\/g, "/")}`
                          : "https://via.placeholder.com/120",
                      }}
                      style={styles.prodImg}
                      resizeMode="cover"
                    />
                    <TouchableOpacity style={styles.addButton}>
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollView: {
    flex: 1,
  },

  // SEARCH
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },

  // CATEGORIAS
  categoriasWrapper: {
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  categoriasTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categorias: {
    flexGrow: 0,
  },
  categoriasContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minHeight: 36,
    justifyContent: "center",
  },
  catAtiva: {
    backgroundColor: "#EA1D2C",
    borderColor: "#EA1D2C",
  },
  catTexto: {
    color: "#717171",
    fontSize: 14,
    fontWeight: "500",
  },
  catTextoAtivo: {
    color: "#fff",
    fontWeight: "600",
  },

  // PRODUTOS
  produtosContainer: {
    paddingTop: 16,
  },
  prodCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  prodContent: {
    flexDirection: "row",
    padding: 16,
  },
  prodInfo: {
    flex: 1,
    paddingRight: 12,
    justifyContent: "space-between",
  },
  prodNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    lineHeight: 22,
    marginBottom: 4,
  },
  prodDesc: {
    fontSize: 13,
    color: "#717171",
    lineHeight: 18,
    marginBottom: 8,
  },
  prodPrecoContainer: {
    marginTop: 4,
  },
  prodPreco: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  prodImageContainer: {
    position: "relative",
    width: 120,
    height: 120,
  },
  prodImg: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
  },
  addButton: {
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EA1D2C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 28,
  },

  // EMPTY STATE
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },

  bottomSpacing: {
    height: 24,
  },
});