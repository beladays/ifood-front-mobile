import React, { createContext, useContext, useState } from "react";

type Produto = {
  idProduto: number;
  nome: string;
  preco: number;
  urlImagem?: string;
};

type ItemSacola = {
  produto: Produto;
  quantidade: number;
};

type SacolaContextType = {
  itens: ItemSacola[];
  adicionar: (produto: Produto, quantidade?: number) => void;
  remover: (idProduto: number) => void;
  total: number;
};

const SacolaContext = createContext<SacolaContextType>(
  {} as SacolaContextType
);

export function SacolaProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemSacola[]>([]);

  function adicionar(produto: Produto, quantidade: number = 1) {
    setItens((prev) => {
      const existe = prev.find(
        (i) => i.produto.idProduto === produto.idProduto
      );

      if (existe) {
        return prev.map((i) =>
          i.produto.idProduto === produto.idProduto
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i
        );
      }

      return [...prev, { produto, quantidade }];
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

  const total = itens.reduce(
    (sum, i) => sum + Number(i.produto.preco) * i.quantidade,
    0
  );

  return (
    <SacolaContext.Provider value={{ itens, adicionar, remover, total }}>
      {children}
    </SacolaContext.Provider>
  );
}

export function useSacola() {
  return useContext(SacolaContext);
}
