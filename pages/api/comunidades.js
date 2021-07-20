import { SiteClient } from "datocms-client";

export default async function recebedorDeRequest(req, res) {
  console.log(req.method);
  if (req.method == "POST") {
    const TOKEN = "8cfd6872424885c9a5bdee8669dac8";
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: "977384",
      ...req.body,
      // title: "Comunidade de Teste",
      // imageUrl: "https://github.com/brunopscavalcante.png",
      // creatorSlug: "brunopscavalcante",
    });

    console.log(registroCriado);

    res.json({
      dados: "algum dado",
      registroCriado: registroCriado,
    });
	return;
  }

  res.status(404).json({
    message: "Ainda não temos nada no GET, mas no POST tem!",
  });
}
