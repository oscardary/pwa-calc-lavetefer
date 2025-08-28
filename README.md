
<div align="center">

# 🐾 PWA Calc Lavetefer

![Status](https://img.shields.io/badge/status-en%20desarrollo-yellow)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06b6d4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-integrado-3fcf8e?logo=supabase)
![License](https://img.shields.io/badge/license-MIT-green)

> **PWA Calc Lavetefer** es una **Progressive Web App** desarrollada con **React, TypeScript, Vite y TailwindCSS** para gestionar medicamentos veterinarios, calcular dosis, crear listas personalizadas y sincronizar datos entre dispositivos gracias a **Supabase**.

[**📱 Probar demo en vivo**](#) _(pendiente de despliegue)_

</div>

---

## 🚀 **Características principales**

- 📱 **PWA**: Instalación en móviles y soporte offline.
- 🧮 **Calculadora de dosis**: Determina la cantidad exacta de medicamento según el peso.
- 💊 **Gestión de medicamentos**: Crear, editar y eliminar medicamentos personalizados.
- 🔄 **Sincronización**: Integración con **Supabase** para mantener datos en varios dispositivos.
- 📦 **IndexedDB offline**: Persistencia de datos cuando no hay conexión.
- 🎨 **UI minimalista y responsiva**: Desarrollada con **TailwindCSS**.

---

## 🛠️ **Tecnologías utilizadas**

| Tecnología      | Uso principal                                   |
|---------------|-------------------------------------------------|
| **Vite**      | Bundler ultrarrápido para React                  |
| **React**     | Construcción de la interfaz de usuario           |
| **TypeScript**| Tipado estático para un desarrollo más seguro    |
| **TailwindCSS** | Estilos modernos, responsive y minimalistas    |
| **Supabase**  | Autenticación y sincronización de datos online   |
| **IndexedDB** | Almacenamiento local para funcionamiento offline |

---

## 📂 **Estructura del proyecto**

\`\`\`
pwa-calc-lavetefer/
├── public/                # Archivos estáticos (íconos, manifest, etc.)
├── src/
│   ├── components/        # Componentes reutilizables
│   ├── hooks/             # Hooks personalizados
│   ├── pages/             # Vistas principales de la app
│   ├── services/          # Repositorios y acceso a datos
│   ├── types/             # Definiciones de tipos e interfaces TS
│   ├── utils/             # Funciones y helpers
│   └── main.tsx           # Punto de entrada principal
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
\`\`\`

---

## ⚡ **Instalación y configuración**

### **1. Clonar el repositorio**
\`\`\`bash
git clone https://github.com/oscardary/pwa-calc-lavetefer.git
cd pwa-calc-lavetefer
\`\`\`

### **2. Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

### **3. Variables de entorno**
Crea un archivo \`.env\` en la raíz del proyecto:

\`\`\`env
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-api-key
\`\`\`

### **4. Ejecutar en modo desarrollo**
\`\`\`bash
npm run dev
\`\`\`
Accede en el navegador:  
[http://localhost:5173](http://localhost:5173)

### **5. Generar build de producción**
\`\`\`bash
npm run build
\`\`\`
Los archivos listos se generan en \`dist/\`.

---

## 🧩 **Funcionalidades futuras**

- [ ] Autenticación completa de usuarios con Supabase.
- [ ] Soporte para múltiples listas de medicamentos por usuario.
- [ ] Sincronización inteligente online/offline.
- [ ] Exportar e importar medicamentos en CSV o JSON.
- [ ] Dashboard con estadísticas y gráficos interactivos.

---

## 📸 **Capturas de pantalla**

> *(Agrega aquí imágenes de la app cuando estén listas)*

| Pantalla principal 
| Detalle de medicamento 
| Cálculo de dosis

---

## 📄 **Licencia**

Este proyecto está bajo la licencia [MIT](./LICENSE).  
Puedes usarlo, modificarlo y distribuirlo libremente, dando crédito al autor original.

---

## 👨‍💻 **Autor**

**Oscar RL** 