const convertdate = (date) => {
  let lastHB = "";
  if (date) {
    lastHB = new Date(date);
    return `${lastHB.getFullYear()}-${lastHB.getMonth()}-${lastHB.getDate()} at ${lastHB.getHours()}:${lastHB.getMinutes()}`;
  }
  return null;
};

export { convertdate };
