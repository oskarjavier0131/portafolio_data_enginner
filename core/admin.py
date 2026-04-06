from django.contrib import admin
from django.utils.html import format_html
from .models import Service, Skill, Project, ContactMessage, SiteConfig, Certification


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['cert_image_thumb', 'name', 'issuing_organization', 'issue_date', 'expiration_date', 'order']
    list_display_links = ['name']
    list_editable = ['order']
    search_fields = ['name', 'issuing_organization', 'credential_id']
    readonly_fields = ['cert_image_preview']
    fieldsets = (
        ('Información principal', {
            'fields': ('name', 'issuing_organization', 'description'),
        }),
        ('Imagen / Badge', {
            'fields': ('image', 'cert_image_preview'),
        }),
        ('Fechas', {
            'fields': ('issue_date', 'expiration_date'),
        }),
        ('Credencial', {
            'fields': ('credential_id', 'credential_url'),
        }),
        ('Configuración', {
            'fields': ('order',),
        }),
    )

    @admin.display(description='Badge')
    def cert_image_thumb(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width:48px;height:48px;object-fit:contain;border-radius:6px;">', obj.image.url)
        return '—'

    @admin.display(description='Vista previa')
    def cert_image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width:240px;max-height:240px;object-fit:contain;border-radius:8px;border:1px solid #333;">', obj.image.url)
        return 'Sin imagen'


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'order']
    list_editable = ['order', 'proficiency']
    list_filter = ['category']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'project_type', 'short_desc', 'is_featured', 'order']
    list_editable = ['is_featured', 'order']
    list_filter = ['project_type', 'is_featured']
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Información principal', {
            'fields': ('title', 'slug', 'short_desc', 'description', 'project_type'),
        }),
        ('Media', {
            'fields': ('image',),
        }),
        ('Detalles', {
            'fields': ('technologies', 'url', 'order', 'is_featured'),
        }),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'company', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'company']
    readonly_fields = ['name', 'email', 'company', 'message', 'created_at']
    list_editable = ['is_read']

    def has_add_permission(self, request):
        return False


@admin.register(SiteConfig)
class SiteConfigAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Identidad', {
            'fields': ('site_title', 'tagline', 'about_text', 'profile_image', 'profile_image_static'),
        }),
        ('Contacto y redes', {
            'fields': ('whatsapp_number', 'email', 'github_url', 'linkedin_url', 'available'),
        }),
        ('Widget Clippy', {
            'fields': ('clippy_enabled', 'clippy_default_message', 'clippy_delay_desktop', 'clippy_delay_mobile'),
            'description': 'Asistente inteligente flotante que guía al visitante hacia WhatsApp.',
        }),
    )

    def has_add_permission(self, request):
        return not SiteConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
