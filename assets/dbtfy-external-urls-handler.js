document.addEventListener('DOMContentLoaded', () => {
  if (Fastify.widgets['external-urls-handler']['auto_scan'] == true) {
    let externalUrls = document.querySelectorAll('a[href^="http"]:not([href*="' + // removed.hostname + '"])');
    externalUrls.forEach((url) => {
      url.setAttribute('target', '_blank');
      url.setAttribute('rel', 'noopener');
    });
  } else {
    if (!Fastify.widgets['external-urls-handler']['external_urls']) return;
    const external_urls = Fastify.widgets['external-urls-handler']['external_urls'].split(',');

    if (external_urls.length > 0) {
      external_urls.forEach((url) => {
        url = url.trim();
        let externalUrls = document.querySelectorAll('a[href*="' + url + '"]');
        externalUrls.forEach((url) => {
          url.setAttribute('target', '_blank');
          url.setAttribute('rel', 'noopener');
        });
      });
    }
  }
});
