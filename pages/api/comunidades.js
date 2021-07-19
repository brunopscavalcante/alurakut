import { SiteClient } from "datocms-client";

export default async function recebedorDeRequest(req, res) {
  console.log(req.method);
  if (req.method == "POST") {
    const TOKEN = ":P";
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
      registroCriado,
    });
  }

  res.status(404).json({
    message: "Ainda não temos nada no GET, mas no POST tem!",
  });
}
