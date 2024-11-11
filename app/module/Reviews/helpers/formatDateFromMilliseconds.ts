const formatDateFromMilliseconds = (milliseconds: string) => {
  // Створюємо об'єкт дати з мілісекунд
  const date = new Date(parseInt(milliseconds, 10));

  // Отримуємо день, місяць і рік
  const day = date.getDate();
  const year = date.getFullYear();

  // Назви місяців українською
  const months = [
    'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
  ];

  // Отримуємо назву місяця
  const monthName = months[date.getMonth()]; // Місяці індексуються з 0

  // Форматуємо дату у вигляді "14 червня, 2023"
  return `${day} ${monthName}, ${year}`;
}
export default formatDateFromMilliseconds;