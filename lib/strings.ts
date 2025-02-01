export const extractDomain = (url: string) => {
  const domain = url.split("/")[2];
  return domain.replace("www.", "");
};

export const cleanHandle = (handle: string) => {
  return handle.trim().toLowerCase();
};

export const nl2br = (message: string) => {
  // replace nl with <br />
  return message.replace(/(?:\r\n|\r|\n)/g, "<br />").toLowerCase();
};

export const goodTwitterImage = (url: string) => {
  return url.replace("_normal", "_400x400");
};
