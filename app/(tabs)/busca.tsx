import { SearchBar } from '@rneui/themed';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_BASE_URL } from '../config';

type Categoria = {
  id: number;
  nome: string;
  urlImagem: string;
};

export default function Busca() {
  const [search, setSearch] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const updateSearch = (text: string) => setSearch(text);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const response = await axios.get<Categoria[]>(
          `${API_BASE_URL}/categorias/restaurantes`
        );
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategorias();
  }, []);

  const categoriasFiltradas = categorias.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase())
  );

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 30) / 2;

  const renderItem = ({ item }: { item: Categoria }) => (
    <TouchableOpacity style={[styles.card, { width: cardWidth }]}>
      <ImageBackground
        source={{
          uri: item.urlImagem
            ? `${API_BASE_URL}${item.urlImagem.replace(/\\/g, "/")}`
            : 'https://via.placeholder.com/150',
        }}
        style={styles.imagemFundo}
        imageStyle={{ borderRadius: 8 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.nome}>{item.nome}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="O que vai pedir hoje?"
        onChangeText={updateSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.inputContainer}
      />

      <Text style={styles.titulo}>Categorias</Text>

      <FlatList
        data={categoriasFiltradas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Nenhuma categoria encontrada
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  searchContainer: {
    backgroundColor: '#f5f5f5',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 10,
  },
  titulo: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagemFundo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 5,
    alignItems: 'center',
  },
  nome: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
});
