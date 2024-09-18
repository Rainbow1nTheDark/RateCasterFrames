"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";

interface LeaderboardUser {
    fid: string;
    total_score: number;
  }

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const fetchData = async () => {
      const page = parseInt(searchParams?.get("page") || "1", 10);
      const search = searchParams?.get("search") || "";
      const res = await fetch(`/api/leaderboard?page=${page}&search=${search}`);
      const data = await res.json();
      setLeaderboard(data.leaderboard);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    };

    fetchData();
  }, [searchParams]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("search", search);
    params.set("page", "1");
    window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
  };
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", newPage.toString());
    window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
  };

  return (
    <>
      <Head>
        <title>Leaderboard</title>
        <meta name="description" content="View the leaderboard" />
        <meta name="fc:frame" content="Leaderboard Frame" />
        <meta name="fc:frame:image" content="/path/to/your/image.jpg" />
        <meta property="og:image" content="/path/to/your/image.jpg" />
      </Head>
      <div style={{
        color: 'white',
        backgroundColor: '#7e5bc2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        height: '100%',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        textAlign: 'center',
        width: '100%',
      }}>
        <h1 style={{
          color: '#FFD700',
          marginBottom: '15px',
          fontSize: '2em',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>Leaderboard</h1>

        <input
          type="text"
          name="search"
          placeholder="Search by FID"
          defaultValue={searchParams?.get("search") ?? ""}
          onChange={handleSearch}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginBottom: '20px',
          }}
        />

        <hr style={{
          width: '80%',
          borderColor: 'rgba(255,255,255,0.5)',
          marginBottom: '10px',
          opacity: 0.5
        }} />

        <div style={{
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'left',
        }}>
          {leaderboard.map((user, index) => (
            <div key={user.fid} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
            }}>
              <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{index + 1 + (currentPage - 1) * 10}. {user.fid}</span>
              <span style={{ color: '#ADD8E6' }}>{user.total_score}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                padding: '10px 20px',
                borderRadius: '5px',
                backgroundColor: page === currentPage ? '#FFD700' : '#7e5bc2',
                color: page === currentPage ? '#7e5bc2' : '#FFD700',
                border: 'none',
                cursor: 'pointer',
                margin: '0 5px',
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}