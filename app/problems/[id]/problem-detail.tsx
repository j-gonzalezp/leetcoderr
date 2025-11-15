"use client";
import { useState, useEffect } from 'react';
import { Problem, Solution } from '@/types';
import { LatexText } from '@/app/components/LatexText';

function SolutionView({ solution }: { solution: Solution }) {
    return (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '15px' }}>
            <h3 style={{ marginBottom: '10px' }}>{solution.title}</h3>
            <p style={{ marginBottom: '10px', fontStyle: 'italic' }}>
                <LatexText text={solution.explanation} />
            </p>
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
            {solution.complexity && (
                <p style={{ marginTop: '10px', marginBottom: '10px', fontWeight: 'bold' }}>
                    Complejidad: <LatexText text={solution.complexity} />
                </p>
            )}
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
    
    // Funciones de navegación entre problemas
    const currentProblemIndex = problemsList.findIndex(p => p.id === problem.id);
    const hasPreviousProblem = currentProblemIndex > 0;
    const hasNextProblem = currentProblemIndex < problemsList.length - 1;
    
    const goToPreviousProblem = () => {
        if (hasPreviousProblem) {
            window.location.href = `/problems/${problemsList[currentProblemIndex - 1].id}`;
        }
    };
    
    const goToNextProblem = () => {
        if (hasNextProblem) {
            window.location.href = `/problems/${problemsList[currentProblemIndex + 1].id}`;
        }
    };
    
    // Atajos de teclado para navegar entre problemas
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Solo si no estamos escribiendo en un input/textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            
            if (e.key === 'ArrowLeft' && hasPreviousProblem) {
                e.preventDefault();
                window.location.href = `/problems/${problemsList[currentProblemIndex - 1].id}`;
            } else if (e.key === 'ArrowRight' && hasNextProblem) {
                e.preventDefault();
                window.location.href = `/problems/${problemsList[currentProblemIndex + 1].id}`;
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentProblemIndex, hasPreviousProblem, hasNextProblem, problemsList]);

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
                <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>
                    <LatexText text={problem.description} />
                </p>

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
                
                {/* Navigation Buttons - Navegación entre problemas */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '30px',
                    gap: '10px'
                }}>
                    <button
                        onClick={goToPreviousProblem}
                        disabled={!hasPreviousProblem}
                        style={{
                            padding: '10px 20px',
                            border: '1px solid #ccc',
                            backgroundColor: hasPreviousProblem ? 'white' : '#f0f0f0',
                            color: hasPreviousProblem ? 'black' : '#999',
                            cursor: hasPreviousProblem ? 'pointer' : 'not-allowed',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            flex: '1',
                            maxWidth: '200px'
                        }}
                    >
                        ← Problema Anterior
                    </button>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        Problema {currentProblemIndex + 1} de {problemsList.length}
                    </div>
                    <button
                        onClick={goToNextProblem}
                        disabled={!hasNextProblem}
                        style={{
                            padding: '10px 20px',
                            border: '1px solid #ccc',
                            backgroundColor: hasNextProblem ? 'white' : '#f0f0f0',
                            color: hasNextProblem ? 'black' : '#999',
                            cursor: hasNextProblem ? 'pointer' : 'not-allowed',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            flex: '1',
                            maxWidth: '200px'
                        }}
                    >
                        Problema Siguiente →
                    </button>
                </div>

                <div style={{ marginTop: '30px' }}>
                    <a href="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>← Volver al índice</a>
                </div>
            </main>
        </div>
    );
}
