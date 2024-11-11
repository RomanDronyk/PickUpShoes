// як тут встановити strict-origin-when-cross-origin 
async function sendReviewImages(reviewId: string, formData: any) {
  if(reviewId==="" || typeof(reviewId)!=="string" || reviewId.length==0){
    throw new Error(`Введіть коректний reviewId`);
  }
  const url ="https://73dd57-2.myshopify.com/apps/easyreviews-proxy/online_store/reviews_image"
  // Відправка даних
  console.log(reviewId, "reviewId")
  const response = await fetch(`${url}/${reviewId}`, {
    method: "POST",
    headers: {
      "accept": "*/*",
      "accept-language": "uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
      "referrer-policy": "strict-origin-when-cross-origin",
    },
    body: formData,
  });

  // Обробка відповіді
  if (!response.ok) {
    console.log(JSON.stringify(response.statusText, null, 2), "23423");
    throw new Error(`Помилка при відправці фото для відгуків: ${response.statusText}`);
  }

  return await response.json();
}

export default sendReviewImages;