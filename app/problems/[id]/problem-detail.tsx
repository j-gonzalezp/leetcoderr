"use client";
import { useState } from 'react';
import { Problem } from '@/types';

function SolutionView({ solution }: { solution: Problem['solutions'][0] }) {
    return (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '15px' }}>
            <h3 style={{ marginBottom: '10px' }}>{solution.title}</h3>
            <p style={{ marginBottom: '10px', fontStyle: 'italic' }}>{solution.explanation}</p>
            <h4 style={{ marginBottom: '5px' }}>Código:</h4>
            <pre style={{
                backgroundColor: '#f9f9f9',
                padding: '10px',
                border: '1px solid #ccc',
                fontFamily: 'monospace',
                fontSize: '14px',
                overflow: 'auto'
            }}>
                <code>{solution.code_snippet}</code>
            </pre>
            <h4 style={{ marginTop: '15px', marginBottom: '5px' }}>Ejemplo:</h4>
            <pre style={{
                backgroundColor: '#f9f9f9',
                padding: '10px',
                border: '1px solid #ccc',
                fontFamily: 'monospace',
                fontSize: '14px'
            }}>
                {solution.example}
            </pre>
        </div>
    );
}

export default function ProblemDetail({ problem, problemsList }: { problem: Problem, problemsList: {id: string, title: string}[] }) {
    const [selectedSolutionId, setSelectedSolutionId] = useState(1);
    const currentSolution = problem.solutions.find(s => s.id === selectedSolutionId);

    return (
        <div style={{ fontFamily: 'serif', backgroundColor: 'white', color: 'black', minHeight: '100vh', padding: '20px' }}>
            <main style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Problem Selector */}
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="problem-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Seleccionar Problema:
                    </label>
                    <select
                        id="problem-select"
                        value={problem.id}
                        onChange={(e) => {
                            if (e.target.value) {
                                window.location.href = `/problems/${e.target.value}`;
                            }
                        }}
                        style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc' }}
                    >
                        <option value="">Seleccionar Problema</option>
                        {problemsList.map((p: { id: string; title: string }) => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>
                </div>

                <h1 style={{ fontSize: '1.8em', marginBottom: '10px' }}>{problem.title}</h1>
                <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Dificultad: {problem.difficulty}</p>
                <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>{problem.description}</p>

                {/* Solution Selector */}
                <nav style={{ marginBottom: '20px' }}>
                    <h2 style={{ marginBottom: '10px' }}>Soluciones:</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {problem.solutions.map(sol => (
                            <button
                                key={sol.id}
                                onClick={() => setSelectedSolutionId(sol.id)}
                                style={{
                                    padding: '8px 12px',
                                    border: selectedSolutionId === sol.id ? '2px solid black' : '1px solid #ccc',
                                    backgroundColor: selectedSolutionId === sol.id ? '#e0e0e0' : 'white',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                {sol.title}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Display Current Solution */}
                {currentSolution && <SolutionView solution={currentSolution} />}

                <div style={{ marginTop: '30px' }}>
                    <a href="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>← Volver al índice</a>
                </div>
            </main>
        </div>
    );
}
