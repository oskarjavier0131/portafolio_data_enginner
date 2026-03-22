from django.db import models


class Service(models.Model):
    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    short_desc = models.CharField(max_length=120, blank=True)
    description = models.TextField()
    icon_svg = models.TextField(blank=True, help_text="SVG inline o emoji")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Servicio'
        verbose_name_plural = 'Servicios'

    def __str__(self):
        return self.title


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('language', 'Lenguaje'),
        ('cloud', 'Cloud / Plataforma'),
        ('tool', 'Herramienta'),
        ('framework', 'Framework'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    proficiency = models.IntegerField(default=80)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Habilidad'
        verbose_name_plural = 'Habilidades'

    def __str__(self):
        return self.name


class Project(models.Model):
    TYPE_CHOICES = [
        ('data', 'Data Engineering'),
        ('automation', 'Automatización n8n'),
        ('other', 'Otro'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    short_desc = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    video = models.FileField(
        upload_to='projects/videos/',
        blank=True, null=True,
        help_text="Video demo del proyecto (mp4, webm — máx 50 MB)"
    )
    project_type = models.CharField(
        max_length=20, choices=TYPE_CHOICES, default='data',
        verbose_name="Tipo de proyecto"
    )
    technologies = models.CharField(max_length=300, blank=True, help_text="Tags separados por coma")
    url = models.URLField(blank=True)
    order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'

    def __str__(self):
        return self.title

    def get_technologies_list(self):
        return [t.strip() for t in self.technologies.split(',') if t.strip()]


class ContactMessage(models.Model):
    name = models.CharField(max_length=150, verbose_name="Nombre")
    email = models.EmailField(verbose_name="Correo electrónico")
    company = models.CharField(max_length=150, blank=True, verbose_name="Empresa")
    message = models.TextField(verbose_name="Mensaje")
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False, verbose_name="Leído")

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Mensaje de contacto'
        verbose_name_plural = 'Mensajes de contacto'

    def __str__(self):
        return f"{self.name} — {self.email}"


class SiteConfig(models.Model):
    site_title = models.CharField(max_length=100, default="Oscar Javier")
    tagline = models.CharField(max_length=200, default="Data Engineer & Cloud Solutions")
    about_text = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profile/', blank=True, null=True)
    profile_image_static = models.CharField(
        max_length=200, blank=True,
        help_text="Ruta dentro de static/ (ej: img/avatar.webp). Tiene prioridad sobre 'profile_image' para producción."
    )
    whatsapp_number = models.CharField(max_length=20, default="3112874770")
    email = models.EmailField(blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    available = models.BooleanField(default=True, verbose_name="Disponible para proyectos")

    class Meta:
        verbose_name = 'Configuración del sitio'
        verbose_name_plural = 'Configuración del sitio'

    def __str__(self):
        return "Configuración del sitio"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Certification(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nombre de la certificación")
    issuing_organization = models.CharField(max_length=200, verbose_name="Organización emisora")
    description = models.TextField(blank=True, verbose_name="Descripción", help_text="Qué cubre la certificación, habilidades validadas, etc.")
    issue_date = models.DateField(verbose_name="Fecha de emisión")
    expiration_date = models.DateField(blank=True, null=True, verbose_name="Fecha de vencimiento", help_text="Dejar en blanco si no vence")
    credential_id = models.CharField(max_length=100, blank=True, verbose_name="ID de la credencial")
    credential_url = models.URLField(blank=True, verbose_name="URL de verificación")
    image = models.ImageField(upload_to='certifications/', blank=True, null=True, verbose_name="Imagen / Badge")
    order = models.IntegerField(default=0, verbose_name="Orden")

    class Meta:
        ordering = ['order', '-issue_date']
        verbose_name = 'Certificación'
        verbose_name_plural = 'Certificaciones'

    def __str__(self):
        return self.name

    @property
    def is_expired(self):
        if not self.expiration_date:
            return False
        from django.utils import timezone
        return self.expiration_date < timezone.now().date()
