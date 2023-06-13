import express from "express";
import fs from "fs";
import path from "path";
import { format } from "date-fns";
import { parseString } from "xml2js";

const app = express();

app.use(express.text({ type: "application/xml" }));

// http://localhost:3000/api/upload?pw=1234&folder=C:\Users\wagne\OneDrive\Desktop\Teste
app.post("/api/upload", async (req, res) => {
  const xmlData = req.body;
  const pw = req.query.pw;
  const folder = req.query.folder;

  if (pw !== "1234") {
    return res.status(401).send("Acesso não autorizado.");
  }

  if (!folder) {
    return res.status(400).send("O parâmetro 'folder' é obrigatório.");
  }

  parseString(xmlData, (err, result) => {
    if (err) {
      console.error("Erro ao analisar o XML:", err);
      res.status(500).send("Erro ao analisar o XML.");
    } else {
      const numero = result.OrdemServico.DadosBasicos[0].Numero[0];

      const currentDate = new Date();
      const formattedDate = format(currentDate, "yyyy-MM-dd_HH-mm-ss");
      const fileName = `${numero}_${formattedDate}.xml`;

      const filePath = path.join(folder, fileName);

      fs.writeFile(filePath, xmlData, (err) => {
        if (err) {
          console.error("Erro ao salvar o arquivo:", err);
          res.status(500).send("Erro ao salvar o arquivo.");
        } else {
          console.log("Arquivo salvo com sucesso.");
          res.status(200).send("Arquivo salvo com sucesso.");
        }
      });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}.`);
});
