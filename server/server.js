const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 5000;
// && puppeteer browsers install chrome

app.use(cors());
app.use(express.json());

const LOTOFACIL_URL = 'https://loterias.caixa.gov.br/Paginas/Lotofacil.aspx';

// Função para obter os resultados usando Puppeteer
const obterResultadosLotofacil = async () => {
  const browser = await puppeteer.launch({ 
	headless: true,
	args: [
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-dev-shm-usage',
		'--disable-gpu',
		'--no-zygote',
		'--single-process',
		'--disable-background-networking',
		'--disable-default-apps',
		'--disable-extensions',
		'--disable-sync',
		'--disable-translate',
		// '--remote-debugging-port=9222'
	  ],
	  dumpio: true
	// executablePath: '/opt/render/project/src/server/.cache/puppeteer/chrome/linux-130.0.6723.58/chrome-linux64/chrome'
});
  const page = await browser.newPage();
//   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto(LOTOFACIL_URL, { waitUntil: 'networkidle2' });

  try {
    await page.waitForSelector('.resultado-loteria li', { timeout: 60000 });

    const resultados = await page.evaluate(() => {
      const elementos = document.querySelectorAll('.resultado-loteria li');
	  console.log(`Elementos: ${elementos}`)
      const numeros = [];
      elementos.forEach(element => {
        const numero = parseInt(element.innerText.trim(), 10);
        numeros.push(numero);
      });
      return numeros;
    });

	console.log(resultados);

    await browser.close();
    return resultados;

  } catch (error) {
    console.error('Erro ao tentar capturar os resultados:', error);
    await browser.close();
    return [];
  }
};

// Função recursiva para gerar combinações de 9 números
const gerarCombinacoes = (arr, tamanho) => {
  if (tamanho === 1) {
    return arr.map(num => [num]);
  }
  const combinacoes = [];
  arr.forEach((num, i) => {
    const combinacoesRestantes = gerarCombinacoes(arr.slice(i + 1), tamanho - 1);
    combinacoesRestantes.forEach(combinacao => {
      combinacoes.push([num, ...combinacao]);
    });
  });
  return combinacoes;
};

// Função para gerar combinações de 9 números
const gerarCombinacoesDeNove = (numerosAnteriores) => {
  return gerarCombinacoes(numerosAnteriores, 9);
};

// Funcao para gerar combinacoes de 6 numeros
const gerarCombinacoesDeSeis = (numerosDisponiveis) => {
  return gerarCombinacoes(numerosDisponiveis, 6);
}

// Função para gerar combinacoes de 6 números entre 1 e 25, excluindo os já selecionados
const gerarFechamentoNumerosRestantes = (excluidos, limite) => {
  const numerosDisponiveis = Array.from({ length: 25 }, (_, i) => i + 1)
    .filter(num => !excluidos.includes(num)); // Remove os números já escolhidos
  
  const combinacoesNumerosRestantes = gerarCombinacoes(numerosDisponiveis, limite);

  return combinacoesNumerosRestantes;
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function filterFechamento(fechamento, max) {
  let odd = true;
  let randomPosition = getRandomInt(max-1);
  let result;
  let skip = false;
  let skipRound = 0;
  let skipLimit = 2000;
  
  const skipInterval = 5;
  
  return fechamento.filter((numeros, index) => {
    if (skip && skipRound <= skipLimit) {
      skipRound++;
      return false;
    } else if (skipRound === skipLimit) {
      skip = false;
      skipRound = 0;
      skipLimit = getRandomInt(1000);
    }
    
    result = false;
    if (odd && numeros[randomPosition] % 2 > 0) {
      result = true;
    } else if (!odd && numeros[randomPosition] % 2 === 0) {
      result = true;
    }

    odd = !odd;
    randomPosition = getRandomInt(max-1);

    if (index === skipInterval-1) {
      skip = true;
    }

    return result; 
  })
}

// Rota para gerar todas as combinações possíveis
app.get('/gerar-combinacoes', async (req, res) => {
  const resultadosAnteriores = await obterResultadosLotofacil();
  if (resultadosAnteriores.length < 15) {
    return res.status(500).json({ error: 'Não foi possível obter resultados anteriores.' });
  }
  
  // Obtem o parametro de quantidade de numeros fixos
  const qtdNumerosFixos = parseInt(req.query.qtdNumerosFixos, 10) || 9;

  // Obtem combinações de 9 números dos 15 do sorteio anterior
  let combinacoesDeNove = gerarCombinacoes(resultadosAnteriores, qtdNumerosFixos);

  // Obtém o parâmetro de limite de jogos da query string
  const limiteJogos = parseInt(req.query.limite, 10) || combinacoesDeNove.length;

  // Obtem o parametro de jogos com 9 numeros fixos ou nao
  const jogosComNoveFixo = Boolean(eval(req.query.noveFixo)) || false;

  // Obtem o parametro de limite de fechamentos
  const limiteFechamento = parseInt(req.query.limiteFechamento, 10) || 10;

  let jogos;

  if (jogosComNoveFixo) {
    const combinacaoFixa = combinacoesDeNove[getRandomInt(combinacoesDeNove.length)-1]
    combinacoesDeNove = combinacoesDeNove.map(() => combinacaoFixa);

    let fechamentoSeisNumeros = gerarFechamentoNumerosRestantes(combinacaoFixa, 15-qtdNumerosFixos);
    // fechamentoSeisNumeros = filterFechamento(fechamentoSeisNumeros, 6);
    
    // Limita a quantidade de jogos gerados
    jogos = fechamentoSeisNumeros.slice(0, limiteJogos).map((seisNumeros) => {
      return [...combinacaoFixa, ...seisNumeros];
    });
  } else {
    // Limita a quantidade de jogos gerados
    jogos = combinacoesDeNove.slice(0, limiteJogos).reduce((acc, combinacao) => {
      let fechamentoSeisNumeros = gerarFechamentoNumerosRestantes(combinacao, 15-qtdNumerosFixos);
      // fechamentoSeisNumeros = filterFechamento(fechamentoSeisNumeros, 6);

      fechamentoSeisNumeros.slice(0, limiteFechamento).forEach((seisNumeros) => {
        acc.push([...combinacao, ...seisNumeros]);
      });

      return acc;
    }, []);
  }

  res.json({ totalJogos: jogos.length, jogos }); // Inclui o número total de jogos gerados
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
