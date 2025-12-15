
export const maskMobile = (mobileNo: string) => {
  if (!mobileNo) return "";
  
  // Keep prefix +91 and last 2 digits
  const prefix = "+91";
  const lastTwo = mobileNo.slice(-2);
  
  return `${prefix}${"X".repeat(mobileNo.length - prefix.length - lastTwo.length)}${lastTwo}`;
};