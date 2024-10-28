import React, { useState } from 'react';
import './App.css';

function App() {
  const [limiteJogos, setLimiteJogos] = useState(10);
  const [limiteFechamento, setLimiteFechamento] = useState(10);
  const [jogos, setJogos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [noveFixo, setNoveFixo] = useState(false);
  const [loading, setLoading] = useState(false);
  const jogosPorPagina = 5;

  const gerarJogos = async () => {
    setLoading(true);
    setJogos([]);
    try {
      const response = await fetch(`http://localhost:5000/gerar-combinacoes?limite=${limiteJogos}&limiteFechamento=${limiteFechamento}&noveFixo=${noveFixo}`);
      if (!response.ok) {
        throw new Error('Erro ao gerar jogos');
      }
      const data = await response.json();
      setJogos(data.jogos);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setPaginaAtual(1);
      setLoading(false);
    }
  };

  const totalPaginas = Math.ceil(jogos.length / jogosPorPagina);
  const jogosVisiveis = jogos.slice((paginaAtual - 1) * jogosPorPagina, paginaAtual * jogosPorPagina);

  return (
    <div className="App">
      <h1>Gerador de Jogos Lotofacil</h1>
      <div className="form">
        <label>
          Limite de Jogos:
          <input
            type="number"
            value={limiteJogos}
            onChange={(e) => setLimiteJogos(Number(e.target.value))}
          />
        </label>
        <label>
          Limite de Fechamento:
          <input
            type="number"
            value={limiteFechamento}
            onChange={(e) => setLimiteFechamento(Number(e.target.value))}
          />
        </label>
        <label>
          Jogos com 9 Números Fixos:
          <input
            type="checkbox"
            checked={noveFixo}
            onChange={(e) => setNoveFixo(e.target.checked)}
          />
        </label>
        <button onClick={gerarJogos} disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar Jogos'}
        </button>
      </div>
      
      <div className="total-jogos">
        {jogos.length > 0 && <p>Total de Jogos Gerados: {jogos.length}</p>}
      </div>

      {loading && <div className="loading-spinner"></div>}

      <div className="results">
        {jogosVisiveis.map((jogo, index) => (
          <div key={index} className="jogo">
            {jogo.map((numero, i) => (
              <div key={i} className="numero">{numero}</div>
            ))}
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setPaginaAtual(1)} disabled={paginaAtual === 1}>Primeira</button>
        <button onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))} disabled={paginaAtual === 1}>Anterior</button>
        <span>Página {paginaAtual} de {totalPaginas}</span>
        <button onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaAtual === totalPaginas}>Próxima</button>
        <button onClick={() => setPaginaAtual(totalPaginas)} disabled={paginaAtual === totalPaginas}>Última</button>
        <input
          type="number"
          min="1"
          max={totalPaginas}
          onChange={(e) => setPaginaAtual(Number(e.target.value) || 1)}
          placeholder="Ir para a página"
        />
      </div>
    </div>
  );
}

export default App;
