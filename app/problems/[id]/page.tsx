import { notFound } from 'next/navigation';
import { Problem } from '@/types';
import problemsData from '@/data/problems.json';
import ProblemDetail from './problem-detail';

interface ProblemPageProps {
    params: Promise<{ id: string }>; // Ahora es Promise
}

async function ProblemPage({ params }: ProblemPageProps) {
    const { id } = await params; // Desempaquetamos la Promise
    
    const problem = (problemsData as Problem[]).find((p: Problem) => p.id === id);

    if (!problem) {
        notFound();
    }

    const problemsList = (problemsData as Problem[]).map((p: Problem) => ({ 
        id: p.id, 
        title: p.title 
    }));

    return <ProblemDetail problem={problem} problemsList={problemsList} />;
}

export default ProblemPage;

// Static Generation
export function generateStaticParams() {
    return (problemsData as Problem[]).map(problem => ({
        id: problem.id,
    }));
}