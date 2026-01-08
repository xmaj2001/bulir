FROM node:latest

WORKDIR /app

ENV CORS_ORIGIN="http://localhost:3000"
ENV DATABASE_URL="postgresql://neondb_owner:npg_OVniHZB3U7hW@ep-blue-wildflower-ae5x1g7r-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
ENV NODE_ENV="development"
ENV PORT=5000
ENV JWT_ACCESS_EXPIRES_IN="1d"
ENV JWT_ACCESS_SECRET="hunterkeymura-643f-4d2b-8e3b-2f6e8f9e8e7a"
ENV JWT_REFRESH_EXPIRES_IN="7d"
ENV JWT_REFRESH_SECRET="643f-4d2b-8-hunterkeymura-e3b-2f6e8f9e8e7a"

COPY package*.json ./

COPY prisma ./prisma

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx prisma db push

EXPOSE 5000

CMD ["npm", "run", "start:dev"]
