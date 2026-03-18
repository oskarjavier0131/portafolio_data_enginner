# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Comandos de desarrollo

```bash
# Activar entorno virtual (Windows)
venv\Scripts\activate        # CMD
source venv/Scripts/activate # Git Bash / WSL

# Servidor de desarrollo
python manage.py runserver

# Migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario para el admin
python manage.py createsuperuser

# Colectar estáticos (necesario antes de deploy)
python manage.py collectstatic --noinput

# Verificar configuración
python manage.py check
```

---

## Arquitectura del proyecto

**Stack:** Python 3.12 / Django 5.1 / SQLite (dev) / PostgreSQL (prod en Railway)
**Frontend:** HTML + CSS + JS vanilla — sin frameworks. Diseño dark mode minimalista.

### Apps Django

| App | Responsabilidad |
|-----|----------------|
| `core` | Páginas principales (home, about, contact), modelos Service/Skill/Project/Certification/ContactMessage/SiteConfig |
| `blog` | Blog con estética Win95, modelos Post/Category/Tag con editor Summernote |

### Rutas disponibles

| URL | Vista | Nombre |
|-----|-------|--------|
| `/` | `core.views.home` | `home` |
| `/sobre-mi/` | `core.views.about` | `about` |
| `/contacto/` | `core.views.contact` | `contact` |
| `/blog/` | `blog.views.post_list` | `blog` |
| `/blog/<slug>/` | `blog.views.post_detail` | `post_detail` |

> `Service` no tiene página propia — se muestra únicamente en la sección del home.

### Modelos clave

- `SiteConfig` es un **singleton** (pk=1 fijo). Usar siempre `SiteConfig.get()`, nunca `.objects.first()`.
- `Project.is_featured` controla qué proyectos aparecen en el home (máx. 4).
- `Project.technologies` es un string CSV — usar `get_technologies_list()` para obtener la lista.
- `Certification` vive en `core/models.py`; tiene `is_expired` property que compara `expiration_date` con hoy. Se muestra en el home.
- El HTML del blog se renderiza con `{{ post.content|safe }}` (campo generado por Summernote).
- `ContactMessage` es de **solo lectura** en admin — `has_add_permission` devuelve `False`.
- `SiteConfig` en admin: no se puede añadir (si ya existe) ni eliminar.

### Context processor

`core/context_processors.py` inyecta `site_config` en todos los templates automáticamente. Usar `{{ site_config.whatsapp_number }}`, `{{ site_config.available }}`, etc. en cualquier template sin pasarlo desde la vista.

### Sistema de templates

Dos ubicaciones:

```
templates/                         # Globales (layout y componentes compartidos)
├── base.html                      # Layout dark mode: navbar + main + footer + widget WA
├── components/
│   ├── navbar.html                # Sticky top, backdrop-blur al scroll
│   ├── footer.html                # Links sociales, copyright
│   ├── cta_section.html           # Sección "Trabajemos juntos"
│   └── whatsapp_widget.html       # Botón flotante WhatsApp
└── includes/
    └── meta_tags.html             # SEO y Open Graph

core/templates/core/               # Templates de la app core
├── home.html
├── about.html
├── contact.html
└── services.html                  # (sin URL propia, referenciado solo desde home)

blog/templates/blog/               # Templates de la app blog (estética Win95)
├── post_list.html                 # Estilo explorador de archivos Win95
└── post_detail.html               # Estilo Notepad Win95
```

### CSS organizado por responsabilidad

```
static/css/
├── base.css        # Variables CSS, reset, tipografía global
├── layout.css      # Contenedores, grid, spacing, secciones
├── components.css  # Navbar, cards, buttons, badge, footer, inputs
├── animations.css  # Scroll reveal, hover transitions, badge pulse
└── responsive.css  # Breakpoints: mobile ≤768px, tablet ≤1024px
```

### JS

```
static/js/
├── main.js     # Navbar scroll, scroll reveal (IntersectionObserver), menú móvil,
│               # skill bars animadas, copiar email al portapapeles, flash messages
└── smoke.js    # Canvas particle system — efecto de humo morado (sin dependencias)
```

---

## Diseño — dos estéticas coexistentes

### 1. Dark mode minimalista (sitio principal)

**Referencia visual:** Subtle Folio Dark Mode (Framer template por Nur Praditya / MorvaLabs)

**Paleta de colores (variables CSS en `base.css`):**

```css
--bg-primary:     #0A0A0A   /* Fondo principal */
--bg-secondary:   #111111   /* Cards y secciones */
--bg-tertiary:    #1A1A1A   /* Hover / elevado */
--border-color:   #222222   /* Bordes sutiles */
--border-hover:   #333333   /* Bordes en hover */
--text-primary:   #FFFFFF   /* Texto principal */
--text-secondary: #888888   /* Texto secundario/muted */
--text-tertiary:  #555555   /* Labels */
--accent-green:   #4ADE80   /* Badge "disponible" */
--accent-green-bg:#0A2A1B   /* Fondo badge */
```

**Tipografía:** Google Font `Inter` (400, 500, 600, 700). Hero: 3.5rem+, weight 700. Labels: uppercase, letter-spacing 0.1em, 0.75rem.

**Principios:** mucho whitespace (80px+ entre secciones), cards con `border-radius: 12px` y hover suave, CSS transitions 0.3s + IntersectionObserver para scroll reveal.

**Prohibido:** Bootstrap, Tailwind, frameworks CSS/JS, parallax, librerías de animación.

### 2. Win95 (blog)

Los templates del blog (`post_list.html`, `post_detail.html`) y el formulario de contacto (`contact.html`) usan una estética Windows 95. Las clases CSS relevantes son `win95-input`, etc. Mantener coherencia con este estilo dentro del blog.

---

## Configuración de entorno

`.env` (no se commitea):
```
SECRET_KEY=...
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
# DATABASE_URL=  # vacío = SQLite en dev
# CSRF_TRUSTED_ORIGINS=https://tuapp.railway.app
```

`settings.py` usa `django-environ`. Si `DATABASE_URL` está definido usa PostgreSQL (`psycopg2-binary`), si no SQLite. Archivos estáticos servidos por `whitenoise`.

---

## Deploy en Railway

1. Conectar repo GitHub en Railway + plugin PostgreSQL
2. Variables: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS=.railway.app`, `CSRF_TRUSTED_ORIGINS`
3. `Procfile`: `web: gunicorn portfolio.wsgi --bind 0.0.0.0:$PORT`
4. Post-deploy: `python manage.py migrate && python manage.py createsuperuser`

---

## WhatsApp

Siempre: número `3112874770` con prefijo `+57` Colombia.
URL: `https://wa.me/573112874770?text=Hola%20Oscar%2C%20vi%20tu%20portafolio...`
