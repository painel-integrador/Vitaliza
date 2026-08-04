import "dotenv/config";
import servidor from "./src/servidor/servidor.js";

servidor.listen({ port: 3000 }, function (err, address) {
  if (err) {
    servidor.log.error(err);
    process.exit(1);
  }
});
