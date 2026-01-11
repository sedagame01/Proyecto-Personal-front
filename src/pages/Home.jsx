import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import destinosApi from '../api/connect';
import './Home.css';

export const Home = () => {
    // Estados de datos
    const [destinosDestacados, setDestinosDestacados] = useState([]);
    const [topUsuarios, setTopUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados de búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('destinos'); // 'destinos' o 'users'
    const [searchResults, setSearchResults] = useState(null); // null = no buscando

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            const { data: destinosData } = await destinosApi.get('/user/destinos/destacados');
            const { data: usuariosData } = await destinosApi.get('/user/usuarios/top');
            
            setDestinosDestacados(destinosData.data || []);
            setTopUsuarios(usuariosData.data || []);
        } catch (error) {
            console.error("Error cargando home:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        // Si el buscador está vacío, limpiamos resultados y mostramos destacados de nuevo
        if (!searchTerm.trim()) {
            setSearchResults(null);
            return;
        }

        try {
            const { data } = await destinosApi.get(`/user/buscar?q=${searchTerm}&type=${searchType}`);
            setSearchResults(data.data || []);
        } catch (error) {
            console.error("Error en búsqueda:", error);
        }
    };

    if (loading) return <div className="loading-screen">Cargando...</div>;

    return (
        <div className="dashboard-layout">
            
            {/* --- SIDEBAR IZQUIERDA (Top Usuarios) --- */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h3>🏆 Top Viajeros</h3>
                </div>
                <div className="sidebar-list">
                    {topUsuarios.map((u, i) => (
                        <Link 
                            to={`/usuario/${u.id}`} 
                            key={u.id} 
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="sidebar-item">
                                <span className="rank-badge">#{i + 1}</span>
                                <div className="item-info">
                                    <strong>{u.username}</strong>
                                    <small>{u.puntuaciontotal} pts</small>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </aside>

            {/* --- CONTENIDO PRINCIPAL (Derecha) --- */}
            <main className="dashboard-main">
                
                {/* HERO SECTION + BUSCADOR */}
                <section className="hero-banner">
                    <div className="hero-content">
                        <h1>Encuentra tu paraíso</h1>
                        <form className="hero-search-bar" onSubmit={handleSearch}>
                            <select 
                                value={searchType} 
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                <option value="destinos">Destinos</option>
                                <option value="users">Usuarios</option>
                            </select>
                            <input 
                                type="text" 
                                placeholder={searchType === 'destinos' ? "Buscar destino..." : "Buscar usuario..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit">🔍</button>
                        </form>
                    </div>
                </section>

                {/* GRID DE CONTENIDO (Resultados o Destacados) */}
                <section className="content-area">
                    {searchResults ? (
                        // MODO BÚSQUEDA
                        <>
                            <h2 className="section-title">
                                🔍 Resultados ({searchResults.length})
                            </h2>
                            <div className="cards-grid">
                                {searchResults.map(item => (
                                    <Link 
                                        to={searchType === 'destinos' ? `/destino/${item.id}` : `/usuario/${item.id}`}
                                        key={item.id}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div className="card-item">
                                            {searchType === 'destinos' ? (
                                                <>
                                                    <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} />
                                                    <div className="card-body">
                                                        <h3>{item.name}</h3>
                                                        <p>📍 {item.province}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="card-body-center">
                                                    <div className="rank-badge" style={{margin: '0 auto 10px', width: '50px', height:'50px', fontSize:'1.5rem'}}>
                                                        {item.username[0].toUpperCase()}
                                                    </div>
                                                    <h3>{item.username}</h3>
                                                    <p>Nivel: {item.role}</p>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                                {searchResults.length === 0 && <p style={{color:'white'}}>No se encontraron resultados.</p>}
                            </div>
                        </>
                    ) : (
                        // MODO DEFAULT (Destacados)
                        <>
                            <h2 className="section-title">📍 Destinos Destacados</h2>
                            <div className="cards-grid">
                                {destinosDestacados.map(d => (
                                    <Link 
                                        to={`/destino/${d.id}`} 
                                        key={d.id}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div className="card-item">
                                            <img src={d.images?.[0] || '/placeholder.jpg'} alt={d.name} />
                                            <div className="card-body">
                                                <h3>{d.name}</h3>
                                                <p>📍 {d.province}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};