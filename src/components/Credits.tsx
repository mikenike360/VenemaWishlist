import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

type Credit = {
  file: string;
  title: string;
  creator: string;
  id: string;
  licence: string;
  url: string;
  requiresAttribution: boolean;
  note: string;
};

const Credits: React.FC = () => {
  const [rows, setRows] = useState<Credit[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/models/credits.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load credits (${response.status})`);
        return response.json();
      })
      .then((data: Credit[]) => {
        if (!cancelled) setRows(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const required = rows.filter((row) => row.requiresAttribution);

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <p className="mb-2 text-sm">
          <Link to="/" className="link link-primary">
            Back to the tree
          </Link>
        </p>
        <h1 className="mb-2 text-3xl font-bold">Credits</h1>
        <p className="mb-8 text-base-content/80">
          3D models come from{' '}
          <a href="https://poly.pizza" className="link link-primary" target="_blank" rel="noopener noreferrer">
            Poly Pizza
          </a>
          . CC-BY assets require the attribution below.
        </p>

        {error && <p className="mb-6 text-error">{error}</p>}

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Attribution required</h2>
          {rows.length === 0 && !error ? (
            <p className="text-base-content/70">Loading…</p>
          ) : required.length === 0 ? (
            <p className="text-base-content/70">None right now. Every model in use is CC0.</p>
          ) : (
            <ul className="space-y-3">
              {required.map((row) => (
                <li key={row.id} className="rounded-lg border border-base-300 bg-base-200 px-4 py-3">
                  <p className="font-medium">
                    &quot;{row.title}&quot; by {row.creator}{' '}
                    <a href={row.url} className="link link-primary" target="_blank" rel="noopener noreferrer">
                      ({row.url.replace('https://', '')})
                    </a>{' '}
                    {row.licence}
                  </p>
                  <p className="mt-1 text-sm text-base-content/70">{row.note}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">All models</h2>
          <ul className="space-y-2 text-sm">
            {rows.map((row) => (
              <li key={row.file}>
                <code className="text-xs">{row.file}</code>
                {' — '}
                &quot;{row.title}&quot; by {row.creator}{' '}
                <a href={row.url} className="link link-primary" target="_blank" rel="noopener noreferrer">
                  ({row.id})
                </a>{' '}
                {row.licence}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Credits;
