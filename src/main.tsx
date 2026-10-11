import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { inisialisasiTema } from './services/theme';

// Inisialisasi tema (light/dark/system) seawal mungkin
inisialisasiTema();

createRoot(document.getElementById('root')!).render(<App />);
