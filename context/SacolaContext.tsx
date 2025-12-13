import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/* ================== TIPOS ================== */
type Produto = {
  idProduto: number;
  nome: string;
  preco: number;
  urlImagem?: string | null;
};

type ItemSacola = {
  produto: Produto;
  quantidade: number;
};

type SacolaContextType = {
  itens: ItemSacola[];
  adicionar: (produto: Produto, qtd?: number) => void;
  remover: (idProduto: number) => void;
  limpar: () => void;
  total: number;
};

/* ================== CONTEXT ================== */
const SacolaContext = createContext<SacolaContextType>(
  {} as SacolaContextType
);

/* ================== PROVIDER ================== */
export function SacolaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [itens, setItens] = useState<ItemSacola[]>([]);
  const [carregado, setCarregado] = useState(false);

  /* 🔹 CARREGAR sacola salva */
  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem("@sacola");
        if (data) {
          setItens(JSON.parse(data));
        }
      } catch (e) {
        console.log("Erro ao carregar sacola", e);
      } finally {
        setCarregado(true);
      }
    })();
  }, []);

  /* 🔹 SALVAR sempre que mudar */
  useEffect(() => {
    if (carregado) {
      AsyncStorage.setItem("@sacola", JSON.stringify(itens));
    }
  }, [itens, carregado]);

  /* ================== FUNÇÕES ================== */
  function adicionar(produto: Produto, qtd = 1) {
    setItens((prev) => {
      const existe = prev.find(
        (i) => i.produto.idProduto === produto.idProduto
      );

      if (existe) {
        return prev.map((i) =>
          i.produto.idProduto === produto.idProduto
            ? { ...i, quantidade: i.quantidade + qtd }
            : i
        );
      }

      return [...prev, { produto, quantidade: qtd }];
    });
  }

  function remover(idProduto: number) {
    setItens((prev) =>
      prev
        .map((i) =>
          i.produto.idProduto === idProduto
            ? { ...i, quantidade: i.quantidade - 1 }
            : i
        )
        .filter((i) => i.quantidade > 0)
    );
  }

  function limpar() {
    setItens([]);
  }

  const total = itens.reduce(
    (acc, i) => acc + i.produto.preco * i.quantidade,
    0
  );

  return (
    <SacolaContext.Provider
      value={{ itens, adicionar, remover, limpar, total }}
    >
      {children}
    </SacolaContext.Provider>
  );
}

/* ================== HOOK ================== */
export const useSacola = () => useContext(SacolaContext);
