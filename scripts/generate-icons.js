// Script para generar iconos PWA básicos
// Ejecutar: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Crear un SVG simple
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#000000" rx="64"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="180" font-weight="bold" fill="#ffffff" text-anchor="middle">LC</text>
</svg>`;

// Guardar SVG
fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSvg);

// Intentar generar PNGs con sharp si está disponible
try {
  const sharp = require('sharp');
  
  const generateIcon = async (size) => {
    const buffer = await sharp(Buffer.from(iconSvg))
      .resize(size, size)
      .png()
      .toBuffer();
    
    fs.writeFileSync(path.join(publicDir, `icon-${size}x${size}.png`), buffer);
    console.log(`✅ Icono ${size}x${size} generado`);
  };
  
  (async () => {
    await generateIcon(192);
    await generateIcon(512);
    console.log('✅ Todos los iconos generados exitosamente');
  })();
} catch (error) {
  console.log('⚠️  Sharp no disponible. Generando placeholders...');
  console.log('   Puedes convertir icon.svg a PNG usando un convertidor online');
  console.log('   o instalar sharp: npm install --save-dev sharp');
  
  // Crear placeholders vacíos (el usuario puede reemplazarlos después)
  const createPlaceholder = (size) => {
    // Crear un PNG mínimo válido (1x1 pixel transparente)
    // En producción, el usuario debería reemplazar estos con iconos reales
    const placeholder = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, size & 0xFF, (size >> 8) & 0xFF, 0x00, 0x00, // width
      0x00, 0x00, 0x00, size & 0xFF, (size >> 8) & 0xFF, 0x00, 0x00, // height
      0x08, 0x06, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
    ]);
    fs.writeFileSync(path.join(publicDir, `icon-${size}x${size}.png`), placeholder);
  };
  
  createPlaceholder(192);
  createPlaceholder(512);
  console.log('✅ Placeholders creados (reemplázalos con iconos reales)');
}

