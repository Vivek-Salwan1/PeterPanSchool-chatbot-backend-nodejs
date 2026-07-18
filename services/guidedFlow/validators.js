function isValidName(value) {
  const name = value.trim();
  return name.length >= 2 && /^[a-zA-Z\s'.-]+$/.test(name);
}

function isValidMobile(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidChildAge(value) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const asNumber = Number(trimmed);
  if (!Number.isNaN(asNumber)) {
    return asNumber >= 0 && asNumber <= 6;
  }
  return trimmed.length >= 1 && trimmed.length <= 30;
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

module.exports = {
  isValidName,
  isValidMobile,
  isValidEmail,
  isValidChildAge,
  isValidDate,
};
