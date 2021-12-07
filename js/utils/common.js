export function setTextContent(parent, selector, text) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 1)}…`;
}

export function setFieldValue(form, selector, value) {
  if (!form) return;
  const element = form.querySelector(selector);
  if (value) element.value = value;
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  if (element) element.style.backgroundImage = `url(${imageUrl})`;
}

export function randomImageUrl(n) {
  if (n <= 0) return;
  const random = Math.random() * n;
  return Math.round(random);
}
