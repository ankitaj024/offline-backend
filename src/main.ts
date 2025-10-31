import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Handle OPTIONS manually for ngrok
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    
    next();
  });

  // ✅ NestJS CORS
  app.enableCors({
    origin: [
      "https://offline-frontend.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    allowedHeaders: "*",
    credentials: true,
  });

  // ✅ API prefix
  app.setGlobalPrefix("api");

  await app.listen(process.env.PORT || 4000);
}

bootstrap();
