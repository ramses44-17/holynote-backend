export const BiblicreferencesRegex = /^(\d?\s?[a-zA-ZÀ-ÿ]+\s\d{1,3}(:\d{1,3}(-\d{1,3})?)?(,\s\d?\s?[a-zA-ZÀ-ÿ]+\s\d{1,3}(:\d{1,3}(-\d{1,3})?)?)*)$/

export const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;




export const separateReferences = (references) => {
  
  if (!references) return [];
  return references
    .split(",")
    .map((reference) => reference.trim())
    .filter((reference) => reference.length > 0);
};


