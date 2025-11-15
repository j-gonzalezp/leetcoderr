# Configuración PWA y Optimizaciones

Este proyecto está configurado como una Progressive Web App (PWA) con tree-shaking y caché offline.

## Características Implementadas

### ✅ Tree-Shaking
- **Optimización automática de imports**: Next.js elimina código no utilizado automáticamente
- **Optimización de paquetes**: `react-katex` y `katex` están optimizados para importaciones específicas
- **Eliminación de console.logs**: En producción, todos los `console.log` se eliminan automáticamente

### ✅ PWA (Progressive Web App)
- **Service Worker**: Caché automático de recursos para funcionar offline
- **Manifest.json**: Configuración para instalación como app
- **Iconos**: Iconos generados automáticamente (192x192 y 512x512)
- **Caché agresivo**: Navegación entre páginas se cachea automáticamente

### ✅ Static Generation
- Todas las páginas se generan estáticamente en tiempo de build
- Mejor rendimiento y caché del navegador
- Funciona completamente offline después de la primera carga

## Cómo Usar

### Desarrollo
```bash
npm run dev
```

### Producción (Build)
```bash
npm run build
npm start
```

### Instalación como PWA

1. **En Chrome/Edge (Desktop)**:
   - Abre la aplicación en el navegador
   - Haz clic en el icono de instalación en la barra de direcciones
   - O ve a Menú > Instalar aplicación

2. **En Chrome (Android)**:
   - Abre la aplicación
   - Menú > "Agregar a pantalla de inicio"

3. **En Safari (iOS)**:
   - Abre la aplicación
   - Compartir > "Agregar a pantalla de inicio"

## Estrategia de Caché

La aplicación usa diferentes estrategias de caché según el tipo de recurso:

- **Páginas HTML**: NetworkFirst (intenta red, luego caché)
- **JavaScript/CSS**: StaleWhileRevalidate (caché primero, actualiza en background)
- **Imágenes**: StaleWhileRevalidate (30 días)
- **Fuentes**: CacheFirst (1 año)
- **Datos JSON**: NetworkFirst (24 horas)

## Archivos Generados

Después de `npm run build`, se generan automáticamente:
- `/public/sw.js` - Service Worker
- `/public/workbox-*.js` - Workbox runtime
- `/public/worker-*.js` - Workers adicionales

Estos archivos están en `.gitignore` y se regeneran en cada build.

## Personalización

### Cambiar Iconos
1. Reemplaza `/public/icon-192x192.png` y `/public/icon-512x512.png`
2. O ejecuta: `node scripts/generate-icons.js` para regenerar desde SVG

### Modificar Caché
Edita `next.config.ts` en la sección `workboxOptions.runtimeCaching`

### Desactivar PWA en Desarrollo
El PWA solo se activa en producción. En desarrollo, funciona como una app normal.

## Verificación

Para verificar que la PWA funciona:

1. Abre DevTools > Application > Service Workers
2. Deberías ver el service worker registrado
3. Ve a Application > Manifest para ver la configuración
4. Prueba el modo offline: DevTools > Network > Offline

## Notas

- La primera carga requiere conexión a internet
- Después de la primera carga, la app funciona completamente offline
- Los cambios en `problems.json` requieren un nuevo build para actualizarse
- El service worker se actualiza automáticamente cuando hay cambios

