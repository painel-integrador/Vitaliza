import "dotenv/config";
import servidor from "./src/servidor/servidor.js";

if (process.env.ENV === "desenvolvimento") {
  servidor.listen({ port: 3000 }, function (err, address) {
    if (err) {
      servidor.log.error(err);
      process.exit(1);
    }
  });
} else if (process.env.ENV === "producao") {
  servidor.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
    if (err) {
      servidor.log.error(err);
      process.exit(1);
    }
  });
}
