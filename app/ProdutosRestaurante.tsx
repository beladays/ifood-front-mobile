import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,Pressable
} from "react-native";
import { useSacola } from "../context/SacolaContext";
import SacolaFlutuante from '../components/botSacola'; 

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

interface Restaurante {
  idRestaurante: number;
  nome: string;
  telefone: string;
  cnpj: string;
  raio_entrega: string;
  urlImagem: string | null;
  categoria: {
    id: number;
    nome: string;
  };
}

interface RouteParams {
  id: string | number;
}

export default function ProdutosRestaurante() {
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<number | null>(null);
  const [busca, setBusca] = useState("");
  const router = useRouter();
  const { adicionar, total } = useSacola();

  console.log("ID recebido:", id);

  async function carregarRestaurante() {
    try {
      const resp = await axios.get("http://localhost:8081/restaurante/mobile");
      const restaurantes = resp.data;
      const restauranteEncontrado = restaurantes.find(
        (r: Restaurante) => r.idRestaurante === Number(id)
      );
      
      if (restauranteEncontrado) {
        setRestaurante(restauranteEncontrado);
        console.log("Restaurante carregado:", restauranteEncontrado);
      }
    } catch (error) {
      console.error("Erro ao carregar restaurante:", error);
    }
  }

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
    carregarRestaurante();
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
        {/* HEADER DO RESTAURANTE */}
        {restaurante && (
          <View style={styles.headerContainer}>
            <Image
              source={{
                uri: restaurante.urlImagem
                  ? `http://localhost:8081${restaurante.urlImagem.replace(/\\/g, "/")}`
                  : "https://via.placeholder.com/400x200",
              }}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <View style={styles.headerOverlay} />
            <View style={styles.headerContent}>
              <Text style={styles.restaurantName}>{restaurante.nome}</Text>
              <View style={styles.restaurantInfo}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>⭐</Text>
                  <Text style={styles.infoText}>4.5</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>🛵</Text>
                  <Text style={styles.infoText}>{restaurante.raio_entrega} km</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>🏷️</Text>
                  <Text style={styles.infoText}>{restaurante.categoria.nome}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

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
        onPress={() => {
          console.log("Indo para:", `/produtos/${p.idProduto}`);
          router.push(`/produtos/${p.idProduto}`);
        }}
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

<Pressable
  onPress={(e) => {
    e.stopPropagation();
    adicionar(p); // aqui é o contexto
  }}
  style={({ pressed }) => [
    styles.addButton,
    pressed && styles.addButtonPressed,
  ]}
>
  <Text style={styles.addButtonText}>+</Text>
</Pressable>
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

{/* BOTÃO FIXO DA SACOLA */}
<SacolaFlutuante />
     
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

  // HEADER DO RESTAURANTE
  headerContainer: {
    position: "relative",
    height: 240,
    backgroundColor: "#000",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  headerContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  restaurantInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  infoDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 12,
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
addButtonPressed: {
  transform: [{ scale: 0.92 }],
  opacity: 0.85,
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
    height: 90,
  },

  sacolaBar: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: 12,
  backgroundColor: "#F8F8F8",
  borderTopWidth: 1,
  borderTopColor: "#eee",
},

sacolaButton: {
  backgroundColor: "#EA1D2C",
  borderRadius: 10,
  paddingVertical: 14,
  paddingHorizontal: 20,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

sacolaText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
},

sacolaTotal: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
},

});