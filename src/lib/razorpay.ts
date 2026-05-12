export function openRazorpay({
  amount,
  description,
  email,
  onSuccess,
}: {
  amount: number;
  description: string;
  email?: string;
  onSuccess: (response: any) => void;
}) {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount,
    currency: "INR",
    name: "HeyBaby AI",
    description,
    prefill: { email: email ?? "" },
    theme: { color: "#1DAFB6" },
    handler: function (response: any) {
      onSuccess(response);
    },
  };
  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}
