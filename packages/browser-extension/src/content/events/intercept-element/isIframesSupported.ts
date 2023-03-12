export function isIframesSupported(iframe: HTMLIFrameElement): boolean {
  if (!iframe.src) {
    return true;
  }

  const iframeUrl = new URL(iframe.src);
  return window.location.origin === iframeUrl.origin;
}
