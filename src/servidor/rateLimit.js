let requests = [];

export async function rateLimit(req, res) {
  const agora = Date.now();
  const dezMinutos = agora + 10 * 60 * 1000;

  requests = requests.filter((request) => request.expira > agora);

  const requestsDoIp = requests.filter(
    (request) => request.ip === req.ip
  ).length;

  if (requestsDoIp >= 20) {
    return res
      .status(429)
      .send({ message: "Muitas requisições. Tente novamente mais tarde." });
  }

  requests.push({
    ip: req.ip,
    expira: dezMinutos,
  });
}
