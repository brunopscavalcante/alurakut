import { method } from "lodash";
import { useState, setState, useEffect } from "react";
import Box from "../src/components/Box";
import MainGrid from "../src/components/MainGrid";
import ProfileRelationsBoxWrapper from "../src/components/ProfileRelations";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";

function ProfileSideBar(props) {
  return (
    <Box>
      <img
        src={`https://github.com/${props.githubUser}.png`}
        alt="Foto"
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <a className="" href={`https://github.com/${props.githubUser}`}></a>@
      {props.githubUser}
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {props.items.map((item) => {
          return (
            <li key={item.id}>
              <a href={`/user/${item.title}`}>
                <img src={item.image} />
                <span>{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const meGithubUser = "brunopscavalcante";
  const [comunidades, setComunidades] = useState([]);
  const pessoasFavoritas = [
    "omariosouto",
    "peas",
    "rafaballerini",
    "marcobrunodev",
    "felipefialho",
  ];

  const [seguidores, setSeguidores] = useState([]);
  useEffect(function () {
    fetch("https://api.github.com/users/peleteiro/followers")
      .then((res) => res.json())
      .then((json) => setSeguidores(json));

    fetch("https://graphql.datocms.com", {
      method: "POST",
      headers: {
        Authorization: "76ecce0b56e3d6d5ee97a973217edb",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query {
        allCommunities {
          title
          id
          imageUrl
          creatorSlug
        }
      }`,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("json: " + JSON.stringify(json));
        const newcomunidades = json.data.allCommunities;
        setComunidades(newcomunidades);
        console.log(newcomunidades);
      })
      .catch((err) => console.log("Erro: " + err));
  }, []);

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSideBar githubUser={meGithubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem-vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCriaComunidade(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                console.log("Campo: ", dadosDoForm.get("title"));
                console.log("Campo: ", dadosDoForm.get("image"));

                const comunidade = {
                  id: new Date().toISOString(),
                  titulo: dadosDoForm.get("title"),
                  imageUrl: dadosDoForm.get("image"),
                  meGithubUser
                };

                fetech('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  }
                  body: JSON.stringify({comunidade})
                })
                .then(async (res) => {
                  const dados = await res.json();
                  console.log(dados)
                })

                const newcomunidades = [...comunidades, comunidade];
                setComunidades(newcomunidades);
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.map((item) => {
                return (
                  <li key={item.id}>
                    <a href={`/communities/${item.id}`}>
                      <img src={item.imageUrl} />
                      <span>{item.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((item) => {
                return (
                  <li key={item}>
                    <a href={`/user/${item}`} key={item}>
                      <img src={`https://github.com/${item}.png`} />
                      <span>{item}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
