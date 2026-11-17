# Usa uma imagem oficial do Node.js leve (Alpine)
FROM node:22-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto para dentro do container
COPY . .

# Gera os arquivos estáticos otimizados que serão servidos pelo Fastify
RUN npm run build:frontend

# Expõe a porta que a aplicação irá rodar
EXPOSE 3000

CMD ["node", "index.js"]