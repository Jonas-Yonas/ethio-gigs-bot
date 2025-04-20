const sessions = {};

export const getSession = (userId) => sessions[userId];

export const clearSession = (userId) => {
  delete sessions[userId];
};

export { sessions };
