# Cripto Monitor

Dashboard interativo para monitoramento de criptomoedas em tempo real utilizando a API da CoinGecko.

## Sobre o Projeto

O Cripto Monitor é uma aplicação Vue 3 que oferece:

- Monitoramento em tempo real de preços e tendências de criptomoedas
- Gráficos dinâmicos com diversos indicadores técnicos
- Filtros avançados por período, volume, capitalização e variação
- Suporte offline com cache local para funcionamento sem internet
- Interface responsiva e intuitiva

## Tecnologias

- Vue 3
- TypeScript
- Vite
- CoinGecko API
- Vitest
- Cypress
- ESLint

## Instalação

````bash
# Clone o repositório
git clone https://github.com/seu-usuario/cripto-monitor

# Instale as dependências
npm install


## Execução

```bash
# Ambiente de desenvolvimento
npm run dev

# Build de produção
npm run build

# Testes unitários
npm run test:unit

# Testes E2E em desenvolvimento
npm run test:e2e:dev

# Testes E2E em produção
npm run test:e2e
````

## Funcionalidades

### Gráficos

- **Candlestick**: Exibe variações de preço em diferentes intervalos
- **Volume**: Análise de volume de negociação
- **Indicadores Técnicos**: Médias móveis, RSI, MACD
- **Dominância**: Participação percentual no mercado

### Filtros

- Período: 24h, 7d, 30d, 1y
- Moeda de Cotação
- Nome da Criptomoeda

### Cache Local

- Armazenamento automático dos últimos dados consultados
- Sincronização inteligente ao recuperar conexão
- Configuração de tempo de expiração do cache

### Atualizações em Tempo Real

- Pooling para métricas
