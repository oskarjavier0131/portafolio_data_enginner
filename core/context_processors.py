from .models import SiteConfig


def site_config(request):
    """Inyecta SiteConfig en todos los templates."""
    return {'site_config': SiteConfig.get()}
