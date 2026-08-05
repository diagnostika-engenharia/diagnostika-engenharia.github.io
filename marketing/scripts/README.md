# marketing/scripts/

Scripts utilitários da operação de marketing.

## gerar-landings.js

Lê `marketing/condominios-rmc.csv` e gera:

- Uma landing `condominio/[slug].html` por prédio com `prioridade=A` ou `B`.
- `condominio/index.html` — índice agrupado por cidade.
- `sitemap.xml` na raiz — para o Google indexar rápido.
- `robots.txt` na raiz (só se ainda não existir).

### Como rodar

```
node marketing/scripts/gerar-landings.js
```

Sem dependências. Sobrescreve landings existentes.

### Quando rodar
- Toda vez que o CSV for atualizado (novos prédios validados, mudança de status).
- Antes de subir para produção.
- Idealmente via GitHub Action em push (a fazer).

### Filtros aplicados

- Só gera landing para `prioridade` = A ou B (evita prédios fora-da-janela).
- Coluna `observacoes` é filtrada — se contém palavras-chave internas
  ("verificar", "PROVAVEL", "janela ideal", "pendente" etc.),
  o texto NÃO vai para o público; usa-se só o texto genérico.
- Se o CSV não tiver `bairro`, `data_entrega` ou `incorporadora`, o gerador
  omite essas partes graciosamente.

### Como o rastreio de UTM funciona nas landings

Cada CTA aponta para `/solicitar-art.html` com querystring:

```
?p=CPS001              → predio_codigo (rastreado no lead)
&pn=Alenza%20Cambu%C3%AD  → nome (mostrado como badge + pré-preenche o campo)
&src=seo-landing       → canal
&c=predio-page         → posição do CTA (topo/bottom/footer)
```

O `/solicitar-art.html` já lê essa querystring e persiste no Supabase
(colunas `predio_codigo`, `embaixador_codigo`, `criativo`, `origem`).
