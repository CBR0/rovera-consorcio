# Rovera Consórcio

Projeto Next.js para simulação de consórcio de veículos elétricos.


Link para visualização: https://rovera-consorcio.vercel.app/

Para visualizar os leads basta acessar [/leads](https://rovera-consorcio.vercel.app/leads).\
Essa página é um mini gerenciador, não possui autenticação.


## Como Rodar o Projeto
Recomendo usar o link publicado para testar a area autenticada caso não queira configurar as variaveis de ambiente para rodar local.
### Pré-requisitos
- Node.js 18+
- npm

### Instalação

```bash
npm install
```

### Configuração

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. Configure as variáveis de ambiente no `.env.local`:
```env
# Autenticação OAuth (GitHub)
GITHUB_ID=seu_github_id
GITHUB_SECRET=seu_github_secret

# Autenticação OAuth (Google)
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# NextAuth
NEXTAUTH_SECRET=gerar_uma_chave_secreta
NEXTAUTH_URL=http://localhost:3000

# MongoDB (opcional, apenas para desenvolvimento local)
MONGODB_URI=mongodb://localhost:27017/rovera-consorcio
```

### Executando

```bash
# Desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

---

## Decisões Técnicas

### Stack
- **Next.js 16** com App Router
- **Tailwind CSS v4** para estilização
- **NextAuth v4** para autenticação OAuth (GitHub + Google)
- **MongoDB** para persistência de dados

### Estrutura de Pastas
```
app/                  # Next.js App Router
├── api/              # API Routes
│   ├── auth/         # NextAuth
│   └── leads/        # CRUD de Leads
├── dashboard/        # Área autenticada
└── page.tsx          # Página principal

components/           # Componentes React
lib/                  # Utilitários (MongoDB)
models/               # Modelos de dados
```

### Decisões de Adaptação Mobile

Para conseguir manter a identidade visual, eu optei por manter o circulo maior em volta da estrutura do hero, porém, em resoluções retangulares não seria possivel manter a circunferência perfeita, então criei de uma forma que o conteúdo permaneça ao centro, o formato é retangular para manter o aspecto de conjunto.

Mantive as cores de fundo do texto principal, porém o efeito de luz sobre o carro fica prejudicado pelo posicionamento centralizado ja que decidi utilizar uma posição flutuante de forma que fique bom na maioria das resoluções.

Fiz um ajuste do tamanho da fonte, apenas para que o foco ainda se mantivesse na imagem e não perdesse a leitura do texto.

Na tela "autenticada" optei por criar o formulário centralizado com os dados do usuário no topo para facilitar ajustes de proporção em resoluções menores.

---

## Trade-offs e Decisões Relevantes

### Autenticação
- **NextAuth com cookies sameSite: 'none'** - Necessário para funcionar em diferentes domínios durante desenvolvimento local
- **Callback de redirect customizado** - Preserva a URL original após login

---

## Agradecimentos
Gostaria de agradecer a oportunidade e estou muito feliz com o resultado do projeto, tive um desafio com relação ao Next.js, pois, como mencionei anteriormente tenho um forte conhecimento em Angular e acredito que consegui reaproveitar muito do conhecimento web no geral neste projeto.

Muito obrigado 😊

