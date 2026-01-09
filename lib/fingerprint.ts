// Browser Fingerprinting Library
// Genereert een unieke fingerprint gebaseerd op browser eigenschappen

export interface FingerprintData {
  fingerprint: string;
  components: {
    userAgent: string;
    language: string;
    colorDepth: number;
    screenResolution: string;
    timezone: string;
    sessionStorage: boolean;
    localStorage: boolean;
    platform: string;
    cpuClass: string | undefined;
    hardwareConcurrency: number;
    deviceMemory: number | undefined;
    canvas: string;
    webgl: string;
    fonts: string;
  };
}

// Simple hash function
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to positive hex string
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// Get canvas fingerprint
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    
    canvas.width = 200;
    canvas.height = 50;
    
    // Draw text with specific styling
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Coomer FP', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Coomer FP', 4, 17);
    
    return hashString(canvas.toDataURL());
  } catch (e) {
    return 'canvas-error';
  }
}

// Get WebGL fingerprint
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'no-webgl';
    
    const glContext = gl as WebGLRenderingContext;
    const debugInfo = glContext.getExtension('WEBGL_debug_renderer_info');
    
    if (debugInfo) {
      const vendor = glContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = glContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return hashString(`${vendor}~${renderer}`);
    }
    
    return 'webgl-no-debug';
  } catch (e) {
    return 'webgl-error';
  }
}

// Get installed fonts (simplified)
function getFontsFingerprint(): string {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia',
    'Impact', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Helvetica',
    'Palatino', 'Garamond', 'Bookman', 'Tahoma', 'Lucida Console'
  ];
  
  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';
  const detected: string[] = [];
  
  try {
    const span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.left = '-9999px';
    span.style.fontSize = testSize;
    span.innerHTML = testString;
    document.body.appendChild(span);
    
    const baseWidths: { [key: string]: number } = {};
    for (const baseFont of baseFonts) {
      span.style.fontFamily = baseFont;
      baseWidths[baseFont] = span.offsetWidth;
    }
    
    for (const font of testFonts) {
      for (const baseFont of baseFonts) {
        span.style.fontFamily = `'${font}', ${baseFont}`;
        if (span.offsetWidth !== baseWidths[baseFont]) {
          detected.push(font);
          break;
        }
      }
    }
    
    document.body.removeChild(span);
  } catch (e) {
    return 'fonts-error';
  }
  
  return hashString(detected.join(','));
}

// Main fingerprint generation function
export async function generateFingerprint(): Promise<FingerprintData> {
  const components = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    colorDepth: screen.colorDepth,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    sessionStorage: !!window.sessionStorage,
    localStorage: !!window.localStorage,
    platform: navigator.platform,
    cpuClass: (navigator as any).cpuClass,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory,
    canvas: getCanvasFingerprint(),
    webgl: getWebGLFingerprint(),
    fonts: getFontsFingerprint(),
  };
  
  // Create fingerprint string from all components
  const fingerprintString = [
    components.userAgent,
    components.language,
    components.colorDepth,
    components.screenResolution,
    components.timezone,
    components.platform,
    components.hardwareConcurrency,
    components.deviceMemory || 0,
    components.canvas,
    components.webgl,
    components.fonts,
  ].join('|||');
  
  // Generate final fingerprint hash
  const fingerprint = hashString(fingerprintString) + hashString(fingerprintString.split('').reverse().join(''));
  
  return {
    fingerprint,
    components,
  };
}

// Get stored fingerprint or generate new one
export async function getOrCreateFingerprint(): Promise<string> {
  // Check if we have a stored fingerprint
  const stored = localStorage.getItem('device_fp');
  if (stored) {
    return stored;
  }
  
  // Generate new fingerprint
  const data = await generateFingerprint();
  localStorage.setItem('device_fp', data.fingerprint);
  
  return data.fingerprint;
}
