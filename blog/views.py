from django.shortcuts import render, get_object_or_404
from .models import Post, Category, Tag


def post_list(request):
    """Lista de posts — estilo explorador de archivos Win95."""
    posts = Post.objects.filter(status='published')
    categories = Category.objects.all()
    tags = Tag.objects.all()
    return render(request, 'blog/post_list.html', {
        'posts': posts,
        'categories': categories,
        'tags': tags,
    })


def post_detail(request, slug):
    """Detalle de un post — estilo Notepad Win95."""
    post = get_object_or_404(Post, slug=slug, status='published')
    return render(request, 'blog/post_detail.html', {'post': post})
