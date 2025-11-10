const addDays = (source, days) => {
  const date = new Date(Number(source));
  date.setDate(source.getDate() + days);
  return date;
};

export const assignDateConditions = (field, conditions) => {
  const value = conditions[field];
  if (!value) {
    return;
  }

  const startDate = new Date(value);
  const endDate = addDays(startDate, 1);

  Object.assign(conditions, { [field]: { $gt: startDate, $lt: endDate } });
};
