from django.db import models
from django.utils import timezone


class Category(models.Model):
    """Categoría de posts del blog."""

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['name']

    def __str__(self):
        return self.name


class Tag(models.Model):
    """Etiqueta para posts del blog."""

    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name = 'Etiqueta'
        verbose_name_plural = 'Etiquetas'
        ordering = ['name']

    def __str__(self):
        return self.name


class Post(models.Model):
    """Entrada del blog — se muestra como archivo en el explorador de archivos Win95."""

    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('published', 'Publicado'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField(help_text="Resumen corto visible en la lista")
    content = models.TextField(help_text="Contenido completo en HTML (editor Summernote)")
    featured_image = models.ImageField(upload_to='blog/', blank=True, null=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='posts'
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-published_at', '-created_at']
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

    def __str__(self):
        return self.title

    def publish(self):
        """Publica el post estableciendo la fecha de publicación."""
        self.status = 'published'
        self.published_at = timezone.now()
        self.save()
