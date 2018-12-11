export default function(context) {
  if (process.client) {
    // 用戶端執行，沒有請求
    context.store.dispatch("initAuth", null);
    console.log("用戶端");
  } else {
    // 伺服器端執行沒有localStorage，所以要透過請求request來傳遞cookie
    context.store.dispatch("initAuth", context.req);
    console.log("伺服器端");
  }
}
