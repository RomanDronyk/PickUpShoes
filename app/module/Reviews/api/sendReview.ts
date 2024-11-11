async function sendReview(objects: any, user: any, handle:string) {
  if(handle==="" || typeof(handle)!=="string" || handle.length==0){
    throw new Error(`Введіть коректний handle`);
  }

  // Створюємо об'єкт FormData
  const formData = new FormData();

  // Додаємо дані до FormData
  formData.append("ezrv-widget_submit_input_rating_value_0", objects["Комфорт"]);
  formData.append("ezrv-widget_submit_input_rating_id_0", "0");

  formData.append("ezrv-widget_submit_input_rating_value_1", objects["Якість"]);
  formData.append("ezrv-widget_submit_input_rating_id_1", "1");

  formData.append("ezrv-widget_submit_input_rating_value_2", objects["Дизайн"]);
  formData.append("ezrv-widget_submit_input_rating_id_2", "2");

  formData.append("ezrv-widget_submit_review_content", objects.content);
  formData.append("ezrv-widget_submit_review_title", "Review Title");

  formData.append("ezrv-widget_submit_review_user_name", `${user.customer.firstName} ${user.customer.lastName}`);
  formData.append("ezrv-widget_submit_review_user_email", user.customer.email);

  formData.append("ezrv-widget_submit_review_product", handle);
  formData.append("ezrv-widget_submit_review_request_id", "");

  // Відправка даних
  const response = await fetch("https://73dd57-2.myshopify.com/apps/easyreviews-proxy/online_store/product_reviews", {
    method: "POST",
    headers: {
      "accept": "*/*",
      "accept-language": "uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
    },
    credentials: "include",
    body: formData,
  });

  // Обробка відповіді
  if (!response.ok) {
    console.log(JSON.stringify(response.statusText, null, 2), "23423");
    throw new Error(`Помилка при відправці відгуку: ${response.statusText}`);
  }

  return await response.json();
}

export default sendReview;