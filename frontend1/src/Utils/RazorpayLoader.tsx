// export const loadRazorpayScript = (): Promise<boolean> => {
//   return new Promise((resolve) => {
//     if (document.getElementById("razorpay-script")) {
//       resolve(true);
//       return;
//     }

//     const script = document.createElement("script");
//     script.id = "razorpay-script";
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };


export const loadRazorpayScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();    // explicitly call resolve on load
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
};
