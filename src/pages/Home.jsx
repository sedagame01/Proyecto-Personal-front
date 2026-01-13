import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import destinosApi from '../api/connect';
import MyMap from './Map';

import './Home.css';

const PROVINCE_COORDS = {
    "A Coruña": [43.3713, -8.3960], "Álava": [42.8500, -2.6729], "Albacete": [38.9954, -1.8557],
    "Alicante": [38.3452, -0.4810], "Almería": [36.8402, -2.4680], "Asturias": [43.3619, -5.8494],
    "Ávila": [40.6567, -4.6810], "Badajoz": [38.8794, -6.9706], "Baleares": [39.5696, 2.6502],
    "Barcelona": [41.3851, 2.1734], "Burgos": [42.3439, -3.6969], "Cáceres": [39.4752, -6.3724],
    "Cádiz": [36.5298, -6.2927], "Cantabria": [43.4628, -3.8050], "Castellón": [39.9864, -0.0513],
    "Ceuta": [35.8894, -5.3213], "Ciudad Real": [38.9861, -3.9273], "Córdoba": [37.8882, -4.7794],
    "Cuenca": [40.0704, -2.1374], "Girona": [41.9794, 2.8214], "Granada": [37.1773, -3.5986],
    "Guadalajara": [40.6286, -3.1618], "Guipúzcoa": [43.3204, -1.9845], "Huelva": [37.2614, -6.9447],
    "Huesca": [42.1401, -0.4089], "Jaén": [37.7796, -3.7849], "La Rioja": [42.4650, -2.4458],
    "Las Palmas": [28.1235, -15.4366], "León": [42.5987, -5.5671], "Lleida": [41.6142, 0.6258],
    "Lugo": [43.0097, -7.5569], "Madrid": [40.4168, -3.7038], "Málaga": [36.7213, -4.4216],
    "Melilla": [35.2923, -2.9381], "Murcia": [37.9922, -1.1307], "Navarra": [42.8125, -1.6458],
    "Ourense": [42.3350, -7.8636], "Palencia": [42.0096, -4.5291], "Pontevedra": [42.4336, -8.6481],
    "Salamanca": [40.9640, -5.6630], "Santa Cruz de Tenerife": [28.4636, -16.2518],
    "Segovia": [40.9429, -4.1088], "Sevilla": [37.3891, -5.9845], "Soria": [41.7665, -2.4793],
    "Tarragona": [41.1189, 1.2445], "Teruel": [40.3441, -1.1069], "Toledo": [39.8628, -4.0273],
    "Valencia": [39.4699, -0.3763], "Valladolid": [41.6523, -4.7245], "Vizcaya": [43.2630, -2.9350],
    "Zamora": [41.5037, -5.7438], "Zaragoza": [41.6488, -0.8891]
};

export const Home = () => {
    const [destinosDestacados, setDestinosDestacados] = useState([]);
    const [topUsuarios, setTopUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('destinos');
    const [searchResults, setSearchResults] = useState(null); 
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            const { data: destinosData } = await destinosApi.get('/user/destinos/destacados');
            const { data: usuariosData } = await destinosApi.get('/user/usuarios/top');
            const list = destinosData.data || [];
            setDestinosDestacados(list);
            setTopUsuarios(usuariosData.data || []);
            generateAndSetMarkers(list);
        } catch (error) {
            console.error("Error cargando home:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateAndSetMarkers = useCallback((list) => {
        const newMarkers = list.map(d => {
            if (!d.province || !PROVINCE_COORDS[d.province]) return null;
            const offset = (parseInt(d.id) % 10) / 100; 
            return {
                id: d.id,
                name: d.name,
                province: d.province,
                position: [
                    PROVINCE_COORDS[d.province][0] + (offset - 0.05),
                    PROVINCE_COORDS[d.province][1] + (offset - 0.05)
                ]
            };
        }).filter(Boolean);
        setMarkers(newMarkers);
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            setSearchResults(null);
            generateAndSetMarkers(destinosDestacados);
            return;
        }

        try {
            if (searchType === 'destinos') {
                // BÚSQUEDA DE DESTINOS
                const { data } = await destinosApi.get('/user/destinos');
                const lista = data.data || [];
                const filtrados = lista.filter(d => 
                    d.name?.toLowerCase().includes(term) || 
                    d.province?.toLowerCase().includes(term)
                );
                setSearchResults(filtrados);
                generateAndSetMarkers(filtrados);
            } else {
               
                const { data } = await destinosApi.get('/user/usuarios/top'); 
                const listaUsers = data.data || [];

                const filtrados = listaUsers.filter(u => 
                    u.username?.toLowerCase().includes(term)
                );

                setSearchResults(filtrados);
                setMarkers([]); 
            }

            
            setSearchTerm('');

        } catch (error) {
            console.error("Error en la búsqueda:", error);
            setSearchResults([]); 
        }
    };
    if (loading) return <div className="loading-screen">Cargando...</div>;

    const displayList = searchResults !== null ? searchResults : destinosDestacados;

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h3>🏆 Top Viajeros</h3>
                </div>
                <div className="sidebar-list">
                    {topUsuarios.map((u, i) => (
                        <Link to={`/usuario/${u.id}`} key={u.id} className="sidebar-link">
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

            <main className="dashboard-main">
                <section className="hero-banner">
                    <div className="hero-content">
                        <h1>Encuentra tu paraíso</h1>
                        <form className="hero-search-bar" onSubmit={handleSearch}>
                            <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
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

                <section className="content-area">
                    {/* El mapa ahora usa la clase CSS para ocultarse o mostrarse */}
                    <div className={`map-container ${searchType === 'destinos' ? 'visible' : 'hidden'}`}>
                        <MyMap markers={markers} />
                    </div>

                    <h2 className="section-title">
                        {searchResults ? `🔍 Resultados (${searchResults.length})` : " Destinos Destacados"}
                    </h2>

                    <div className="cards-grid">
    {displayList.map(item => (
        <Link 
            to={item.name ? `/destino/${item.id}` : `/usuario/${item.id}`}
            key={item.id}
            className="card-link"
        >
            <div className="card-item">
                {/* SI TIENE NAME ES UN DESTINO */}
                {item.name ? (
                    <>
                        <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} />
                        <div className="card-body">
                            <h3>{item.name}</h3>
                            <p>{item.province}</p>
                        </div>
                    </>
                ) : (
                    /* SI NO TIENE NAME (TIENE USERNAME) ES UN USUARIO */
                    <div className="user-card-content">
                        <div className="rank-badge-large">
                            {item.username ? item.username[0].toUpperCase() : '?'}
                        </div>
                        <h3>{item.username}</h3>
                        <p>Puntos: {item.puntuaciontotal || 0}</p>
                        <p className="role-tag">{item.role || 'Viajero'}</p>
                    </div>
                )}
            </div>
        </Link>
    ))}
</div>
                </section>
            </main>
        </div>
    );
};