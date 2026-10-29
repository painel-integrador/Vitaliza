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

# (Opcional) Porta em que a aplicação roda (ajuste conforme necessário, ex: 3000)
EXPOSE 3000

# Comando para rodar a aplicação (substitua "start" pelo script do seu package.json, ex: "dev", "build", etc.)
CMD ["node", "index.js"]