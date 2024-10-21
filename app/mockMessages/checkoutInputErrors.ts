const checkoutInputErrors: ICheckoutInputErrors = {
  firstName: "Мінімум - 3 букви",
  lastName: "Мінімум - 3 букви",
  userEmail: "Email не правильний",
  userPhone: "Введіть правильний номер телефону",
  novaCity: "Виберіть місто",
  novaDepartment: "Виберіть віділення",
  contactType: "Виберіть спосіб зв`язку",
  userPromo: "Промокод не вірний",
}
export interface ICheckoutInputErrors {
  firstName: string,
  lastName: string,
  userEmail: string,
  userPhone: string,
  novaDepartment: string,
  contactType: string,
  userPromo: string,
  novaCity: string,
}
export default checkoutInputErrors