from django.contrib import admin
from django_summernote.admin import SummernoteModelAdmin
from .models import Post, Category, Tag


@admin.register(Post)
class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ('content',)
    list_display = ['title', 'category', 'status', 'published_at', 'created_at']
    list_filter = ['status', 'category', 'tags']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['tags']
    date_hierarchy = 'created_at'
    actions = ['publish_posts']

    @admin.action(description="Publicar posts seleccionados")
    def publish_posts(self, request, queryset):
        for post in queryset:
            post.publish()


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ['name', 'slug']


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ['name', 'slug']
