import { useEffect, useState } from 'react';

export function useBrowser() {
  const [{ isChrome, isIE, isFirefox, isSafari, isOpera }, setBrowsers] =
    useState({
      isChrome: false,
      isIE: false,
      isFirefox: false,
      isSafari: false,
      isOpera: false,
    });

  useEffect(() => {
    // Get the user-agent string
    const userAgentString = navigator.userAgent;

    // Detect Chrome
    let isChrome = userAgentString.indexOf('Chrome') > -1;

    // Detect Internet Explorer
    const isIE =
      userAgentString.indexOf('MSIE') > -1 ||
      userAgentString.indexOf('rv:') > -1;

    // Detect Firefox
    const isFirefox = userAgentString.indexOf('Firefox') > -1;

    // Detect Safari
    let isSafari = userAgentString.indexOf('Safari') > -1;

    // Discard Safari since it also matches Chrome
    if (isChrome && isSafari) isSafari = false;

    // Detect Opera
    const isOpera = userAgentString.indexOf('OP') > -1;

    // Discard Chrome since it also matches Opera
    if (isChrome && isOpera) isChrome = false;

    setBrowsers({
      isChrome,
      isIE,
      isFirefox,
      isSafari,
      isOpera,
    });
  }, []);

  return {
    isChrome,
    isIE,
    isFirefox,
    isSafari,
    isOpera,
  };
}
