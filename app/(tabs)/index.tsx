import { Card, Text } from '@rneui/themed';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

type Loja = {
  id: number;
  nome: string;
  descriçao: string;
  urlImagem: string;
  categoria: string
};

type Categoria = {
  id: number;
  nome: string;
  imagemUrl: string

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
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:8081/restaurante/mobile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        console.log("Resposta lojas:", response.data);

        const dados = Array.isArray(response.data)
          ? response.data
          : response.data.lojas || [];

        setLojas(dados);
      } catch (error) {
        console.error("Erro ao carregar lojas:", error);
      }
    }

    carregarLojas();
  }, []);


  // Card de desconto
  // useEffect(() => {
  //   async function CardDesconto() {
  //     try {
  //       const response = await axios.get(''); // coloque sua URL da API aqui
  //       setDesc(response.data);
  //     } catch (error) {
  //       console.error('Erro ao carregar promoções:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   CardDesconto();
  // }, []);

  // Carregar categorias
  useEffect(() => {
    async function carregarCategorias() {
      try {
        const token = localStorage.getItem("token"); // ou AsyncStorage no mobile

        const response = await axios.get(
          "http://localhost:8081/categorias/restaurantes",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("Resposta categorias:", response.data);

        const dados = Array.isArray(response.data)
          ? response.data
          : response.data.categorias || [];

        setCategorias(dados);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }

    carregarCategorias();
  }, []);
return (
  <ScrollView style={{ flex: 1 }}>

    {/* PROMOÇÕES */}
    <Card>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
      >

        <Image
          style={{ width: 300, height: 200,  marginRight: 10 }}
          resizeMode="contain"
          source={{
            uri: 'https://raw.githubusercontent.com/PatrickEN-dev/bt-food-front/main/public/promo-banner-02.png',
          }}
        />
         <Image
          style={{ width: 300, height: 200 ,  marginRight: 10}}
          resizeMode="contain"
          source={{
            uri: 'https://raw.githubusercontent.com/PatrickEN-dev/bt-food-front/main/public/promo-banner-02.png',
          }}
        />
      </ScrollView>
    </Card>


    {/* CATEGORIAS */}
    <Card>
      <Card.Title>Categorias</Card.Title>
      <Card.Divider />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categorias.map((c) => (
          <View key={c.id} style={styles.cardLoja}>
            <Image source={{ uri: c.imagemUrl }} style={styles.logo} resizeMode="cover" />
            <Text style={styles.nomeLoja}>{c.nome}</Text>
          </View>
        ))}
      </ScrollView>
    </Card>


    {/* LOJAS */}
    <Card>
      <Card.Title>Todas as Lojas</Card.Title>
      <Card.Divider />
      {lojas.map((l) => (
        <View key={l.id} style={styles.imgLoja}>
          <Image
            style={styles.thumb}
            resizeMode="cover"
            source={{
              uri: l.urlImagem
                ? `http://localhost:8081${l.urlImagem.replace(/\\/g, "/")}`
                : "https://via.placeholder.com/100"
            }}
          />
          <Text style={styles.name}>{l.nome}</Text>
        </View>
      ))}
    </Card>

  </ScrollView>
);}

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
