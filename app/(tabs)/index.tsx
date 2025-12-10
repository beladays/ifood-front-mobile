import { Card, Text } from '@rneui/themed';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { Image, ScrollView, StyleSheet, View } from 'react-native';
=======
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
>>>>>>> 6f2b329ae4777539d67ff7992a31be79df6a6e8e

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


<<<<<<< HEAD
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
=======
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
              <Image source={{ uri: c.imagemUrl }} style={styles.logo} resizeMode="cover" />
              <Text style={styles.nomeLoja}>{c.nome}</Text>
            </View>
          ))}
        </ScrollView>
      </Card>

{/* LISTA DOS RESTAURANTES */}
<Card>
  <Card.Title>Todas as Lojas</Card.Title>
  <Card.Divider />

  {Array.isArray(lojas) && lojas.map((l) => {
    const img = l.urlImagem
      ? `http://localhost:8081${l.urlImagem.replace(/\\/g, "/")}`
      : "https://via.placeholder.com/100";

    return (
      <TouchableOpacity
        key={l.id}
        onPress={() =>
          navigation.navigate("ProdutosRestaurante", { idRestaurante: l.id })
        }
      >
        <View style={styles.imgLoja}>
          <Image
            style={styles.thumb}
            resizeMode="cover"
            source={{ uri: img }}
          />
          <Text style={styles.name}>{l.nome}</Text>
        </View>
      </TouchableOpacity>
    );
  })}
</Card>
    </ScrollView>
  );
}
>>>>>>> 6f2b329ae4777539d67ff7992a31be79df6a6e8e

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
