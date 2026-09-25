import "dotenv/config";
import servidor from "./src/servidor/servidor.js";

// O Render injeta a porta via process.env.PORT. Se não existir (desenvolvimento), usa 3000.
const PORT = process.env.PORT || 3000;

if (process.env.ENV === "desenvolvimento") {
  servidor.listen({ port: PORT }, function (err, address) {
    if (err) {
      servidor.log.error(err);
      process.exit(1);
    }
  });
} else {
  // Para produção ou caso ENV não esteja explicitamente configurado no Render
  servidor.listen({ port: PORT, host: "0.0.0.0" }, function (err, address) {
    if (err) {
      servidor.log.error(err);
      process.exit(1);
    }
  });
}
