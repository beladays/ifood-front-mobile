import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Text, Card } from '@rneui/themed';
import axios from 'axios';

type Loja = {
  id: number;
  nome: string;
  descriçao:string;
  logo: string;
  categoria: string
};

type Categoria = {
  id: number;
  nome: string;
  imagem: string
  
};

export default function Principal() {
  const [desc, setDesc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Carregar lojas
  useEffect(() => {
    async function carregarLojas() {
      try {
        const response = await axios.get('http://localhost:8000/restaurante'); // coloque sua URL da API aqui
        console.log('Resposta lojas:', response.data);

        // Garante que é um array antes de salvar
        const dados = Array.isArray(response.data)
          ? response.data
          : response.data.lojas || [];

        setLojas(dados);
      } catch (error) {
        console.error('Erro ao carregar lojas:', error);
      }
    }

    carregarLojas();
  }, []);

  // Card de desconto
  useEffect(() => {
    async function CardDesconto() {
      try {
        const response = await axios.get(''); // coloque sua URL da API aqui
        setDesc(response.data);
      } catch (error) {
        console.error('Erro ao carregar promoções:', error);
      } finally {
        setLoading(false);
      }
    }

    CardDesconto();
  }, []);

  // Carregar categorias
  useEffect(() => {
    async function carregarCategorias() {
      try {
        const response = await axios.get('http://localhost:8000/categoria'); // API 
        console.log('Resposta categorias:', response.data);

        const dados = Array.isArray(response.data)
          ? response.data
          : response.data.categorias || [];

        setCategorias(dados);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    }

    carregarCategorias();
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* CARD DAS PROMOÇÕES */}
      <Card>
        <Card.Title>Promoções da Semana</Card.Title>
        <Card.Divider />
        {loading ? (
          <ActivityIndicator size="large" color="#E53935" />
        ) : (
          <View style={{ position: 'relative', alignItems: 'center' }}>
            {desc && desc.image ? (
              <Image
                style={{ width: '100%', height: 200 }}
                resizeMode="contain"
                source={{ uri: desc.image }}
              />
            ) : (
              <Image
                style={{ width: '100%', height: 200 }}
                resizeMode="contain"
                source={{
                  uri: 'https://raw.githubusercontent.com/PatrickEN-dev/bt-food-front/main/public/promo-banner-01.png',
                }}
              />
            )}
            <Text style={styles.promoText}>
              {desc ? desc.nome || 'Promoção especial!' : 'Sem promoções no momento'}
            </Text>
          </View>
        )}
      </Card>

      {/* CATEGORIAS */}
      <Card>
        <Card.Title>Categorias</Card.Title>
        <Card.Divider />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Array.isArray(categorias) && categorias.map((c) => (
            <View key={c.id} style={styles.cardLoja}>
              <Image source={{ uri: c.imagem }} style={styles.logo} resizeMode="cover" />
              <Text style={styles.nomeLoja}>{c.nome}</Text>
            </View>
          ))}
        </ScrollView>
      </Card>

      {/* LISTA DOS RESTAURANTES */}
      <Card>
        <Card.Title>Todas as Lojas</Card.Title>
        <Card.Divider />
        {Array.isArray(lojas) && lojas.map((l) => (
          <View key={l.id} style={styles.imgLoja}>
            <Image style={styles.thumb} resizeMode="cover" source={{ uri: l.logo }} />
            <Text style={styles.name}>{l.nome}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imgLoja: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
  },
  promoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E53935',
    marginTop: 10,
  },
  cardLoja: {
    alignItems: 'center',
    marginRight: 15,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: '#E53935',
  },
  nomeLoja: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
