export const timeSinceShorter = (date: number) => {
  const distance = new Date().getTime() - new Date(date).getTime();

  // if the distance is less than 60 seconds, return 'Just now'
  if (distance < 60000) {
    return "just now";
  }

  // if the distance is less than 60 minutes, return the number of minutes
  if (distance < 3600000) {
    if (Math.floor(distance / 60000) > 1)
      return Math.floor(distance / 60000) + "m ago";
    else return "1m ago";
  }

  // if the distance is less than 24 hours, return the number of hours
  if (distance < 86400000) {
    if (Math.floor(distance / 3600000) > 1)
      return Math.floor(distance / 3600000) + "h ago";
    else return "1h ago";
  }

  // if the distance is less than 30 days, return the number of days
  if (distance < 2592000000) {
    if (Math.floor(distance / 86400000) > 1)
      return Math.floor(distance / 86400000) + "d ago";
    else return "yesterday";
  }

  const months = Math.floor(distance / 2592000000);

  if (months > 11) {
    const years = (months / 12).toFixed(1);
    return years + " years ago";
  } else {
    return months === 1 ? "1 month ago" : months + " months ago";
  }
};
