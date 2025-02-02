export const createNewRandomEvent = async () => {
  // ! first, determine the main type: individual, duet, world_event
  // so i want to pick a random number between 0 and 100
  // if the number is less than 5, the event is a world_event
  // if the number is less than 33, the event is a duet
  // otherwise, the event is an individual

  const mainType =
    Math.random() < 0.05
      ? "world_event"
      : Math.random() < 0.1
      ? "duet"
      : "individual";

  return mainType;
};
