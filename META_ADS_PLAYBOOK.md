# 🎯 MILLION WOOD - MANUAL MAESTRO DE META ADS Y RETARGETING

**Para:** Equipo Creativo, Media Buyers y Estrategas de Marketing.
**Objetivo:** Dejar de hacer publicidad genérica y comenzar a usar "Ataques Quirúrgicos" basados en el comportamiento real del usuario dentro de la plataforma de Million Wood.

---

## 1. LA TECNOLOGÍA: ¿Qué "Minas de Oro" hemos plantado?
La página web actual no es un simple folleto. Es un radar inteligente. Hemos instalado disparadores (Eventos de Meta Pixel) que detectan **micro-interacciones**. El equipo debe usar esta data para mostrar el anuncio correcto, a la persona correcta, en el momento exacto.

Aquí están los eventos que ya están funcionando y enviando datos a Meta:

### 🟢 Nivel 1: Curiosos (Calentamiento)
*   **`PageView`**: El usuario entró a la página.
*   **`TimeOnSite_60s`**: El usuario permaneció más de 1 minuto leyendo. (Filtra a los bots y clics accidentales).
*   **`ScrollDepth_75`**: El usuario bajó hasta el 75% de la página. Está consumiendo la información activamente.

### 🟡 Nivel 2: Interés Específico (Segmentación)
*   **`ViewService`**: Se dispara cuando hacen clic en un servicio. *Ojo: Envía a Facebook el nombre exacto (ej. "CNC Services", "Kitchen Cabinets").*
*   **`ViewPortfolio`**: Se dispara cuando el usuario detiene su mouse/dedo sobre una foto de la galería de proyectos.

### 🟠 Nivel 3: Alta Intención (Casi Compradores)
*   **`ConfiguratorStarted`**: Se dispara en el segundo que el usuario empieza a usar el "Estudio Interactivo" (cambia medidas o agrega piezas).
*   **`ViewMaterial`**: Se dispara si en el configurador seleccionan materiales premium (ej. Lioher).
*   **`ExitIntentTriggered`**: Se dispara cuando el sistema detecta que el usuario va a cerrar la pestaña y le lanza el popup del "Golden Ticket".

### 🔴 Nivel 4: Conversión y Oportunidades Críticas
*   **`UnlockedDiscount`**: ¡Atención! El usuario raspó la tarjeta dorada y **obtuvo un código de descuento válido por 2 horas.**
*   **`ExpiredDiscount`**: ¡Alerta! Pasaron las 2 horas y el código se autodestruyó sin ser usado.
*   **`StartedForm`**: Tocaron el formulario de contacto para escribir, pero no sabemos si lo enviaron.
*   **`Lead` / `Contact` / `ConfiguratorCompleted`**: ÉXITO. El usuario envió sus datos por formulario, cotización o WhatsApp.

---

## 2. FRENTES DE ATAQUE: Estrategias para el Equipo Creativo

Con base en esos eventos, el equipo creativo y de pauta debe construir las siguientes campañas (Retargeting):

### ⚔️ FRENTE 1: La Segunda Oportunidad del "Golden Ticket" (URGENCIA)
*   **A quién apuntar:** Personas que dispararon `ExpiredDiscount` (El descuento expiró).
*   **Ángulo Creativo:** "Sabemos que diseñar tu hogar toma tiempo y por eso tu Golden Ticket expiró. Como excepción, hemos reactivado tu código por 24 horas más. No dejes pasar este 10% de descuento en tu proyecto de carpintería premium."
*   **Formato sugerido:** Un video rápido o imagen del ticket dorado rompiéndose y reparándose.

### ⚔️ FRENTE 2: El Diseñador Inconcluso (CARRITO ABANDONADO)
*   **A quién apuntar:** Personas que dispararon `ConfiguratorStarted` pero **EXCLUYENDO** a los que dispararon `ConfiguratorCompleted` o `Lead`.
*   **Ángulo Creativo:** "Vimos que empezaste a diseñar tu clóset/cocina en nuestro estudio interactivo. ¿Te quedaste con dudas? Nuestro equipo de expertos está listo para ayudarte a terminar el diseño en 3D sin costo. Haz clic aquí."
*   **Formato sugerido:** Grabación de pantalla (screencast) mostrando lo fácil que es usar el configurador web.

### ⚔️ FRENTE 3: Ataque Quirúrgico de Servicios (SÚPER SEGMENTADO)
*   **A quién apuntar:** Públicos creados a partir del evento `ViewService` filtrados por el parámetro `service_name`.
*   **Ángulo Creativo:** Si vieron "CNC Services", muéstrales un video ASMR de la máquina cortando madera. Si vieron "Kitchen Cabinets", muéstrales un video de transformación (Antes/Después) de cocinas de lujo.
*   **Formato sugerido:** Videos cortos de alta calidad (Reels/TikTok style) enfocados 100% en ese servicio.

### ⚔️ FRENTE 4: La Barrera de Confianza (PRUEBA SOCIAL)
*   **A quién apuntar:** Personas que dispararon `ScrollDepth_75` o `TimeOnSite_60s` pero **EXCLUYENDO** a los `Lead`. (Gente que leyó mucho pero no se animó).
*   **Ángulo Creativo:** No les vendas el producto, véndeles la confianza. "Conoce por qué las casas más exclusivas de Miami eligen a Million Wood."
*   **Formato sugerido:** Testimonios en video de clientes reales (UGC) o un carrusel de proyectos finalizados resaltando la puntualidad y la limpieza del trabajo.

### ⚔️ FRENTE 5: El Empujón del Formulario (FRICCIÓN)
*   **A quién apuntar:** `StartedForm` **EXCLUYENDO** `Lead`. (Gente que se arrepintió de escribir).
*   **Ángulo Creativo:** "¿Odias llenar formularios? Toca aquí y habla directamente con uno de nuestros maestros ebanistas por WhatsApp en 10 segundos."
*   **Formato sugerido:** Anuncio con botón de WhatsApp (Clic to WhatsApp).

---

## 3. INSTRUCCIONES PARA EL MEDIA BUYER (Configuración en Meta)

Para ejecutar esto, el Media Buyer debe ir al **Administrador de Eventos de Meta** y:
1.  **Verificar:** Asegurarse de que los eventos personalizados (Custom Events) estén llegando.
2.  **Crear Públicos Personalizados (Custom Audiences):** Ir a la sección de "Públicos", seleccionar "Sitio Web", elegir el Pixel, y crear un público para cada evento mencionado arriba (Retención de 7, 14 y 30 días según el presupuesto).
3.  **Conversiones Personalizadas (Custom Conversions):** Para optimizar campañas hacia compras de servicios específicos, crear Conversiones Personalizadas basándose en el evento `ViewService` donde la URL o el parámetro contenga la palabra clave del servicio.

**¡A DOMINAR EL MERCADO!** 🚀
