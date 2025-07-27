
import VerifyOtp from "@/components/verifyOtp";
import { Suspense } from "react";
import Loading from "@/components/loading";

const VerifyPage = () => {
 
  return (
    <Suspense fallback={<Loading />}>
      <VerifyOtp />
    </Suspense>
  )
}

export default VerifyPage