function isFacebookTrackingLink(url) {
  // Facebook tracking URLs often have 'l.facebook.com' or 'lm.facebook.com' as the domain,
  // followed by '/l.php' or similar and the 'u=' parameter. This RegEx matches that pattern.
  const fbTrackingLinkPattern = /(l|lm)\.facebook\.com\/l\.php\?u=/;

  return fbTrackingLinkPattern.test(url);
}

function isLinkedInTrackingLink(url) {
  const regex = /^https?:\/\/www\.linkedin\.com\/redir\/.*$/;
  return regex.test(url);
}

function isTwitterTrackingLink(url) {
  return /^https?:\/\/t\.co\/[a-zA-Z0-9]+$/.test(url);
}

function isBitLyTrackingLink(url) {
  return /^https?:\/\/(www\.)?bit\.ly\/[a-zA-Z0-9]+$/.test(url);
}

function isYouTubeTrackingLink(url) {
  return /^https?:\/\/(www\.)?youtu\.be\/[a-zA-Z0-9]+$/.test(url);
}

function parseFacebookTrackingLink(trackingLink) {
  // Split by 'u=' to get the URL part
  var splitLink = trackingLink.split("u=");
  if (splitLink.length < 2) {
    return null; // Not a valid link
  }

  // The URL part is URL-encoded, so decode it
  var encodedUrl = splitLink[1].split("&")[0]; // If there are other parameters, ignore them
  var originalUrl = decodeURIComponent(encodedUrl);

  return originalUrl;
}

function parseLinkedInTrackingLink(trackingLink) {
  // Parse the URL
  const url = new URL(trackingLink);

  // Get all query parameters
  const params = new URLSearchParams(url.search);

  // Check if the 'url' parameter exists
  if (params.has("url")) {
    // Decode the URL and return it
    return decodeURIComponent(params.get("url"));
  } else {
    return null; // Not a valid link
  }
}

function parseTwitterTrackingLink(trackingLink) {
  throw Error("Twitter links are not yet supported.")
  // return originalUrl
}

function parseBitLyTrackingLink(trackingLink) {
  const match = trackingLink.match(
    /^https?:\/\/(www\.)?bit\.ly\/([a-zA-Z0-9]+)$/
  );
  if (match) {
    return decodeURIComponent(match[2]);
  }
  return null;
}

function parseYouTubeTrackingLink(trackingLink) {
  const match = trackingLink.match(
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9]+)$/
  );
  if (match) {
    return decodeURIComponent(match[2]);
  }
  return null;
}

export function parseTrackingLink(url) {
  let urlParsed = url;
  if (isFacebookTrackingLink(url)) urlParsed = parseFacebookTrackingLink(url);
  if (isLinkedInTrackingLink(url)) urlParsed = parseLinkedInTrackingLink(url);
  if (isYouTubeTrackingLink(url)) urlParsed = parseYouTubeTrackingLink(url);
  if (isTwitterTrackingLink(url)) urlParsed = parseTwitterTrackingLink(url);
  // if (isBitLyTrackingLink(url)) urlParsed = parseBitLyTrackingLink(url);

  if (url === urlParsed) {
    console.debug("Url not a tracking link");
  } else {
    console.debug(`Tracking link found: ${url} -> ${urlParsed} `);
  }

  return urlParsed;
}
