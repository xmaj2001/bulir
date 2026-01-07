FROM node:latest

WORKDIR /app

ENV DATABASE_URL="postgresql://postgres.qqsaufynlzbgzsbpgyah:ASyTbXZXH53vgeDA@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

COPY package*.json ./

COPY prisma ./prisma

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx prisma db push

EXPOSE 5000

CMD ["npm", "run", "start:dev"]
